[← README](../README.md)

# Automazione Instagram

Guida completa per generare video in batch, caricarli su Cloudflare R2 e pubblicarli automaticamente su Instagram.

---

## Panoramica del sistema

```
[Locale — tu]                          [Cloudflare — automatico]

  cli/generate-batch.js                   Workers (cron trigger)
  → genera N video MP4                    → gira 3x al giorno (8:55, 13:55, 18:55 CET)
  → crea/aggiorna manifest.json           → legge manifest.json da R2
          │                               → pubblica il primo video non "published"
          ▼                               → aggiorna manifest.json su R2
  Batch Manager (web UI)
  → upload MP4 + manifest su R2
  (oppure manuale via dashboard CF)
```

**Flusso di lavoro:**
1. Generi ~120 video in locale con `generate-batch.js`
2. Carichi su R2 tramite il **Batch Manager** (web UI integrata nel Worker)
3. Il Worker gira automaticamente 3 volte al giorno e pubblica un video per volta

---

## File del progetto

| File | Posizione | Scopo |
|------|-----------|-------|
| `generate-batch.js` | `cli/` | Genera N video con ratio mostri/umani configurabile + crea `manifest.json` |
| `publish.js` | `workers/` | Cloudflare Worker con cron trigger — legge manifest, pubblica su Instagram |
| `wrangler.toml` | `workers/` | Configurazione Worker, cron trigger, binding R2 |
| `manifest.json` | `output/` | Generato automaticamente — tiene traccia di tutti i video e il loro stato |

### Formato `manifest.json`

```json
[
  {
    "filename": "Aldric_1234567.mp4",
    "name": "Aldric",
    "type": "human",
    "seed": 1234567,
    "caption": "Aldric è un guerriero errante...",
    "status": "ready",
    "published_at": null
  },
  {
    "filename": "Grak_9876543.mp4",
    "name": "Grak",
    "type": "monster",
    "seed": 9876543,
    "caption": "Grak si aggira nelle terre oscure...",
    "status": "published",
    "published_at": "2025-06-01T08:55:00.000Z"
  }
]
```

**Stati possibili:**
- `ready` — generato, pronto per essere pubblicato (impostato da `generate-batch.js`)
- `container_created` — container Instagram creato, in attesa di processing (gestito dal Worker)
- `published` — pubblicato su Instagram (impostato dal Worker)
- `error` — fallito (file non trovato su R2, rifiutato da Instagram, ecc.); il Worker lo salta automaticamente. Il campo `error` nell'entry contiene il motivo

Il Worker salta automaticamente i video in stato `error` e pubblica il prossimo `ready`.

### Formato della caption

La caption pubblicata su Instagram segue questo template, definito in `cli/generate-batch.js`:

```
—
{Nome del personaggio}
—
{Backstory del personaggio}
—
```

Per modificare il template, apri `cli/generate-batch.js` e cerca la riga:

```js
const CAPTION_TEMPLATE = `\n—\n{name}\n—\n{backstory}\n—`;
```

Le variabili disponibili sono `{name}` e `{backstory}`. Dopo la modifica rigenera il batch per applicare il nuovo formato.

> **Lingua:** per generare caption in inglese aggiungi `--lang eng` al comando. Il default è `ita`.

---

## Parte 1 — Setup Instagram Business

### 1.1 Converti l'account in Business

1. Apri Instagram sul telefono → **Impostazioni** → **Account**
2. Scorri in fondo → **Passa ad account professionale**
3. Scegli **Business** (non Creator — il Creator ha limitazioni API)
4. Segui il wizard: scegli una categoria (es. "Arte digitale")

### 1.2 Crea una Facebook Page (obbligatorio)

L'API Instagram richiede che l'account Business sia collegato a una Facebook Page.

