/**
 * Cloudflare Worker — Instagram Auto Publisher
 * Character Pixels
 *
 * Gira automaticamente 3 volte al giorno (configurato in wrangler.toml): 8:55, 13:55 e 18:55 ora italiana.
 * Ad ogni esecuzione:
 *   1. Legge manifest.json da R2
 *   2. Trova il primo video che non è ancora "published"
 *   3. Crea un media container su Instagram
 *   4. Aspetta che il video sia processato (retry con backoff)
 *   5. Pubblica il post
 *   6. Aggiorna manifest.json su R2 (status → "published")
 *
 * Non serve aggiornare lo status manualmente prima del caricamento —
 * il Worker pubblica qualsiasi entry che non sia già "published".
 *
 * Variabili d'ambiente (impostate con `wrangler secret put`):
 *   META_ACCESS_TOKEN        Long-Lived User Access Token
 *   INSTAGRAM_USER_ID        Instagram Business Account ID
 *
 * Variabili in wrangler.toml [vars]:
 *   R2_PUBLIC_URL            URL pubblico del bucket R2 (es. https://pub-xxx.r2.dev)
 *
 * Binding R2 (in wrangler.toml [[r2_buckets]]):
 *   R2_BUCKET                Binding al bucket R2
 */

const MANIFEST_KEY = 'manifest.json';
const IG_API_BASE = 'https://graph.facebook.com/v21.0';

// Attesa massima per il processing del video su Instagram (ms)
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minuti
// Intervallo tra i retry (ms)
const RETRY_INTERVAL_MS = 15 * 1000; // 15 secondi

export default {
    /**
     * Handler per le richieste HTTP (utile per test manuali via fetch)
     */
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response('Character Pixels Publisher — use POST to trigger manually', {
                status: 200,
            });
        }
        return await runPublisher(env);
    },

    /**
     * Handler per i cron trigger
     * Configurato in wrangler.toml: crons = ["55 7 * * *", "55 12 * * *", "55 17 * * *"]
     */
    async scheduled(event, env, ctx) {
        ctx.waitUntil(runPublisher(env));
    },
};

// ─── Logica principale ────────────────────────────────────────────────────────

async function runPublisher(env) {
    console.log(`[publisher] Avvio — ${new Date().toISOString()}`);

    // 1. Leggi il manifest da R2
    const manifest = await readManifest(env);
    if (!manifest) {
        const msg = 'manifest.json non trovato su R2';
        console.error(`[publisher] ${msg}`);
        return new Response(msg, { status: 500 });
    }

    // 2. Raccogli tutti i video non ancora pubblicati e non in errore
    const candidates = manifest
        .map((e, i) => ({ ...e, _index: i }))
        .filter(e => e.status !== 'published' && e.status !== 'error');

    if (candidates.length === 0) {
        const msg = 'Nessun video disponibile (tutti published o error)';
        console.log(`[publisher] ${msg}`);
        return new Response(msg, { status: 200 });
    }

    // 3. Prova i video in ordine — salta quelli che falliscono
    for (const entry of candidates) {
        const videoUrl = `${env.R2_PUBLIC_URL}/${entry.filename}`;
        console.log(`[publisher] Provo: ${entry.filename} (${entry.name})`);

        // Pre-check: verifica che il file esista su R2
        const headRes = await fetch(videoUrl, { method: 'HEAD' });
        if (!headRes.ok) {
            const reason = `File non trovato su R2 (HTTP ${headRes.status})`;
            console.error(`[publisher] ${reason}: ${videoUrl}`);
            manifest[entry._index].status = 'error';
            manifest[entry._index].error = reason;
            await writeManifest(env, manifest);
            continue; // prossimo video
        }

        try {
            // Crea media container su Instagram
            const containerId = await createMediaContainer(env, videoUrl, entry.caption);
            console.log(`[publisher] Container creato: ${containerId}`);

            // Aspetta che il video sia processato
            await waitForContainer(env, containerId);
            console.log(`[publisher] Container pronto`);

            // Pubblica il post
            const mediaId = await publishContainer(env, containerId);
            console.log(`[publisher] Pubblicato! Media ID: ${mediaId}`);

            // Aggiorna il manifest
            manifest[entry._index].status = 'published';
            manifest[entry._index].published_at = new Date().toISOString();
            manifest[entry._index].instagram_media_id = mediaId;
            delete manifest[entry._index].error; // rimuovi eventuali errori precedenti
            await writeManifest(env, manifest);

            const msg = `Pubblicato con successo: ${entry.name} (${entry.filename})`;
            console.log(`[publisher] ${msg}`);
            return new Response(msg, { status: 200 });

        } catch (err) {
            console.error(`[publisher] Errore con ${entry.filename}: ${err.message}`);
            manifest[entry._index].status = 'error';
            manifest[entry._index].error = err.message;
            await writeManifest(env, manifest);
            // continua con il prossimo video
        }
    }

    const msg = 'Nessun video pubblicabile — tutti i candidati hanno fallito';
    console.error(`[publisher] ${msg}`);
    return new Response(msg, { status: 500 });
}

