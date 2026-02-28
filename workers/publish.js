/**
 * Cloudflare Worker — Character Pixels Publisher + Dashboard + Batch Manager
 *
 * Routes:
 *   GET  /                          → Dashboard (coda, stats, preview)
 *   GET  /batch                     → Batch Manager (genera + upload R2)
 *   POST /trigger                   → Pubblica ora (trigger manuale)
 *   POST /reset-error?filename=X    → Reset singolo errore → pending
 *   POST /reset-bulk                → Reset tutti gli errori recuperabili (no 404)
 *   PUT  /api/file?name=X           → Upload file su R2 (mp4 o json)
 *   POST /api/manifest?mode=X       → Aggiorna manifest (replace | merge)
 *
 * Secrets (wrangler secret put):
 *   META_ACCESS_TOKEN   — Long-Lived User Access Token
 *   INSTAGRAM_USER_ID   — Instagram Business Account ID
 *   DASHBOARD_KEY       — (opzionale) Protegge le pagine con ?key=VALUE
 *
 * Vars (wrangler.toml [vars]):
 *   R2_PUBLIC_URL       — URL pubblico del bucket R2
 *
 * Binding R2 (wrangler.toml [[r2_buckets]]):
 *   R2_BUCKET           — Binding al bucket R2
 */

const MANIFEST_KEY      = 'manifest.json';
const IG_API_BASE       = 'https://graph.facebook.com/v21.0';
const MAX_WAIT_MS       = 90 * 1000;  // 90s — i video impiegano ~30s, margine ampio
const RETRY_INTERVAL_MS = 10 * 1000;  // polling ogni 10s

// Orari cron in UTC — sincronizzati con wrangler.toml
// Ora solare (CET = UTC+1):  7:55 → 8:55 | 12:55 → 13:55 | 17:55 → 18:55
const CRON_UTC = [
    { h: 7,  m: 55 },
    { h: 12, m: 55 },
    { h: 17, m: 55 },
];

// ─── Entry point ──────────────────────────────────────────────────────────────

export default {
    /**
     * HTTP handler — serve le pagine e accetta trigger/API
     */
    async fetch(request, env) {
        const url    = new URL(request.url);
        const method = request.method;

        // Auth: se DASHBOARD_KEY è impostato, richiede ?key=VALUE su tutte le route
        if (env.DASHBOARD_KEY && url.searchParams.get('key') !== env.DASHBOARD_KEY) {
            return new Response('Unauthorized — aggiungi ?key=YOUR_KEY alla URL', { status: 401 });
        }

        if (method === 'GET') {
            if (url.pathname === '/batch') return renderBatchPage(env, url);
            return renderDashboard(env, url);
        }

        if (method === 'POST') {
            if (url.pathname === '/trigger')      { await runPublisher(env); return redirectTo(url, '/'); }
            if (url.pathname === '/reset-error')  { await resetError(env, url.searchParams.get('filename')); return redirectTo(url, '/'); }
            if (url.pathname === '/reset-bulk')   { const n = await resetBulk(env); return redirectTo(url, '/', `Reset ${n} voci`); }
            if (url.pathname === '/publish-one')  { const msg = await publishOne(env, url.searchParams.get('filename')); return redirectTo(url, '/', msg); }
            if (url.pathname === '/move-top')     { await moveTop(env, url.searchParams.get('filename')); return redirectTo(url, '/'); }
            if (url.pathname === '/move-bottom')  { await moveBottom(env, url.searchParams.get('filename')); return redirectTo(url, '/'); }
            if (url.pathname === '/remove')       { const fn = url.searchParams.get('filename'); await removeEntry(env, fn); return redirectTo(url, '/', `Rimosso: ${fn}`); }
            if (url.pathname === '/api/manifest') return handleManifestUpdate(request, env, url);
        }

        if (method === 'PUT') {
            if (url.pathname === '/api/file') return handleFileUpload(request, env, url);
        }

        return renderDashboard(env, url);
    },

    /**
     * Cron handler — configurato in wrangler.toml
     */
    async scheduled(event, env, ctx) {
        ctx.waitUntil(runPublisher(env));
    },
};

// ─── Logica principale ────────────────────────────────────────────────────────

async function runPublisher(env) {
    console.log(`[publisher] Avvio — ${new Date().toISOString()}`);

    let manifest;
    try {
        manifest = await readManifest(env);
    } catch (err) {
        const msg = `Errore lettura manifest: ${err.message}`;
        console.error(`[publisher] ${msg}`);
        return new Response(msg, { status: 500 });
    }

    if (!manifest) {
        const msg = 'manifest.json non trovato su R2';
        console.error(`[publisher] ${msg}`);
        return new Response(msg, { status: 500 });
    }

    // Candidati: tutto tranne 'published' ed 'error'
    // Priorità ai container_created (resume di container già avviati)
    const candidates = manifest
        .map((e, i) => ({ ...e, _index: i }))
        .filter(e => e.status !== 'published' && e.status !== 'error');

    if (candidates.length === 0) {
        const msg = 'Nessun video disponibile (tutti published o error)';
        console.log(`[publisher] ${msg}`);
        return new Response(msg, { status: 200 });
    }

    // Processa UN solo video per run (CF Workers: limite 50 subrequest)
    const entry    = candidates.find(e => e.status === 'container_created') ?? candidates[0];
    const videoUrl = `${env.R2_PUBLIC_URL}/${entry.filename}`;
    console.log(`[publisher] Provo: ${entry.filename} (${entry.name ?? '-'})`);

    try {
        let containerId = entry.container_id ?? null;

        if (!containerId) {
            // Verifica che il file esista su R2
            let headRes;
            try {
                headRes = await fetch(videoUrl, { method: 'HEAD' });
            } catch (fetchErr) {
                throw new Error(`Fetch HEAD fallita: ${fetchErr.message}`);
            }

            if (!headRes.ok) {
                throw new Error(`File non trovato su R2 (HTTP ${headRes.status}): ${entry.filename}`);
            }

            containerId = await createMediaContainer(env, videoUrl, entry.caption);
            console.log(`[publisher] Container creato: ${containerId}`);

            // Salva containerId subito (resilienza ai timeout)
            manifest[entry._index].status       = 'container_created';
            manifest[entry._index].container_id = containerId;
            await writeManifest(env, manifest);
        } else {
            console.log(`[publisher] Riprendo container esistente: ${containerId}`);
        }

        // Aspetta che Instagram finisca di processare il video
        await waitForContainer(env, containerId);
        console.log(`[publisher] Container FINISHED — pubblico`);

        // Pubblica il post
        const mediaId = await publishContainer(env, containerId);
        console.log(`[publisher] Pubblicato! Media ID: ${mediaId}`);

        // Aggiorna manifest
        manifest[entry._index].status             = 'published';
        manifest[entry._index].published_at       = new Date().toISOString();
        manifest[entry._index].instagram_media_id = mediaId;
        delete manifest[entry._index].container_id;
        delete manifest[entry._index].error;
        await writeManifest(env, manifest);

        const msg = `Pubblicato: ${entry.name} (${entry.filename})`;
        console.log(`[publisher] ${msg}`);
        return new Response(msg, { status: 200 });

    } catch (err) {
        const isTimeout = err.message.startsWith('Timeout');

        if (isTimeout && manifest[entry._index].status === 'container_created') {
            // Container creato ma non ancora FINISHED — riprova al prossimo cron
            const msg = `Timeout per ${entry.filename} — riprendo al prossimo giro`;
            console.log(`[publisher] ${msg}`);
            return new Response(msg, { status: 200 });
        }

        console.error(`[publisher] Errore con ${entry.filename}: ${err.message}`);
        manifest[entry._index].status = 'error';
        manifest[entry._index].error  = err.message;
        delete manifest[entry._index].container_id;
        await writeManifest(env, manifest);

        return new Response(err.message, { status: 500 });
    }
}

