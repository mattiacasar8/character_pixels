# Sistema di Generazione Backstory Procedurali

## Overview

Sistema per generare backstory testuali per personaggi secondari (NPC) in contesti fantasy. Produce testi di 2-3 frasi che suonano naturali e non generati algoritmicamente.

## Architettura

### 1. Template Resolver

Gestisce la sintassi di variazione interna alle stringhe.

**Sintassi:** `{opzione1|opzione2|opzione3}`

```javascript
"ha rubato un {prezioso|antico|maledetto} {anello|pugnale|tomo}"
// Output possibili:
// "ha rubato un prezioso anello"
// "ha rubato un antico pugnale"
// "ha rubato un maledetto tomo"
```

**Implementazione:**
```javascript
function resolve(template) {
  let result = template;
  let safety = 10; // previene loop infiniti
  
  while (result.includes('{') && safety > 0) {
    result = result.replace(/\{([^{}]+)\}/g, (match, content) => {
      const options = content.split('|');
      return options[Math.floor(Math.random() * options.length)];
    });
    safety--;
  }
  
  return result;
}
```

Il resolver supporta **annidamento** (template dentro template) grazie al loop che processa dall'interno verso l'esterno.

---

### 2. Shuffle-Based Picking

Garantisce varietà evitando ripetizioni consecutive.

**Problema:** Con picking puramente random, lo stesso elemento può apparire più volte di seguito, rendendo evidente la natura generata.

**Soluzione:** Ogni pool di dati viene shufflato. Gli elementi vengono consumati in ordine. Quando il pool si svuota, viene ri-shufflato.

```javascript
const shuffledPools = new Map();

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pick(array, poolName = null) {
  if (!poolName) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  let pool = shuffledPools.get(poolName);
  if (!pool || pool.length === 0) {
    pool = shuffleArray(array);
    shuffledPools.set(poolName, pool);
  }
  
  return pool.pop();
}
```

**Parametri:**
- `array`: Pool di dati sorgente
- `poolName`: Identificatore del pool (es: `'places'`, `'skills'`). Se `null`, usa random puro.

**Nota:** Per esclusioni dinamiche (es. evitare che formation1 === formation2), usa `pickExcluding()` che fa random filtrato invece di shuffle.

---

### 3. Data Pools

I dati sono organizzati in pool tematici:

| Pool | Descrizione | Tipo |
|------|-------------|------|
| `places` | Nomi di luoghi | `string[]` |
| `placeDescriptors` | Descrittori ambientali | `string[]` |
| `originPhrases` | Frasi di origine | `function(name, place)[]` |
| `formationPhrases` | Eventi formativi | `string[]` (con template) |
| `skillPhrases` | Descrizioni di abilità | `string[]` (con template) |
| `reputationSources` | Intro per dicerie | `string[]` |
| `reputationClaims` | Contenuto dicerie | `string[]` (con template) |
| `currentStates` | Stati/obiettivi attuali | `string[]` (con template) |
| `currentConnectors` | Connettori temporali | `string[]` |

#### Origin Phrases (funzioni)

Le origin phrases sono **funzioni** che ricevono `name` e `place` per permettere strutture sintattiche diverse:

```javascript
originPhrases: [
  (name, place) => `${name} viene da ${place}`,
  (name, place) => `Le strade di ${place} hanno forgiato ${name}`,
  (name, place) => `Nessuno sa come ${name} sia arrivato a ${place}`,
]
```

---

### 4. Pattern Strutturali

Ogni backstory segue uno dei pattern predefiniti:

#### Pattern A: Origin + Formation + Current
```
[come è arrivato] + [cosa è successo] + [cosa fa ora]
```
> "Mario viene da Valdoria, dove ha perso tutto in una sola notte. Ora cerca vendetta."

#### Pattern B: Origin + Skill + Reputation
```
[da dove viene] + [cosa sa fare] + [cosa si dice di lui]
```
> "Mario ha trovato rifugio a Karveth. Oggi forgia armi che non si spezzano. Si dice che abbia sangue nobile nelle vene."

#### Pattern C: Skill + Mystery + Current
```
[cosa sa fare] + [mistero] + [cosa fa ora]
```
> "Mario scaccia demoni dove altri non osano. La leggenda narra che abbia visto il futuro. Oggi cerca risposte."

