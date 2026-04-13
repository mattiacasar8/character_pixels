[← README](../README.md)

# Video Export

Guida per la generazione di video MP4 (1080x1920 portrait) con personaggio animato e musica 8-bit procedurale.

## Architettura

Il sistema ha due modalita':

| | Browser | CLI (Node.js) |
|---|---|---|
| **Formato** | WebM (preview) | MP4 (produzione) |
| **Audio** | Tone.js (offline render) | PCM synthesis (WAV) |
| **Video** | MediaRecorder + captureStream | ffmpeg nativo (pipe RGBA) |
| **Canvas** | DOM Canvas | @napi-rs/canvas |
| **Uso** | Singolo, dal modale | Singolo o batch, da terminale |

La logica core (generazione parametri musicali, sequenze note, timing frame) e' condivisa e pura — zero dipendenze browser o Node.

---

## Browser — Export WebM

1. Apri un personaggio nel modale
2. Clicca **EXPORT VIDEO**
3. Il file `.webm` viene scaricato automaticamente

Utile per preview rapido. Per Instagram o produzione, usa il CLI.

---

## CLI — Export MP4

### Prerequisiti

**Node.js** (v18+):
```bash
# macOS (Homebrew)
brew install node

# Verifica
node --version
```

**ffmpeg**:
```bash
# macOS (Homebrew)
brew install ffmpeg

# Verifica
ffmpeg -version
```

**Dipendenze progetto**:
```bash
cd character_pixels
npm install
```

Questo installa `@napi-rs/canvas` (~50MB, prebuilt binary, zero dipendenze di sistema).

### Font

I font `Instrument Serif` e `Inter` devono essere presenti in `assets/fonts/`. Se mancano, il testo nel video usera' un font di fallback.

### Uso

**Singolo personaggio con seed specifico:**
```bash
node cli/export-video.js --seed 12345
```

**Piu' seed:**
```bash
node cli/export-video.js --seed 12345,67890,11111
```

**Batch di N personaggi random:**
```bash
node cli/export-video.js --count 10
```

**Batch di mostri:**
```bash
node cli/export-video.js --count 5 --type monster
```

**In inglese:**
```bash
node cli/export-video.js --seed 12345 --lang eng
node cli/export-video.js --count 10 --lang eng
```

**Shortcut npm:**
```bash
npm run video -- --seed 12345
npm run video:batch -- --count 10
```

### Opzioni

| Flag | Default | Descrizione |
|---|---|---|
| `--seed <n[,n,...]>` | — | Seed specifici, separati da virgola |
| `--count <n>` | 1 | Genera N personaggi random |
| `--type <type>` | `human` | `human` o `monster` |
| `--preset <name>` | `standard` | Preset corpo: standard, athletic, slim, stocky, tall |
| `--output <dir>` | `./output` | Directory di output |
| `--size <n>` | `50` | Dimensione canvas pixel (griglia interna) |
| `--lang <lang>` | `ita` | Lingua: `ita` o `eng` |

### Output

I video vengono salvati in `./output/` (o la directory specificata) con nome `NomePersonaggio_seed.mp4`.

Esempio output:
```
Generating 3 video(s)...

[1/3] Seed: 12345
  Name: Edmund
  Frames: 3
  Music: 112 BPM, minor, 12.9s
  Output: ./output/Edmund_12345.mp4

[2/3] Seed: 67890
  Name: Isolde
  Frames: 3
  Music: 96 BPM, dorian, 15.0s
  Output: ./output/Isolde_67890.mp4

[3/3] Seed: 11111
  Name: Gareth
  Frames: 3
  Music: 128 BPM, phrygian, 11.3s
  Output: ./output/Gareth_11111.mp4

Done.
```

### Specifiche Video

- **Risoluzione**: 1080x1920 (9:16 portrait, Instagram Reels)
- **Codec video**: H.264 (libx264), CRF 23
- **Codec audio**: AAC 128kbps
- **FPS**: 30
- **Contenitore**: MP4 con faststart

---

## Determinismo

Stesso seed = stesso personaggio + stessa musica + stesso video. Questo vale sia nel browser che nel CLI.

Il seed della musica e' derivato dal seed del personaggio (`seed + 99999`) per garantire decorrelazione dai parametri del corpo.

---

## Test

```bash
npm test
```

Verifica determinismo e correttezza dei moduli puri (music-generator, frame-sequence).