// ─── Reset helpers ─────────────────────────────────────────────────────────────

async function resetError(env, filename) {
    if (!filename) return;
    let manifest;
    try { manifest = await readManifest(env); } catch { return; }
    if (!manifest) return;

    const idx = manifest.findIndex(e => e.filename === filename);
    if (idx === -1) return;

    manifest[idx].status = 'pending';
    delete manifest[idx].error;
    delete manifest[idx].container_id;
    await writeManifest(env, manifest);
}

async function resetBulk(env) {
    let manifest;
    try { manifest = await readManifest(env); } catch { return 0; }
    if (!manifest) return 0;

    let count = 0;
    for (const entry of manifest) {
        const err   = entry.error ?? '';
        const is404 = err.includes('404') || err.includes('non trovato su R2');

        if (entry.status === 'container_created') {
            entry.status = 'pending';
            delete entry.container_id;
            delete entry.error;
            count++;
        } else if (entry.status === 'error' && !is404) {
            entry.status = 'pending';
            delete entry.error;
            delete entry.container_id;
            count++;
        }
    }

    if (count > 0) await writeManifest(env, manifest);
    return count;
}

// ─── Per-entry operations ─────────────────────────────────────────────────────

/**
 * Pubblica immediatamente un video specifico (bypass ordine coda).
 */
async function publishOne(env, filename) {
    if (!filename) return 'Nessun filename specificato';
    let manifest;
    try { manifest = await readManifest(env); } catch (err) { return `Errore: ${err.message}`; }
    if (!manifest) return 'Manifest non disponibile';

    const idx = manifest.findIndex(e => e.filename === filename);
    if (idx === -1) return `Non trovato: ${filename}`;
    const entry = manifest[idx];

    const videoUrl = `${env.R2_PUBLIC_URL}/${entry.filename}`;

    try {
        let containerId = entry.container_id ?? null;

        if (!containerId) {
            let headRes;
            try { headRes = await fetch(videoUrl, { method: 'HEAD' }); }
            catch (fetchErr) { throw new Error(`Fetch HEAD fallita: ${fetchErr.message}`); }

            if (!headRes.ok) throw new Error(`File non trovato su R2 (HTTP ${headRes.status}): ${entry.filename}`);

            containerId = await createMediaContainer(env, videoUrl, entry.caption);
            console.log(`[publish-one] Container creato: ${containerId}`);

            manifest[idx].status       = 'container_created';
            manifest[idx].container_id = containerId;
            await writeManifest(env, manifest);
        } else {
            console.log(`[publish-one] Riprendo container esistente: ${containerId}`);
        }

        await waitForContainer(env, containerId);
        const mediaId = await publishContainer(env, containerId);
        console.log(`[publish-one] Pubblicato! Media ID: ${mediaId}`);

        manifest[idx].status             = 'published';
        manifest[idx].published_at       = new Date().toISOString();
        manifest[idx].instagram_media_id = mediaId;
        delete manifest[idx].container_id;
        delete manifest[idx].error;
        await writeManifest(env, manifest);

        return `Pubblicato: ${entry.name ?? filename}`;

    } catch (err) {
        const isTimeout = err.message.startsWith('Timeout');
        if (isTimeout && manifest[idx].status === 'container_created') {
            return `Timeout per ${filename} — riprendo al prossimo trigger`;
        }
        manifest[idx].status = 'error';
        manifest[idx].error  = err.message;
        delete manifest[idx].container_id;
        await writeManifest(env, manifest);
        return `Errore: ${err.message}`;
    }
}

/**
 * Sposta un video in cima alla coda (indice 0 del manifest).
 */
async function moveTop(env, filename) {
    if (!filename) return;
    let manifest;
    try { manifest = await readManifest(env); } catch { return; }
    if (!manifest) return;

    const idx = manifest.findIndex(e => e.filename === filename);
    if (idx <= 0) return;

    const [entry] = manifest.splice(idx, 1);
    manifest.unshift(entry);
    await writeManifest(env, manifest);
}

/**
 * Sposta un video in fondo alla coda (ultimo indice del manifest).
 */
async function moveBottom(env, filename) {
    if (!filename) return;
    let manifest;
    try { manifest = await readManifest(env); } catch { return; }
    if (!manifest) return;

    const idx = manifest.findIndex(e => e.filename === filename);
    if (idx === -1 || idx === manifest.length - 1) return;

    const [entry] = manifest.splice(idx, 1);
    manifest.push(entry);
    await writeManifest(env, manifest);
}

/**
 * Rimuove un video dal manifest.
 */
async function removeEntry(env, filename) {
    if (!filename) return;
    let manifest;
    try { manifest = await readManifest(env); } catch { return; }
    if (!manifest) return;

    const filtered = manifest.filter(e => e.filename !== filename);
    if (filtered.length === manifest.length) return;
    await writeManifest(env, filtered);
}

// ─── API handlers ──────────────────────────────────────────────────────────────

/**
 * PUT /api/file?name=filename.mp4
 * Carica un singolo file su R2. Supporta .mp4 e .json.
 */