// ─── Instagram API ────────────────────────────────────────────────────────────

/**
 * Step 1: Crea un media container per il Reel.
 * Restituisce il container ID.
 */
async function createMediaContainer(env, videoUrl, caption) {
    const url = `${IG_API_BASE}/${env.INSTAGRAM_USER_ID}/media`;

    const body = new URLSearchParams({
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption,
        access_token: env.META_ACCESS_TOKEN,
    });

    const res = await fetch(url, {
        method: 'POST',
        body,
    });

    const data = await res.json();

    if (!res.ok || data.error) {
        throw new Error(`createMediaContainer fallita: ${JSON.stringify(data.error || data)}`);
    }

    return data.id;
}

/**
 * Step 2: Aspetta che Instagram finisca di processare il video.
 * Controlla lo status ogni RETRY_INTERVAL_MS fino a MAX_WAIT_MS.
 */
async function waitForContainer(env, containerId) {
    const deadline = Date.now() + MAX_WAIT_MS;

    while (Date.now() < deadline) {
        const status = await getContainerStatus(env, containerId);

        if (status === 'FINISHED') {
            return;
        }

        if (status === 'ERROR' || status === 'EXPIRED') {
            console.error(`[publisher] Container in stato ${status} per il container ${containerId}`);
            throw new Error(`Container in stato ${status} — il video non può essere pubblicato`);
        }

        // status è IN_PROGRESS o PUBLISHED o altro — aspetta
        console.log(`[publisher] Container status: ${status} — attendo ${RETRY_INTERVAL_MS / 1000}s...`);
        await sleep(RETRY_INTERVAL_MS);
    }

    throw new Error(`Timeout: il container non è diventato FINISHED entro ${MAX_WAIT_MS / 1000}s`);
}

/**
 * Recupera lo status di un media container.
 */
async function getContainerStatus(env, containerId) {
    const url = `${IG_API_BASE}/${containerId}?fields=status_code&access_token=${env.META_ACCESS_TOKEN}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
        throw new Error(`getContainerStatus fallita: ${JSON.stringify(data.error || data)}`);
    }

    return data.status_code;
}

/**
 * Step 3: Pubblica il container.
 * Restituisce il media ID del post pubblicato.
 */
async function publishContainer(env, containerId) {
    const url = `${IG_API_BASE}/${env.INSTAGRAM_USER_ID}/media_publish`;

    const body = new URLSearchParams({
        creation_id: containerId,
        access_token: env.META_ACCESS_TOKEN,
    });

    const res = await fetch(url, {
        method: 'POST',
        body,
    });

    const data = await res.json();

    if (!res.ok || data.error) {
        throw new Error(`publishContainer fallita: ${JSON.stringify(data.error || data)}`);
    }

    return data.id;
}

// ─── R2 helpers ───────────────────────────────────────────────────────────────

async function readManifest(env) {
    const obj = await env.R2_BUCKET.get(MANIFEST_KEY);
    if (!obj) return null;
    const text = await obj.text();
    return JSON.parse(text);
}

async function writeManifest(env, manifest) {
    const json = JSON.stringify(manifest, null, 2);
    await env.R2_BUCKET.put(MANIFEST_KEY, json, {
        httpMetadata: { contentType: 'application/json' },
    });
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