#### Pattern D: Double Formation (dramatic)
```
[luogo] + [evento 1] + [evento 2] + [conseguenza]
```
> "A Rocca Nera, Mario ha stretto un patto pericoloso. Poco dopo, ha perso qualcuno. Da allora, scappa dal proprio passato."

#### Pattern E: Reputation-heavy (mysterious)
```
[poche info] + [diceria 1] + [diceria 2] + [stato attuale]
```
> "Di Mario si sa poco. Alcuni pensano che non dorma mai. C'è chi giura che abbia fatto un patto con qualcosa di antico. Intanto, aspetta."

#### Pattern F: Skill + Formation (professional)
```
[abilità] + [origine dell'abilità] + [stato attuale]
```
> "Mario combatte senza esitazione. A Thornwall, ha imparato che la fiducia è un lusso. Oggi cerca solo oro."

---

### 5. Linee Guida per il Dataset

#### DO ✓

- **Linguaggio neutro:** Evitare accordi di genere dove possibile
  - ❌ `"è stato tradito"` → ✓ `"ha visto tradire la propria fiducia"`
  - ❌ `"ladro silenzioso"` → ✓ `"ruba senza farsi scoprire"`

- **Azioni concrete:** Descrivere cosa FA, non cosa È
  - ❌ `"è un guerriero"` → ✓ `"combatte per chi paga"`
  - ❌ `"è un guaritore"` → ✓ `"guarisce chi può pagare"`

- **Oggetti specifici:** Evitare riferimenti vaghi
  - ❌ `"ha preso qualcosa"` → ✓ `"ha rubato un antico manoscritto"`
  - ❌ `"ha visto qualcosa"` → ✓ `"ha visto morire il proprio maestro"`

- **Luoghi senza articoli:** Evitare problemi con preposizioni
  - ❌ `"le Isole Gemelle"` (problema: "a le Isole")
  - ✓ `"Thornwall"`, `"Valdoria"`, `"Porto Grigio"`

#### DON'T ✗

- **Meta-narrazione:** Evitare frasi che parlano della storia invece di raccontarla
  - ❌ `"qualcosa che cambia una persona"`
  - ❌ `"cose che non hanno nome"`

- **Forme doppie:** Mai usare a/o
  - ❌ `"è stata/o tradita/o"`

- **Reputation negative impossibili:**
  - ❌ `"nessuno crede che..."` (se nessuno ci crede, perché dirlo?)

- **Connettori che richiedono articoli:**
  - ❌ `"Prima di [place]"` → ✓ `"Prima di arrivare a [place]"`

---

## Integrazione

### Input
```javascript
generateBackstory(name: string, patternKey?: string): string
```

- `name`: Nome del personaggio (obbligatorio)
- `patternKey`: Pattern specifico (opzionale). Valori: `'patternA'` - `'patternF'`, o `null` per random.

### Output
Stringa di testo, 2-3 frasi, pronta per la visualizzazione.

### Reset
```javascript
resetPools(): void
```
Resetta tutti i pool shufflati. Utile quando si vuole "ricominciare" la distribuzione.

---

## Estensione del Dataset

Per aggiungere nuovi contenuti:

1. **Nuovi elementi semplici:** Aggiungere stringhe ai pool esistenti
2. **Nuove varianti interne:** Usare sintassi `{a|b|c}` nelle stringhe
3. **Nuove origin phrases:** Aggiungere funzioni `(name, place) => string`
4. **Nuovi pattern:** Creare nuova entry in `templates` con `name` e `generate()`

### Stima Varietà

Con il dataset attuale:
- ~25 luoghi
- ~11 origin phrases × ~3 varianti interne = ~33
- ~15 formation phrases × ~4 varianti = ~60
- ~20 skills × ~4 varianti = ~80
- ~15 reputation sources
- ~14 reputation claims × ~3 varianti = ~42
- ~14 current states × ~3 varianti = ~42
- 6 pattern strutturali

**Combinazioni totali stimate:** decine di migliaia di backstory uniche.

---

## Troubleshooting

| Problema | Causa | Soluzione |
|----------|-------|-----------|
| Ripetizioni frequenti | Pool troppo piccoli | Espandere dataset |
| Frasi grammaticalmente scorrette | Accordi articolo-luogo | Rimuovere articoli dai luoghi |
| Tono inconsistente | Mix di registri | Uniformare linguaggio |
| Output troppo simili | Pochi pattern | Aggiungere varianti strutturali |