async function handleFileUpload(request, env, url) {
    const name = url.searchParams.get('name');
    if (!name) return jsonResponse({ ok: false, error: 'Missing ?name param' }, 400);

    // Whitelist estensioni
    if (!name.endsWith('.mp4') && !name.endsWith('.json')) {
        return jsonResponse({ ok: false, error: 'Solo file .mp4 e .json sono permessi' }, 400);
    }

    const body = await request.arrayBuffer();
    const ct   = name.endsWith('.mp4') ? 'video/mp4' : 'application/json';

    await env.R2_BUCKET.put(name, body, { httpMetadata: { contentType: ct } });
    console.log(`[batch] Upload: ${name} (${body.byteLength} bytes)`);

    return jsonResponse({ ok: true, name, bytes: body.byteLength });
}

/**
 * POST /api/manifest?mode=replace|merge
 * Aggiorna manifest.json su R2.
 *   replace — sovrascrive completamente
 *   merge   — aggiunge nuove voci, mantiene le esistenti (no duplicati per filename)
 */
async function handleManifestUpdate(request, env, url) {
    const mode = url.searchParams.get('mode') ?? 'replace';

    let incoming;
    try {
        incoming = await request.json();
    } catch {
        return jsonResponse({ ok: false, error: 'Body JSON non valido' }, 400);
    }
    if (!Array.isArray(incoming)) {
        return jsonResponse({ ok: false, error: 'Il body deve essere un array JSON' }, 400);
    }

    if (mode === 'replace') {
        await writeManifest(env, incoming);
        console.log(`[batch] Manifest sostituito: ${incoming.length} voci`);
        return jsonResponse({ ok: true, mode: 'replace', count: incoming.length });
    }

    // merge
    const existing    = (await readManifest(env)) ?? [];
    const existingSet = new Set(existing.map(e => e.filename));
    const toAdd       = incoming.filter(e => !existingSet.has(e.filename));
    const merged      = [...existing, ...toAdd];

    await writeManifest(env, merged);
    console.log(`[batch] Manifest merge: +${toAdd.length} nuovi, ${merged.length} totali`);
    return jsonResponse({ ok: true, mode: 'merge', added: toAdd.length, total: merged.length });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function renderDashboard(env, url) {
    let manifest    = null;
    let manifestErr = null;
    try {
        manifest = await readManifest(env);
    } catch (err) {
        manifestErr = err.message;
    }

    const now      = new Date();
    const nextCron = getNextCronTime(now);
    const diff     = nextCron - now;
    const hh       = Math.floor(diff / 3600000);
    const mm       = Math.floor((diff % 3600000) / 60000);
    const ss       = Math.floor((diff % 60000) / 1000);

    const keyVal   = env.DASHBOARD_KEY ? (url.searchParams.get('key') ?? '') : null;
    const keyParam = keyVal !== null ? `?key=${encodeURIComponent(keyVal)}` : '';

    // 'ready' (da generate-batch.js) è equivalente a 'pending'
    const stats = manifest ? {
        total:      manifest.length,
        published:  manifest.filter(e => e.status === 'published').length,
        pending:    manifest.filter(e => !e.status || e.status === 'pending' || e.status === 'ready').length,
        processing: manifest.filter(e => e.status === 'container_created').length,
        error:      manifest.filter(e => e.status === 'error').length,
    } : null;

    const candidates = manifest
        ? manifest.filter(e => e.status !== 'published' && e.status !== 'error')
        : [];
    const nextEntry = candidates.find(e => e.status === 'container_created') ?? candidates[0] ?? null;
    const nextSrc   = nextEntry ? `${env.R2_PUBLIC_URL}/${encodeURIComponent(nextEntry.filename)}` : null;

    const cronDisplay = CRON_UTC.map(({ h, m }) => {
        const d = new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m
        ));
        return d.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });
    }).join('  ·  ');

    const flash = url.searchParams.get('flash');

    const rows = manifest ? manifest.map((entry, i) => {
        const s   = entry.status;
        const src = `${env.R2_PUBLIC_URL}/${encodeURIComponent(entry.filename ?? '')}`;

        const badgeClass = s === 'published'        ? 'pub'
            : s === 'error'             ? 'err'
            : s === 'container_created' ? 'proc'
            : 'pend';
        const badgeLabel = s === 'published'        ? '✓ published'
            : s === 'error'             ? '✗ error'
            : s === 'container_created' ? '⟳ processing'
            : '○ pending';

        const detail = s === 'error' && entry.error
            ? `<div class="det err-t">${esc(entry.error)}</div>`
            : s === 'published' && entry.published_at
            ? `<div class="det mut">${new Date(entry.published_at).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</div>`
            : s === 'container_created' && entry.container_id
            ? `<div class="det mut">id: ${esc(entry.container_id)}</div>`
            : '';

        const typeClass = entry.type === 'monster' ? 'type-m' : 'type-h';
        const typeLabel = entry.type === 'monster' ? 'monster' : 'human';

        const fn  = `filename=${encodeURIComponent(entry.filename)}`;
        const sep = keyParam ? `${keyParam}&${fn}` : `?${fn}`;

        const isActive = (s === 'pending' || s === 'ready' || s === 'error');

        const publishBtn   = isActive
            ? `<form method="POST" action="/publish-one${sep}"><button class="btn btn-sm btn-ps" title="Pubblica ora">▶ Pubblica</button></form>`
            : '';
        const resetBtn     = s === 'error'
            ? `<form method="POST" action="/reset-error${sep}"><button class="btn btn-sm">↺ Reset</button></form>`
            : '';
        const moveTopBtn   = isActive
            ? `<form method="POST" action="/move-top${sep}"><button class="btn btn-sm" title="Porta in cima alla coda">↑ Prima</button></form>`
            : '';
        const moveBottomBtn = isActive
            ? `<form method="POST" action="/move-bottom${sep}"><button class="btn btn-sm" title="Manda in fondo alla coda">↓ Ultima</button></form>`
            : '';
        const removeBtn    = `<form method="POST" action="/remove${sep}" onsubmit="return confirm('Rimuovere dal manifest: ${esc(entry.name ?? entry.filename)}?')"><button class="btn btn-sm btn-del" title="Rimuovi dal manifest">✕</button></form>`;

        return `<tr>
          <td class="n">${i + 1}</td>
          <td class="td-video"><video src="${src}" preload="metadata" controls playsinline></video></td>
          <td class="td-name"><div class="char-name">${esc(entry.name ?? '-')}</div><span class="tbadge ${typeClass}">${typeLabel}</span></td>
          <td class="td-status"><span class="badge ${badgeClass}">${badgeLabel}</span>${detail}</td>
          <td class="td-actions"><div class="acts">${resetBtn}${publishBtn}${moveTopBtn}${moveBottomBtn}${removeBtn}</div></td>
        </tr>`;
    }).join('') : '';

    const batchHref = `/batch${keyParam}`;

    const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Character Pixels · Dashboard</title>
