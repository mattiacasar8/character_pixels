# Character Pixels Generator

Generatore procedurale di personaggi pixel-art con nomi e backstory per progetti fantasy/retro. Supporta generazione batch e editing individuale.

## Funzionalità Principali

### 1. Due Modalità di Lavoro

#### Batch Mode
Genera e visualizza multipli personaggi contemporaneamente:
- Genera 1, 10 o 100 personaggi
- Preset per proporzioni (athletic, slim, stocky, tall per umani; short, tall, thin, bulky per mostri)
- Randomizzazione parametri corporei
- Esportazione spritesheet o ZIP con tutti i caratteri

#### Single Mode
Editor dedicato per modificare un singolo personaggio:
- Modifica colori (pelle, vestiti, capelli, occhi per umani / palette per mostri)
- Modifica pattern vestiti (stripes, checkers, buttons, tunic, patches)
- Modifica proporzioni corporee con slider individuali
- Modifica viso (stile capelli, espressione)
- Rinomina personaggio
- Rigenerazione backstory con pattern selezionabili
- Reset/salvataggio modifiche

### 2. Generatori di Caratteri

**Umani** (`js/generators/human/`):
- Proporzioni anatomiche realistiche
- Palette colori per pelle, vestiti, capelli
- Sistema di pattern per abbigliamento
- Generazione viso procedurale

**Mostri** (`js/generators/monster/`):
- Proporzioni fantasy variabili
- Palette colori tematiche (fuoco, veleno, ombra, ecc.)
- Fill density variabile per trasparenze

### 3. Effetti Visivi

- **Smoothing**: Cellular automata per sprite più organici
- **Outline**: Contorno configurabile con color picker
- **Lighting**: Illuminazione direzionale (5 direzioni)
- **Animation**: 4 frame di animazione camminata per ogni personaggio

### 4. Sistema di Backstory

Generazione procedurale di backstory narrative (vedi `BACKSTORY_SYSTEM.md`):
- 6 pattern strutturali diversi (Origin, Formation, Skill, Reputation, ecc.)
- Template resolver con varianti interne
- Sistema anti-ripetizione con shuffle pools
- Supporto per rigenerazione con pattern specifici

### 5. Esportazione

**Batch**:
- Spritesheet PNG con griglia di tutti i personaggi
- ZIP con file individuali (idle + animation frames)

**Single Character**:
- Card (personaggio singolo)
- Strip (4 frame animazione orizzontali)
- Sequence (4 frame separati)

## Struttura Progetto

```
├── index.html              # UI principale
├── style.css               # Styling
├── js/
│   ├── main.js            # Entry point, orchestrazione
│   ├── config.js          # Configurazione parametri e preset
│   ├── app/               # Moduli applicazione
│   │   ├── UIManager.js           # Gestione interfaccia
│   │   ├── SingleModeController.js # Logica single mode
│   │   ├── ExportManager.js        # Export spritesheet/ZIP
│   │   └── ModalManager.js         # Modale backstory
│   ├── core/              # Logica generazione
│   │   ├── generator.js           # Generatore base
│   │   ├── renderer.js            # Rendering canvas
│   │   └── processors/            # Effetti post-processing
│   ├── generators/        # Generatori specifici
│   │   ├── human/                # Generatore umani
│   │   └── monster/              # Generatore mostri
│   ├── data/              # Dataset palette/backstory
│   └── utils/             # Utility math/random
└── BACKSTORY_SYSTEM.md    # Documentazione sistema backstory
```

## Utilizzo

1. Apri `index.html` in un browser moderno
2. **Batch Mode**: Seleziona preset, parametri ed effetti, poi genera caratteri
3. **Single Mode**: Clicca "Single" in alto a sinistra, poi genera o seleziona un personaggio da modificare
4. **Visualizza backstory**: Clicca su un personaggio per aprire il modale
5. **Esporta**: Usa i pulsanti export in batch mode o nel modale carattere
