# Character Pixels

Generatore procedurale di personaggi pixel-art con nomi, backstory e animazione. Produce video MP4 in formato Instagram Reels (1080x1920) con musica 8-bit generativa, pubblicati automaticamente su Instagram tramite Cloudflare Workers.

---

## Struttura del progetto

```
character_pixels/
├── index.html              # UI browser (batch mode + single mode)
├── style.css
│
├── js/                     # Logica condivisa (browser + CLI)
│   ├── config.js           # Parametri, preset, configurazione video
│   ├── core/               # Generatore base + rendering canvas
│   ├── generators/         # Generatori specifici per umani e mostri
│   │   ├── human/          # Corpo, viso, abbigliamento, backstory umani
│   │   └── monster/        # Corpo, palette, backstory mostri
│   ├── audio/              # Musica procedurale (condivisa browser/CLI)
│   ├── data/               # Dataset nomi, palette, backstory
│   ├── app/                # Moduli UI (solo browser)
│   └── utils/              # Utility math, colore, random
│
├── cli/
│   ├── export-video.js     # Genera singoli video MP4 da seed
│   └── generate-batch.js   # Genera batch di video + manifest.json
│
├── workers/
│   ├── publish.js          # Cloudflare Worker — pubblica su Instagram
│   └── wrangler.toml       # Configurazione Worker e cron trigger
│
├── assets/fonts/           # Instrument Serif + Inter
├── output/                 # Video generati + manifest.json (gitignored)
│
└── docs/
    ├── AUTOMATION.md       # Guida completa pubblicazione Instagram
    ├── VIDEO_EXPORT.md     # Guida generazione video CLI e browser
    └── BACKSTORY_SYSTEM.md # Architettura sistema backstory procedurali
```

---

## Funzionalità principali

### Generazione personaggi

Due tipi di personaggio, ognuno con generatore dedicato:

- **Umani** — proporzioni anatomiche, palette pelle/capelli/occhi/vestiti, pattern abbigliamento, generazione viso procedurale
- **Mostri** — proporzioni fantasy variabili, palette tematiche (fuoco, veleno, ombra…), fill density variabile

Ogni personaggio ha un **seed** intero che rende la generazione completamente deterministica: stesso seed = stesso personaggio, stessa musica, stesso video.

### Backstory procedurali

Sistema di generazione narrativa con 6 pattern strutturali (Origin, Formation, Skill, Reputation…), template resolver con varianti interne (`{opzione1|opzione2}`), e pool shuffle per evitare ripetizioni. Produce testi in italiano di 2-3 frasi. → [`docs/BACKSTORY_SYSTEM.md`](docs/BACKSTORY_SYSTEM.md)

### Export video

Video MP4 1080x1920 con sprite animato (3 frame walk cycle), testo rivelato progressivamente e musica 8-bit procedurale sincronizzata al BPM. Generabili da CLI in batch. → [`docs/VIDEO_EXPORT.md`](docs/VIDEO_EXPORT.md)

### Pubblicazione automatica Instagram

Cloudflare Worker con cron trigger pubblica 2 video al giorno (8:55 e 20:55) leggendo da un manifest su R2. → [`docs/AUTOMATION.md`](docs/AUTOMATION.md)

---

## Avvio rapido

### UI browser

```bash
# Apri direttamente nel browser — nessun server necessario
open index.html
```

### Generazione video da CLI

```bash
npm install

# Un singolo video con seed specifico
node cli/export-video.js --seed 12345

# Batch misto umani + mostri (ratio 1:4) con manifest
npm run batch
```

Prerequisiti CLI: **Node.js v18+** e **ffmpeg** (`brew install ffmpeg`).

### Pubblicazione automatica

Vedi [`docs/AUTOMATION.md`](docs/AUTOMATION.md) per la guida completa di setup e workflow.

---

## Comandi npm disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run batch` | Genera 120 video (96 umani + 24 mostri) + manifest.json |
| `npm run batch:small` | Genera 10 video per test rapido |
| `npm run video -- --seed 12345` | Genera un singolo video con seed specifico |
| `npm run video:batch -- --count 10` | Genera N video random |
| `npm run worker:deploy` | Deploya il Worker su Cloudflare |
| `npm test` | Esegue la test suite |