<style>${baseCSS()}
td.td-video{width:84px;padding:4px 8px}
td.td-video video{width:72px;aspect-ratio:9/16;border-radius:4px;background:#0a0a0a;display:block;object-fit:contain}
td.td-name{padding:8px 10px}
td.td-status{padding:8px 10px;min-width:140px}
td.td-actions{padding:4px 6px;min-width:160px}
.acts{display:flex;flex-wrap:wrap;gap:5px;align-items:center}
</style>
</head>
<body>
<div class="nav">
  <span class="nav-cur">● Publisher</span>
  <a href="${batchHref}" class="nav-link">Batch Manager →</a>
</div>
<h1>Character Pixels · Publisher</h1>
<div class="sub">${now.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })} (CET) &nbsp;·&nbsp; UTC ${now.toISOString().slice(0, 19)}</div>
<div class="quick-links">
  <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">Cloudflare ↗</a>
  <a href="https://dash.cloudflare.com/?to=/:account/workers/services/view/character-pixels-publisher/production/observability/logs" target="_blank" rel="noopener">Worker Logs ↗</a>
  <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener">Graph API Explorer ↗</a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener">Instagram ↗</a>
</div>

${manifestErr ? `<div class="err-banner">⚠ Errore lettura manifest: ${esc(manifestErr)}</div>` : ''}
${flash       ? `<div class="ok-banner">✓ ${esc(flash)}</div>` : ''}

${stats ? `<div class="row">
  <div class="card c-total"><div class="lbl">Totale</div><div class="val">${stats.total}</div></div>
  <div class="card c-pub">  <div class="lbl">Published</div><div class="val">${stats.published}</div></div>
  <div class="card c-pend"> <div class="lbl">In coda</div><div class="val">${stats.pending}</div></div>
  <div class="card c-proc"> <div class="lbl">Processing</div><div class="val">${stats.processing}</div></div>
  <div class="card c-err">  <div class="lbl">Error</div><div class="val">${stats.error}</div></div>
  <div class="card cron-card">
    <div class="lbl">Prossima esecuzione</div>
    <div class="val" id="cdown">${hh}h ${mm}m ${ss}s</div>
    <div class="abs">${nextCron.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })} (CET)</div>
    <div class="sched">Schedule (CET): ${cronDisplay}</div>
  </div>
  <div class="card next-card">
    ${nextSrc ? `<video src="${nextSrc}" preload="metadata" controls playsinline></video>` : ''}
    <div class="next-info">
      <div class="lbl">Prossimo in coda</div>
      ${nextEntry
        ? `<div class="next-name">${esc(nextEntry.name)}</div>
           <span class="tbadge ${nextEntry.type === 'monster' ? 'type-m' : 'type-h'}">${nextEntry.type ?? 'human'}</span>`
        : `<div class="next-none">nessun video in coda</div>`}
    </div>
  </div>
</div>` : ''}

<div class="actions">
  <form method="POST" action="/trigger${keyParam}">
    <button class="btn btn-primary">▶ Pubblica ora</button>
  </form>
  <form method="POST" action="/reset-bulk${keyParam}" onsubmit="return confirm('Reset tutti gli errori recuperabili (no 404)?')">
    <button class="btn btn-danger">↺ Pulisci manifest</button>
  </form>
  <a href="${batchHref}" class="btn">⚙ Batch Manager</a>
  <button class="btn" onclick="location.reload()">↻ Aggiorna</button>
</div>

${manifest
    ? `<table>
        <thead><tr><th>#</th><th>Preview</th><th>Personaggio</th><th>Status</th><th>Azioni</th></tr></thead>
        <tbody>${rows}</tbody>
       </table>`
    : '<div class="err-banner">Manifest non disponibile</div>'}

<div class="footer">Auto-refresh tra <span id="rc">30</span>s</div>

<script>
var t0 = ${nextCron.getTime()};
var el = document.getElementById('cdown');
var rc = document.getElementById('rc');
var rs = 30;
setInterval(function() {
    var d = Math.max(0, t0 - Date.now());
    var h = (d / 3600000 | 0);
    var m = (d % 3600000 / 60000 | 0);
    var s = (d % 60000 / 1000 | 0);
    if (el) el.textContent = h + 'h ' + m + 'm ' + s + 's';
    rs--;
    if (rc) rc.textContent = rs;
    if (rs <= 0) location.reload();
}, 1000);
if (location.search.includes('flash=')) {
    var u = new URL(location.href);
    u.searchParams.delete('flash');
    history.replaceState(null, '', u.toString());
}
</script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

// ─── Batch Manager page ───────────────────────────────────────────────────────