1. Vai su [facebook.com/pages/create](https://facebook.com/pages/create)
2. Scegli tipo: **Artista, band o personaggio pubblico** → Artista
3. Dai un nome alla page (può essere uguale al profilo Instagram)
4. Collega la Page all'account Instagram:
   - Da Instagram: **Impostazioni** → **Account** → **Account collegati** → Facebook

---

## Parte 2 — Setup Meta Developer App

### 2.1 Crea l'App

1. Vai su [developers.facebook.com](https://developers.facebook.com) — accedi con il tuo account Facebook
2. **My Apps** → **Create App**
3. Scegli tipo: **Business**
4. Inserisci nome app (es. "CharacterPixels Publisher") e la tua email
5. Seleziona il tuo Business Portfolio (o creane uno)

### 2.2 Aggiungi il prodotto Instagram

1. Nella dashboard dell'app → **Add a Product**
2. Trova **Instagram Graph API** → **Set Up**

### 2.3 Ottieni le credenziali base

Vai su **Settings** → **Basic**:
- Annota **App ID** e **App Secret** (clicca "Show")

### 2.4 Genera l'Access Token

Hai bisogno di un **Long-Lived User Access Token** con i permessi corretti.

**Step 1 — Token temporaneo con Graph API Explorer:**

1. Vai su [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Seleziona la tua app dal menu in alto a destra
3. Clicca **Generate Access Token**
4. Spunta questi permessi:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
5. Clicca **Generate Access Token** → autorizza → copia il token

**Step 2 — Converti in Long-Lived Token (dura 60–90 giorni):**

Apri il browser e visita questo URL (sostituisci i valori):

```
https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_TOKEN}
```

La risposta JSON contiene `access_token` — **salvalo**, è il tuo token principale.

> **Nota:** La durata effettiva del token dipende dalle impostazioni dell'app Meta (tipicamente 60 giorni, ma può arrivare a 90). Puoi rinnovarlo chiamando lo stesso endpoint con il token esistente prima che scada.

**Step 3 — Trova il tuo Instagram Business Account ID:**

```
# Prima trova le Page collegate al tuo account:
GET https://graph.facebook.com/v21.0/me/accounts?access_token={TOKEN}

# Dalla risposta prendi l'id della tua Page, poi:
GET https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token={TOKEN}
```

Il valore `instagram_business_account.id` è il tuo **Instagram User ID** — annotalo.

Puoi eseguire queste chiamate direttamente nel browser o con `curl`.

### 2.5 Modalità Live vs Development

- In **Development mode** puoi pubblicare solo su account aggiunti come tester
- Per pubblicare liberamente devi passare in **Live mode**:
  - **App Review** → **Permissions and Features**
  - Richiedi `instagram_content_publish` → compila il form (descrivi l'uso)
  - In genere approvato in 1-5 giorni lavorativi

---

## Parte 3 — Setup Cloudflare R2

### 3.1 Crea il bucket

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) → seleziona il tuo account
2. Menu laterale → **R2 Object Storage** → **Create bucket**
3. Nome: `character-pixels` (o quello che preferisci)
4. Location: **Automatic** va bene

### 3.2 Abilita accesso pubblico

Il Worker ha accesso diretto a R2 tramite binding (senza URL pubblico). Ma per passare l'URL del video all'API Instagram serve che i file siano accessibili pubblicamente.

1. Apri il bucket → tab **Settings**
2. Sezione **Public access** → **Allow Access** → conferma
3. Vedrai un URL tipo: `https://pub-xxxxxxxxxxxx.r2.dev`
   **Annotalo** — è il tuo `R2_PUBLIC_URL`

### 3.3 Upload dei video su R2

**Metodo consigliato — Batch Manager (web UI):**

Il Worker include una pagina `/batch` con upload integrato:

1. Vai su `https://character-pixels-publisher.{account}.workers.dev/batch`
2. Sezione **2 — Carica su Cloudflare R2**
3. Clicca **Seleziona cartella output/** e scegli tutta la cartella `output/`
4. Scegli la modalità manifest:
   - **Merge** — aggiunge i nuovi video, mantiene gli status dei già pubblicati (consigliato per aggiornamenti)
   - **Replace** — sostituisce completamente il manifest (usa solo per un reset totale)
5. Clicca **↑ Upload su R2** — i file vengono caricati uno per uno con progress bar

**Metodo alternativo — Dashboard Cloudflare:**

1. Vai sul tuo bucket → tab **Objects**
2. Clicca **Upload** → **Upload files** (o trascina i file)
3. Carica tutti i file MP4 dalla cartella `output/`
4. Carica anche `manifest.json`

> **Attenzione con Replace:** Quando ricarichi `manifest.json` dopo una sessione di pubblicazione, scarica prima la versione aggiornata dal bucket (quella con gli status corretti), poi sostituisci solo i nuovi video nel JSON e ricarica.

### 3.4 Binding R2

Il Worker accede a R2 tramite **bindings** (non API token) — è più sicuro e non richiede credenziali esplicite. Configuri il binding nella sezione Worker (vedi Parte 4).

---

## Parte 4 — Setup Cloudflare Worker

### 4.1 Installa Wrangler (CLI Cloudflare)

```bash
npm install -g wrangler
wrangler login  # apre il browser per autenticarsi
```

### 4.2 Struttura del Worker

```
workers/
├── publish.js        # Logica principale del Worker (Dashboard + Batch Manager + Publisher)
└── wrangler.toml     # Configurazione Cloudflare
```

### 4.3 Configura `wrangler.toml`

Il file `workers/wrangler.toml` è già configurato. Per riferimento:

```toml
name = "character-pixels-publisher"
main = "publish.js"
compatibility_date = "2025-01-01"

# Cron: 3x al giorno alle 8:55, 13:55, 18:55 CET (ora solare)
[triggers]
crons = ["55 7 * * *", "55 12 * * *", "55 17 * * *"]

# Binding R2 — accesso diretto senza credenziali
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "character-pixels"

# Variabili pubbliche
[vars]
R2_PUBLIC_URL = "https://pub-{HASH}.r2.dev"
```

### 4.4 Imposta i Secrets

I secrets NON vanno nel file `wrangler.toml` — vengono impostati separatamente:

```bash
cd workers/

wrangler secret put META_ACCESS_TOKEN
# → incolla il Long-Lived Token e premi invio

wrangler secret put INSTAGRAM_USER_ID
# → incolla il tuo Instagram Business Account ID

# Opzionale — protegge il dashboard con ?key=VALUE
wrangler secret put DASHBOARD_KEY
# → scegli una password qualsiasi (es. una stringa random)
```

> Se imposti `DASHBOARD_KEY`, aggiungi `?key=YOUR_KEY` a tutte le URL del Worker (dashboard, batch manager, trigger manuale).

### 4.5 Deploy del Worker

```bash
cd workers/
wrangler deploy
```

Cloudflare mostrerà l'URL del Worker e confermerà i cron trigger attivi.

### 4.6 Test manuale

**Via Batch Manager (consigliato):**

Vai su `https://character-pixels-publisher.{account}.workers.dev/batch` per:
- Generare il comando CLI corretto con tutti i parametri
- Caricare i file su R2 direttamente dal browser

**Via curl:**
```bash
# Pubblica subito il prossimo video in coda
curl -X POST https://character-pixels-publisher.{account}.workers.dev/trigger

# Con DASHBOARD_KEY impostato:
curl -X POST "https://character-pixels-publisher.{account}.workers.dev/trigger?key=YOUR_KEY"
```

**Via dashboard Cloudflare:**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → `character-pixels-publisher`
2. Tab **Triggers** → **Cron Triggers** → **Run**

---

## Parte 5 — Workflow operativo (da ripetere ogni ~60 giorni)

Questo è tutto quello che devi fare periodicamente. Il sistema poi gira da solo.

### Step 1 — Genera i video in locale

```bash
# Dalla root del progetto

# Batch standard: 120 video (96 umani + 24 mostri, ratio 1:4)
npm run batch

# Batch ridotto per test rapido (10 video)
npm run batch:small

# Numero custom
node cli/generate-batch.js --total 60
node cli/generate-batch.js --total 120 --monsters 20
node cli/generate-batch.js --total 100 --humans 90

# Batch deterministico (stesso seed = stessi personaggi)
node cli/generate-batch.js --total 120 --seed 42718301

# Batch in inglese
node cli/generate-batch.js --total 120 --lang eng
```

I video vengono salvati in `output/` insieme a `manifest.json`. Ci vogliono circa 10–20 minuti per 120 video.

### Step 2 — Carica su Cloudflare R2

**Tramite Batch Manager (consigliato):**

1. Vai su `https://character-pixels-publisher.{account}.workers.dev/batch`
2. Clicca **🗂 Seleziona cartella output/** e scegli la cartella `output/` generata
3. Scegli modalità **Merge** (mantiene i già pubblicati) o **Replace** (reset totale)
4. Clicca **↑ Upload su R2** e attendi il completamento

> Il Worker da questo momento pubblica automaticamente 3 video al giorno alle 8:55, 13:55 e 18:55 CET. Non serve fare nient'altro.

### Pubblica un video manualmente (quando vuoi)

Dal dashboard del Worker: `https://character-pixels-publisher.{account}.workers.dev/` → **▶ Pubblica ora**

Oppure via curl:
```bash
curl -X POST "https://character-pixels-publisher.{account}.workers.dev/trigger"
```

### Controlla i log del Worker

```bash
# Segui i log in tempo reale dal terminale
cd workers && wrangler tail

# Oppure dalla dashboard:
# dash.cloudflare.com → Workers & Pages → character-pixels-publisher → Logs
```

### Controlla cosa c'è nel manifest su R2

```bash
# Scarica il manifest attuale da R2 e stampalo
cd workers && wrangler r2 object get character-pixels/manifest.json --file /tmp/manifest.json && cat /tmp/manifest.json
```

### Rideploya il Worker (dopo modifiche a publish.js o wrangler.toml)

```bash
cd workers && wrangler deploy
```

### Nota sull'ora legale

Il Worker usa orari UTC. Aggiorna `wrangler.toml` e rideploya se cambia l'ora:

| Periodo | Ora italiana | Cron UTC |
|---------|-------------|----------|
| Inverno (ott–mar) | 8:55, 13:55, 18:55 CET | `"55 7 * * *"`, `"55 12 * * *"`, `"55 17 * * *"` |
| Estate (mar–ott) | 8:55, 13:55, 18:55 CEST | `"55 6 * * *"`, `"55 11 * * *"`, `"55 16 * * *"` |

```bash
# Dopo aver modificato wrangler.toml:
cd workers && wrangler deploy
```

---

## Parte 6 — Rinnovo token Meta (ogni 60–90 giorni)

I Long-Lived Token scadono. Metti un promemoria sul calendario in anticipo rispetto alla data di scadenza.

**Step 1 — Genera un nuovo short-lived token:**

1. Vai su [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Seleziona la tua app
3. Clicca **Ricevi token utente** → spunta `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`, `pages_show_list`
4. Clicca **Generate Access Token** → copia il token

**Step 2 — Convertilo in long-lived:**

```bash
curl "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token=NUOVO_SHORT_LIVED_TOKEN"
```

Dalla risposta JSON copia il nuovo `access_token`.

**Step 3 — Aggiorna il secret nel Worker:**

```bash
cd workers/
wrangler secret put META_ACCESS_TOKEN
# → incolla il nuovo token, premi invio
```

Nessun redeploy necessario — il secret viene aggiornato immediatamente.

---

## Troubleshooting

**Il Worker non pubblica:**
- Controlla i log: Dashboard → Workers → `character-pixels-publisher` → tab **Logs**
- Verifica che il manifest su R2 abbia video con status `ready` (non tutti `published`)
- Controlla che `META_ACCESS_TOKEN` non sia scaduto

**Errore API Instagram (es. subcode 2207089):**
- Può indicare un outage temporaneo dell'API Meta — controlla [status.nonli.com](https://status.nonli.com/) o il Meta Status Dashboard
- Il Worker gestisce automaticamente i retry al prossimo cron trigger
- Usa **↺ Pulisci manifest** nella dashboard per resettare gli errori recuperabili

**Errore 400 dall'API Instagram (container not ready):**
- Normale — il Worker gestisce i retry automatici con polling ogni 10s (max 90s)

**Il video non appare nei Reels:**
- Verifica che sia 9:16 (1080×1920) ✓ già corretto
- Verifica che duri tra 5 e 90 secondi
- Verifica che il file sia sotto 100 MB

**Superato il limite di 25 post/giorno:**
- Con 3 post/giorno sei a 1/8 del limite — non è un problema

---

## Riepilogo credenziali necessarie

| Variabile | Dove trovarla |
|-----------|---------------|
| `META_ACCESS_TOKEN` | Graph API Explorer → Long-Lived Token |
| `INSTAGRAM_USER_ID` | Chiamata API `/me/accounts` + `/{page_id}?fields=instagram_business_account` |
| `R2_PUBLIC_URL` | Dashboard R2 → bucket → Settings → Public access URL |
| `R2_BUCKET` (binding) | Nome del bucket R2 (configurato in `wrangler.toml`) |
| `DASHBOARD_KEY` | (opzionale) Qualsiasi stringa random — protegge la UI del Worker |