function renderBatchPage(env, url) {
    const now      = new Date();
    const keyVal   = env.DASHBOARD_KEY ? (url.searchParams.get('key') ?? '') : null;
    const keyParam = keyVal !== null ? `?key=${encodeURIComponent(keyVal)}` : '';

    // keyParam embeds into the JS for fetch calls
    // Escape it safely — it's either empty or ?key=<alphanumeric>
    const safeKeyParam = esc(keyParam);

    const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Character Pixels · Batch Manager</title>
<style>${baseCSS()}
/* ── Batch-specific styles ── */
.sect{background:#141414;border:1px solid #222;border-radius:8px;padding:20px;margin-bottom:16px}
.sect-hd{font-size:10px;color:#444;text-transform:uppercase;letter-spacing:.8px;margin-bottom:16px;font-weight:400}
.field{margin-bottom:14px}
.field label{display:block;font-size:11px;color:#666;margin-bottom:6px;letter-spacing:.2px}
.field .hint{font-size:10px;color:#3a3a3a;margin-top:4px}
input[type="number"],input[type="text"],select{background:#0c0c0c;border:1px solid #2a2a2a;color:#d4d4d4;padding:6px 10px;border-radius:5px;font-family:inherit;font-size:12px;outline:none;transition:border-color .15s}
input[type="number"]:focus,input[type="text"]:focus,select:focus{border-color:#7c6af7}
input[type="range"]{accent-color:#7c6af7;cursor:pointer;vertical-align:middle}
.rng-row{display:flex;align-items:center;gap:10px}
.rng-val{font-size:13px;color:#7c6af7;min-width:90px;font-variant-numeric:tabular-nums}
.cmd-box{background:#0c0c0c;border:1px solid #2a2a2a;border-radius:6px;padding:12px 14px;display:flex;align-items:center;gap:10px;margin-top:2px}
.cmd-box code{flex:1;font-size:12px;color:#8dc88d;word-break:break-all;font-family:inherit;white-space:pre-wrap}
.upload-btns{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.file-info{font-size:12px;color:#444;min-height:20px;margin-bottom:10px;line-height:1.7}
.file-info .ok{color:#4caf50}
.file-info .no{color:#666}
.mode-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:12px;color:#666}
.prog-wrap{display:none;margin-top:12px}
.prog-bar{height:4px;background:#1a1a1a;border-radius:2px;overflow:hidden;margin-bottom:8px}
.prog-fill{height:100%;background:#7c6af7;width:0;transition:width .3s}
.prog-info{display:flex;justify-content:space-between;font-size:11px;color:#3a3a3a}
.log-box{margin-top:10px;max-height:110px;overflow-y:auto;font-size:11px;color:#3a3a3a;line-height:1.7}
.log-box .ok{color:#4caf50}
.log-box .er{color:#e05252}
.log-box .go{color:#7c6af7}
.result-banner{margin-top:10px;border-radius:6px;padding:10px 14px;font-size:12px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:600px){.two-col{grid-template-columns:1fr}}
/* Optional param rows with checkbox */
.opt-param{margin-bottom:12px}
.chk-label{display:flex;align-items:center;gap:7px;font-size:11px;color:#666;cursor:pointer;margin-bottom:6px;user-select:none}
.chk-label input[type="checkbox"]{accent-color:#7c6af7;width:13px;height:13px;cursor:pointer;flex-shrink:0}
.chk-label .param-name{color:#d4d4d4;font-size:11px}
.chk-label .param-desc{color:#3a3a3a;font-size:10px}
input:disabled{opacity:.3;cursor:not-allowed}
.params-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:640px){.params-grid{grid-template-columns:1fr}}
.required-params{margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #1c1c1c}
.optional-label{font-size:10px;color:#3a3a3a;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
</style>
</head>
<body>
<div class="nav">
  <a href="/${keyParam}" class="nav-link">← Publisher</a>
  <span class="nav-cur">● Batch Manager</span>
</div>
<h1>Character Pixels · Batch Manager</h1>
<div class="sub">${now.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })} (CET)</div>

<!-- ── Sezione 1: Genera batch ── -->
<div class="sect">
  <div class="sect-hd">1 — Genera batch in locale</div>

  <!-- Parametri obbligatori -->
  <div class="required-params">
    <div class="two-col">
      <div class="field">
        <label>Totale video</label>
        <input type="number" id="total" value="120" min="1" max="2000" style="width:110px">
      </div>
      <div class="field">
        <label>Mostri: <span id="mpct-lbl" style="color:#7c6af7">20%</span> &nbsp;·&nbsp; <span id="monsters-n" style="color:#c85050">24</span> mostri · <span id="humans-n" style="color:#5c8df6">96</span> umani</label>
        <div class="rng-row">
          <input type="range" id="mpct" min="0" max="100" value="20" style="width:180px">
          <span class="rng-val" id="mpct-rng">20%</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Parametri opzionali con checkbox -->
  <div class="optional-label">Parametri opzionali</div>
  <div class="params-grid">

    <div class="opt-param">
      <label class="chk-label">
        <input type="checkbox" id="use-seed">
        <span class="param-name">--seed</span>
        <span class="param-desc">batch deterministico</span>
      </label>
      <input type="number" id="seed" placeholder="es. 42718301" style="width:160px" disabled min="1" max="2147483647">
    </div>

    <div class="opt-param">
      <label class="chk-label">
        <input type="checkbox" id="use-output">
        <span class="param-name">--output</span>
        <span class="param-desc">cartella di destinazione</span>
      </label>
      <input type="text" id="output" placeholder="./output" style="width:180px" disabled>
    </div>

    <div class="opt-param">
      <label class="chk-label">
        <input type="checkbox" id="use-size">
        <span class="param-name">--size</span>
        <span class="param-desc">canvas pixel size (default 50)</span>
      </label>
      <input type="number" id="size" value="50" min="10" max="300" style="width:100px" disabled>
    </div>

    <div class="opt-param">
      <label class="chk-label">
        <input type="checkbox" id="use-humans">
        <span class="param-name">--humans</span>
        <span class="param-desc">numero umani (alternativa a %)</span>
      </label>
      <input type="number" id="humans-direct" placeholder="es. 96" style="width:100px" disabled>
    </div>

  </div>

  <!-- Comando CLI generato -->
  <div class="field" style="margin-top:18px">
    <label>Comando CLI</label>
    <div class="cmd-box">
      <code id="cmd">node cli/generate-batch.js --total 120 --monsters 24</code>
      <button class="btn btn-sm" id="refresh-cmd" style="flex-shrink:0" title="Ricalcola il comando">↻</button>
      <button class="btn btn-sm" id="copy-btn" style="flex-shrink:0">Copia</button>
    </div>
    <div class="hint" style="margin-top:7px">
      Esegui dalla root del progetto &nbsp;·&nbsp; output in <code style="color:#8dc88d">./output/</code> con <code style="color:#8dc88d">manifest.json</code>
    </div>
  </div>
</div>

<!-- ── Sezione 2: Upload su R2 ── -->
<div class="sect">
  <div class="sect-hd">2 — Carica su Cloudflare R2</div>

  <div class="upload-btns">
    <input type="file" id="folder-pick" style="display:none" multiple>
    <button class="btn" onclick="document.getElementById('folder-pick').click()">
      📁 Seleziona file (mp4 + manifest)
    </button>
    <input type="file" id="dir-pick" style="display:none" webkitdirectory>
    <button class="btn" onclick="document.getElementById('dir-pick').click()">
      🗂 Seleziona cartella output/
    </button>
  </div>

  <div class="file-info" id="file-info">Nessun file selezionato.</div>

  <div class="mode-row">
    <label for="mode">Modalità manifest:</label>
    <select id="mode">
      <option value="merge">Merge — aggiunge nuovi, mantiene i pubblicati</option>
      <option value="replace">Replace — sostituisce completamente</option>
    </select>
  </div>

  <button class="btn btn-primary" id="upload-btn" disabled>
    ↑ Upload su R2
  </button>

  <div class="prog-wrap" id="prog-wrap">
    <div class="prog-bar"><div class="prog-fill" id="prog-fill"></div></div>
    <div class="prog-info">
      <span id="prog-cur">-</span>
      <span id="prog-pct">0%</span>
    </div>
    <div class="log-box" id="log-box"></div>
  </div>

  <div id="result"></div>
</div>

<div class="footer">Character Pixels · Worker v2</div>

<script>
// ── Generator section ──────────────────────────────────────────────────────
function updateCmd() {
    var total    = parseInt(document.getElementById('total').value) || 120;
    var pct      = parseInt(document.getElementById('mpct').value) || 20;
    var monsters = Math.round(total * pct / 100);
    var humans   = total - monsters;

    // Update live labels
    document.getElementById('mpct-lbl').textContent   = pct + '%';
    document.getElementById('mpct-rng').textContent   = pct + '%';
    document.getElementById('monsters-n').textContent = monsters;
    document.getElementById('humans-n').textContent   = humans;

    // Build command — always required args
    var cmd = 'node cli/generate-batch.js --total ' + total + ' --monsters ' + monsters;

    // --seed
    var useSeed = document.getElementById('use-seed').checked;
    var seedEl  = document.getElementById('seed');
    seedEl.disabled = !useSeed;
    if (useSeed) {
        var sv = seedEl.value.trim();
        if (sv) cmd += ' --seed ' + sv;
    }

    // --output
    var useOutput = document.getElementById('use-output').checked;
    var outputEl  = document.getElementById('output');
    outputEl.disabled = !useOutput;
    if (useOutput) {
        var ov = outputEl.value.trim();
        if (ov && ov !== './output') cmd += ' --output ' + ov;
    }

    // --size
    var useSize = document.getElementById('use-size').checked;
    var sizeEl  = document.getElementById('size');
    sizeEl.disabled = !useSize;
    if (useSize) {
        var sz = parseInt(sizeEl.value);
        if (sz && sz !== 50) cmd += ' --size ' + sz;
    }

    // --humans (overrides % slider)
    var useHumans = document.getElementById('use-humans').checked;
    var humansEl  = document.getElementById('humans-direct');
    if (useHumans && humansEl.value) {
        var hv = parseInt(humansEl.value);
        if (!isNaN(hv)) {
            cmd = 'node cli/generate-batch.js --total ' + total + ' --humans ' + hv;
            if (useSeed && seedEl.value.trim())                                     cmd += ' --seed '   + seedEl.value.trim();
            if (useOutput && outputEl.value.trim() && outputEl.value.trim() !== './output') cmd += ' --output ' + outputEl.value.trim();
            if (useSize && parseInt(sizeEl.value) && parseInt(sizeEl.value) !== 50) cmd += ' --size '   + sizeEl.value;
        }
    }

    document.getElementById('cmd').textContent = cmd;
}

function toggleHumans() {
    var useHumans = document.getElementById('use-humans').checked;
    var humansEl  = document.getElementById('humans-direct');
    var sliderEl  = document.getElementById('mpct');
    humansEl.disabled = !useHumans;
    sliderEl.disabled  = useHumans;
    if (useHumans && !humansEl.value) {
        var total = parseInt(document.getElementById('total').value) || 120;
        var pct   = parseInt(document.getElementById('mpct').value) || 20;
        humansEl.value = total - Math.round(total * pct / 100);
    }
    updateCmd();
}

function copyCmd() {
    var cmd = document.getElementById('cmd').textContent;
    navigator.clipboard.writeText(cmd).then(function() {
        var btn = document.getElementById('copy-btn');
        btn.textContent = '✓ Copiato!';
        setTimeout(function() { btn.textContent = 'Copia'; }, 2000);
    });
}

// ── Upload section ─────────────────────────────────────────────────────────
var selectedFiles = [];

function handleFilePick(fileList) {
    var all  = Array.from(fileList);
    var mp4s = all.filter(function(f) { return f.name.endsWith('.mp4'); });
    var mf   = all.find(function(f)   { return f.name === 'manifest.json'; });
    selectedFiles = all;

    var info = document.getElementById('file-info');
    if (mp4s.length === 0 && !mf) {
        info.innerHTML = '<span class="no">Nessun file .mp4 o manifest.json trovato.</span>';
        document.getElementById('upload-btn').disabled = true;
        return;
    }
    info.innerHTML =
        '<span class="ok">' + mp4s.length + ' video MP4</span>' +
        ' &nbsp;·&nbsp; manifest.json: ' +
        (mf ? '<span class="ok">✓ trovato</span>' : '<span class="no">✗ non trovato</span>') +
        ' &nbsp;·&nbsp; <span style="color:#3a3a3a">' + formatBytes(mp4s.reduce(function(a,f){return a+f.size;},0)) + ' totali</span>';
    document.getElementById('upload-btn').disabled = false;
}

// ── Bind events (script è in fondo al body → DOM già pronto, no DOMContentLoaded) ──
document.getElementById('total').addEventListener('input',  updateCmd);
document.getElementById('mpct').addEventListener('input',   updateCmd);
document.getElementById('use-seed').addEventListener('change',   updateCmd);
document.getElementById('seed').addEventListener('input',        updateCmd);
document.getElementById('use-output').addEventListener('change', updateCmd);
document.getElementById('output').addEventListener('input',      updateCmd);
document.getElementById('use-size').addEventListener('change',   updateCmd);
document.getElementById('size').addEventListener('input',        updateCmd);
document.getElementById('use-humans').addEventListener('change', toggleHumans);
document.getElementById('humans-direct').addEventListener('input', updateCmd);
document.getElementById('copy-btn').addEventListener('click', copyCmd);
document.getElementById('refresh-cmd').addEventListener('click', updateCmd);

document.getElementById('folder-pick').addEventListener('change', function() { handleFilePick(this.files); });
document.getElementById('dir-pick').addEventListener('change',    function() { handleFilePick(this.files); });
document.getElementById('upload-btn').addEventListener('click', startUpload);

// Inizializzazione
updateCmd();

function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
    return (n/1024/1024).toFixed(1) + ' MB';
}

function getKeyParam() {
    var p = new URLSearchParams(location.search).get('key');
    return p ? ('?key=' + encodeURIComponent(p)) : '';
}

function addLog(cls, msg) {
    var box  = document.getElementById('log-box');
    var line = document.createElement('div');
    line.className = cls;
    line.textContent = msg;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
}

async function startUpload() {
    var mode = document.getElementById('mode').value;
    var mp4s = selectedFiles.filter(function(f) { return f.name.endsWith('.mp4'); });
    var mf   = selectedFiles.find(function(f)   { return f.name === 'manifest.json'; });

    if (mp4s.length === 0 && !mf) return;

    var total = mp4s.length + (mf ? 1 : 0);
    var done  = 0;
    var errors = [];

    document.getElementById('upload-btn').disabled = true;
    document.getElementById('prog-wrap').style.display = 'block';
    document.getElementById('log-box').innerHTML = '';
    document.getElementById('result').innerHTML  = '';
    document.getElementById('prog-fill').style.width = '0%';

    function setProgress(n, t, cur) {
        var pct = Math.round(n / t * 100);
        document.getElementById('prog-fill').style.width = pct + '%';
        document.getElementById('prog-pct').textContent  = pct + '%';
        document.getElementById('prog-cur').textContent  = cur;
    }

    // Upload MP4 files one by one
    for (var i = 0; i < mp4s.length; i++) {
        var file = mp4s[i];
        setProgress(done, total, file.name + ' (' + formatBytes(file.size) + ')');
        addLog('go', '↑ ' + file.name);

        try {
            var res = await fetch('/api/file?name=' + encodeURIComponent(file.name) + getKeyParam(), {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': 'video/mp4' }
            });
            if (!res.ok) {
                var body = await res.text();
                throw new Error('HTTP ' + res.status + ': ' + body);
            }
            addLog('ok', '✓ ' + file.name);
        } catch (err) {
            addLog('er', '✗ ' + file.name + ': ' + err.message);
            errors.push(file.name + ': ' + err.message);
        }

        done++;
        setProgress(done, total, '');
    }

    // Upload / merge manifest
    if (mf) {
        setProgress(done, total, 'manifest.json (' + mode + ')');
        addLog('go', '↑ manifest.json (modo: ' + mode + ')');

        try {
            var text = await mf.text();
            var json = JSON.parse(text);

            var mres = await fetch('/api/manifest?mode=' + mode + getKeyParam(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json)
            });
            if (!mres.ok) {
                var mbody = await mres.text();
                throw new Error('HTTP ' + mres.status + ': ' + mbody);
            }
            var mdata = await mres.json();
            var mlog  = mode === 'merge'
                ? 'Merge OK: +' + mdata.added + ' nuovi, ' + mdata.total + ' totali'
                : 'Replace OK: ' + mdata.count + ' voci';
            addLog('ok', '✓ manifest.json — ' + mlog);
        } catch (err) {
            addLog('er', '✗ manifest.json: ' + err.message);
            errors.push('manifest.json: ' + err.message);
        }

        done++;
        setProgress(done, total, '');
    }

    // Final result
    document.getElementById('prog-cur').textContent = 'Completato';
    var resultEl = document.getElementById('result');
    if (errors.length === 0) {
        resultEl.innerHTML =
            '<div class="ok-banner" style="margin-top:12px">✓ Upload completato: ' +
            mp4s.length + ' video' + (mf ? ' + manifest.json' : '') + '</div>';
    } else {
        resultEl.innerHTML =
            '<div class="err-banner" style="margin-top:12px">⚠ ' + errors.length +
            " errore/i durante l'upload. Controlla il log sopra.</div>";
    }

    document.getElementById('upload-btn').disabled = false;
}
</script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

// ─── Shared CSS ───────────────────────────────────────────────────────────────

function baseCSS() {
    return `*{box-sizing:border-box;margin:0;padding:0}
body{background:#0c0c0c;color:#d4d4d4;font-family:'SF Mono',ui-monospace,'Fira Code',monospace;font-size:13px;line-height:1.5;padding:28px 24px}
h1{font-size:16px;color:#7c6af7;letter-spacing:.5px;margin-bottom:2px}
.sub{color:#555;font-size:11px;margin-bottom:24px}
/* Nav */
.nav{display:flex;gap:16px;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #181818}
.nav-link{color:#444;text-decoration:none;font-size:12px;transition:color .15s;padding:2px 0}
.nav-link:hover{color:#7c6af7}
.nav-cur{color:#d4d4d4;font-size:12px}
/* Cards */
.row{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:stretch}
.card{background:#141414;border:1px solid #222;border-radius:8px;padding:14px 18px}
.card .lbl{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.card .val{font-size:26px;font-weight:700}
.c-total .val{color:#d4d4d4}
.c-pub   .val{color:#4caf50}
.c-pend  .val{color:#5c8df6}
.c-proc  .val{color:#f0a500}
.c-err   .val{color:#e05252}
.cron-card{flex:1;min-width:220px}
.cron-card .val{font-size:22px;color:#7c6af7;font-variant-numeric:tabular-nums}
.cron-card .abs{color:#555;font-size:11px;margin-top:4px}
.cron-card .sched{color:#3a3a3a;font-size:11px;margin-top:2px}
.next-card{display:flex;gap:14px;align-items:center;flex:2;min-width:240px}
.next-card video{width:90px;aspect-ratio:9/16;border-radius:4px;background:#0a0a0a;flex-shrink:0;object-fit:contain}
.next-card .next-info .lbl{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.next-card .next-info .next-name{font-size:15px;color:#ccc;font-weight:600;margin-bottom:4px}
.next-card .next-info .next-none{font-size:13px;color:#3a3a3a;font-style:italic}
/* Actions */
.actions{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;align-items:center}
.btn{background:#141414;border:1px solid #2a2a2a;color:#d4d4d4;padding:7px 14px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;transition:border-color .15s,color .15s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center}
.btn:hover{border-color:#7c6af7;color:#7c6af7}
.btn-primary{background:#7c6af7;border-color:#7c6af7;color:#fff}
.btn-primary:hover{background:#6857e8;border-color:#6857e8;color:#fff}
.btn-danger{border-color:#5a1a1a;color:#e05252}
.btn-danger:hover{border-color:#e05252;color:#e05252}
.btn-sm{padding:4px 10px;font-size:11px}
/* Banners */
.err-banner{background:rgba(224,82,82,.08);border:1px solid #5a1a1a;border-radius:6px;padding:10px 14px;color:#e05252;margin-bottom:20px;font-size:12px}
.ok-banner{background:rgba(76,175,80,.08);border:1px solid #1a5a1a;border-radius:6px;padding:10px 14px;color:#4caf50;margin-bottom:20px;font-size:12px}
/* Table */
table{width:100%;border-collapse:collapse}
thead th{text-align:left;padding:6px 10px;font-size:10px;color:#3a3a3a;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #1e1e1e;font-weight:400}
tbody td{padding:8px 10px;border-bottom:1px solid #161616;vertical-align:middle}
tbody tr:hover td{background:#111}
td.n{color:#2e2e2e;width:30px;text-align:right;padding-right:14px}
/* Char */
.char-name{font-size:13px;color:#ccc;margin-bottom:4px}
.tbadge{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;letter-spacing:.3px}
.type-h{background:rgba(92,141,246,.1);color:#5c8df6}
.type-m{background:rgba(200,80,80,.12);color:#c85050}
/* Badges */
.badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:11px}
.badge.pub {background:rgba(76,175,80,.12);color:#4caf50}
.badge.err {background:rgba(224,82,82,.12);color:#e05252}
.badge.proc{background:rgba(240,165,0,.12);color:#f0a500}
.badge.pend{background:rgba(92,141,246,.12);color:#5c8df6}
.det{font-size:11px;margin-top:3px}
.mut{color:#444}
.err-t{color:#e05252;opacity:.8;max-width:300px;word-break:break-word}
/* Extra button variants */
.btn-ps{background:rgba(124,106,247,.1);border-color:#3d3278;color:#9d8fff}
.btn-ps:hover{background:rgba(124,106,247,.2);border-color:#7c6af7;color:#c0b5ff}
.btn-del{border-color:#3a1a1a;color:#7a3a3a}
.btn-del:hover{border-color:#e05252;color:#e05252}
/* Quick links */
.quick-links{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.quick-links a{font-size:11px;color:#3a3a3a;text-decoration:none;transition:color .15s}
.quick-links a:hover{color:#7c6af7}
/* Footer */
.footer{color:#2e2e2e;font-size:11px;text-align:right;margin-top:24px}
/* ── Mobile card layout ── */
@media(max-width:640px){
  body{padding:16px 14px}
  table{display:block}
  thead{display:none}
  tbody{display:block}
  tbody tr{display:grid;grid-template-columns:84px 1fr;grid-template-rows:auto auto auto;gap:4px 10px;padding:12px 0;border-bottom:1px solid #1a1a1a}
  tbody td{padding:0;border:none}
  td.n{display:none}
  td.td-video{grid-column:1;grid-row:1/3;align-self:start}
  td.td-video video{width:72px}
  td.td-name{grid-column:2;grid-row:1}
  td.td-status{grid-column:2;grid-row:2}
  td.td-actions{grid-column:1/3;grid-row:3;padding-top:6px}
  .acts{display:flex;flex-wrap:wrap;gap:5px}
  .err-t{max-width:none}
  .row{gap:8px}
  .card{padding:10px 14px}
  .cron-card{min-width:0;flex:1 1 100%}
  .next-card{flex:1 1 100%;min-width:0}
}`;
}

// ─── Instagram API ────────────────────────────────────────────────────────────

/**
 * Crea un container media su Instagram.
 * media_type=REELS è obbligatorio per i video nel 2026 (media_type=VIDEO è deprecated).
 * share_to_feed=true: pubblica il Reel anche nel feed principale (oltre alla tab Reels).
 */
async function createMediaContainer(env, videoUrl, caption) {
    const url = `${IG_API_BASE}/${env.INSTAGRAM_USER_ID}/media`;
    const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({
            media_type:    'REELS',
            video_url:     videoUrl,
            caption:       caption ?? '',
            share_to_feed: 'true',
            access_token:  env.META_ACCESS_TOKEN,
        }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
        throw new Error(`createMediaContainer: ${JSON.stringify(data.error ?? data)}`);
    }
    console.log(`[publisher] Container creato: ${data.id}`);
    return data.id;
}

async function waitForContainer(env, containerId) {
    const deadline = Date.now() + MAX_WAIT_MS;
    while (Date.now() < deadline) {
        const status = await getContainerStatus(env, containerId);
        if (status === 'FINISHED') return;
        if (status === 'ERROR' || status === 'EXPIRED') {
            throw new Error(`Container in stato ${status} — il video non può essere pubblicato`);
        }
        console.log(`[publisher] Container status: ${status} — attendo ${RETRY_INTERVAL_MS / 1000}s...`);
        await sleep(RETRY_INTERVAL_MS);
    }
    throw new Error(`Timeout: container non FINISHED entro ${MAX_WAIT_MS / 1000}s`);
}

async function getContainerStatus(env, containerId) {
    // Nota: 'media_type' NON è un campo valido per i container — solo status_code e status
    const url  = `${IG_API_BASE}/${containerId}?fields=status_code,status&access_token=${env.META_ACCESS_TOKEN}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) {
        throw new Error(`getContainerStatus: ${JSON.stringify(data.error ?? data)}`);
    }
    console.log(`[publisher] Container ${containerId} — status_code=${data.status_code}`);
    return data.status_code;
}

async function publishContainer(env, containerId) {
    const url = `${IG_API_BASE}/${env.INSTAGRAM_USER_ID}/media_publish`;
    const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({
            creation_id:  containerId,
            access_token: env.META_ACCESS_TOKEN,
        }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
        throw new Error(`publishContainer: ${JSON.stringify(data.error ?? data)}`);
    }
    return data.id;
}

// ─── R2 helpers ───────────────────────────────────────────────────────────────

async function readManifest(env) {
    const obj = await env.R2_BUCKET.get(MANIFEST_KEY);
    if (!obj) return null;
    return JSON.parse(await obj.text());
}

async function writeManifest(env, manifest) {
    await env.R2_BUCKET.put(MANIFEST_KEY, JSON.stringify(manifest, null, 2), {
        httpMetadata: { contentType: 'application/json' },
    });
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function redirectTo(url, pathname, flash = null) {
    const dest = new URL(url);
    dest.pathname = pathname;
    dest.searchParams.delete('filename');
    if (flash) dest.searchParams.set('flash', flash);
    else       dest.searchParams.delete('flash');
    return new Response(null, { status: 303, headers: { Location: dest.toString() } });
}

function getNextCronTime(now) {
    for (const { h, m } of CRON_UTC) {
        const t = new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m, 0, 0
        ));
        if (t > now) return t;
    }
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(CRON_UTC[0].h, CRON_UTC[0].m, 0, 0);
    return d;
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
