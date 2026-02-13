# CPG v2.0 - Code Review & Development Notes

## Premessa

Questa analisi si concentra su bug potenziali, codice morto, inconsistenze logiche, ripetizioni e problemi di qualità del codice. Non tocca la qualità artistica delle sprite (che va bene) né il look & feel generale della UI (che va nella direzione giusta). Lo spirito del progetto -- un generatore procedurale di personaggi pixel-art per contesti fantasy/retro -- è chiaro e ben realizzato; le note seguenti mirano a renderlo più solido.

---

## 1. BUG E PROBLEMI LOGICI

### 1.1 Doppia applicazione degli effetti (Smoothing/Outline) nel base generator

**File:** `js/core/generator.js:558-598`

Il metodo `generatePixels()` nella classe base `CharacterGenerator` applica smoothing e outline internamente (righe 588-596), nonostante il metodo `generate()` (riga 34-40) disabiliti esplicitamente gli effetti prima di chiamare `generatePixels()` e poi li riapplichi via `ProcessorManager`. Il problema: quando `HumanGenerator` **non** chiama `super.generate()` per i pixel (ha il suo override di `generatePixels` che NON applica effetti), tutto funziona. Ma il `MonsterGenerator` usa il `generatePixels` della base class, che **contiene ancora il codice legacy** di smoothing/outline (righe 588-596). Questo codice legacy è morto perchè `rawParams` ha `enableSmoothing: false` e `showOutline: false`, ma rimane confusionario e potenzialmente pericoloso se qualcuno rimuove il wrapping dei params.

**Rischio:** Medio. Il codice morto nelle righe 628-702 (`applySmoothing`, `applyOutline`, `getMostCommonColor`, `hexToRgb`) è duplicato dai Processors e crea confusione su quale sia la source of truth.

**Soluzione proposta:** Rimuovere `applySmoothing()`, `applyOutline()`, `getMostCommonColor()` e `hexToRgb()` dalla classe base `CharacterGenerator`, dato che sono ora gestiti da `ProcessorManager`. Eliminare anche il codice condizionale in `generatePixels()` (righe 587-596).

---

### 1.2 `tint()` con bug nel ClothingGenerator

**File:** `js/generators/human/clothing-generator.js:53`

```js
const tint = (c, percent) => ({
    r: Math.min(255, c.r + (255 - c.r) * percent),
    g: Math.min(255, c.g + (255 - c.r) * percent),  // BUG: usa c.r invece di c.g
    b: Math.min(255, c.b + (255 - c.b) * percent)
});
```

Il canale verde usa `c.r` invece di `c.g` nel calcolo del tint. Questo produce colori leggermente errati su ogni pattern che usa `tint()` (bottoni, bordi tunica, ecc.).

**Rischio:** Alto. Colora in modo errato tutti i dettagli dei vestiti che usano tint.

**Soluzione proposta:** Correggere in `(255 - c.g) * percent`.

---

### 1.3 Belt detection usa identity check su oggetti

**File:** `js/generators/human/accessory-generator.js:97`

```js
if (colors && c1 === colors.shirt && c2 === colors.pants)
```

Questo confronto usa `===` (identity) su oggetti `{r,g,b}`. Funziona solo se il pixel punta esattamente allo stesso oggetto in memoria di `colors.shirt`. Dopo che i pattern del `ClothingGenerator` applicano `shade()` o `tint()`, creano nuovi oggetti colore, quindi il confronto `===` fallisce e la cintura non viene disegnata su quei pixel.

**Rischio:** Alto. La cintura si disegna solo su pixel plain (senza pattern applicati), creando un effetto frammentato.

**Soluzione proposta:** Usare un confronto per valore (`c1.r === colors.shirt.r && c1.g === colors.shirt.g && c1.b === colors.shirt.b`) oppure, meglio, usare una mappa di regioni (`regionMap[y][x]`) per determinare dove si trova il confine shirt/pants, indipendente dal colore.

---

### 1.4 Confronto colori per identity nel check pants !== shirt

**File:** `js/generators/human/human-generator.js:54`

```js
while (pantsColor === shirtColor && CLOTHING_COLORS.length > 1 && attempts < 10)
```

Poiché `getRandomColor` ritorna l'oggetto diretto dall'array `CLOTHING_COLORS`, questo confronto `===` funziona correttamente (stessa reference). Tuttavia, il pattern è fragile: se in futuro qualcuno clonasse i colori, il check smetterebbe di funzionare.

**Rischio:** Basso (funziona ora, fragile nel tempo).

**Soluzione proposta:** Usare confronto per valore o confronto di indice.

---

### 1.5 `drawBelt()` chiamato due volte

**File:** `js/generators/human/accessory-generator.js:27-28` e `js/generators/human/human-generator.js:411-412`

Il metodo `drawAccessories()` chiama internamente `this.drawBelt(pixels, centerX, canvasSize)` (senza colori!), poi `human-generator.js` chiama di nuovo `this.accessoryGenerator.drawBelt(pixels, centerX, canvasSize, colors)` con i colori.

La prima chiamata (da `drawAccessories`) non passa `colors`, quindi la condizione `if (colors && c1 === colors.shirt ...)` è `false` e non disegna nulla. Tuttavia, è comunque un loop O(n²) sprecato sull'intera griglia.

**Rischio:** Basso (performance inutile, nessun side effect visibile).

**Soluzione proposta:** Rimuovere la chiamata a `this.drawBelt()` da dentro `drawAccessories()`, oppure passare sempre i colori.

---

### 1.6 Probabilità gemme nel necklace generator non corrette

**File:** `js/generators/human/accessory-generator.js:16-18`

```js
if (rng.next() < 0.33) necklace.pendantColor = { r: 46, g: 204, b: 113 }; // Emerald
else if (rng.next() < 0.66) necklace.pendantColor = { r: 52, g: 152, b: 219 }; // Sapphire
```

Il secondo `rng.next()` crea un **nuovo** valore random, non riusa quello del primo check. Questo significa che le probabilità non sono 33/33/33 ma circa 33/44/22 (il rubino ha ~33%, lo smeraldo ~44% se non rubino, e il resto rimane zaffiro).

**Rischio:** Basso (estetico). La distribuzione è sbilanciata ma non è un crash.

**Soluzione proposta:** Salvare il valore in una variabile: `const gemRoll = rng.next(); if (gemRoll < 0.33) ... else if (gemRoll < 0.66) ... else ...`

---

### 1.7 `updateSingleModeBackstoryDisplay` punta a elemento inesistente

**File:** `js/app/UIManager.js:773`

```js
const preview = document.getElementById('singleBackstoryPreview');
```

Non esiste alcun elemento con id `singleBackstoryPreview` nell'HTML. Il backstory in single mode viene mostrato nell'area principale via `renderSingleCharacterView()` con id `mainBackstoryPreview`. Quindi questa funzione non aggiorna mai nulla.

**Rischio:** Alto (funzionale). Quando l'utente rigenera la backstory in single mode, il testo nella sidebar non si aggiorna (perché l'elemento non esiste). L'aggiornamento funziona solo perché `regenerateBackstory()` chiama anche `renderSingleCharacterView()`, che ricrea l'intero view.

**Soluzione proposta:** Allineare l'id all'elemento effettivo (`mainBackstoryPreview`) o creare l'elemento mancante nella sidebar.

---

### 1.8 MonsterBackstoryGenerator.generate() non accetta `patternKey`

**File:** `js/generators/monster/monster-backstory.js:18`

```js
generate(name) {  // Solo 'name', nessun patternKey!
```

La classe base `BackstoryGenerator` dichiara `generate(name, patternKey)` e `SingleModeController.regenerateBackstory()` passa `patternKey` al backstory generator. Ma `MonsterBackstoryGenerator.generate()` ignora il parametro, quindi la selezione del pattern dal dropdown della UI non funziona per i mostri.

**Rischio:** Medio (funzionale). L'utente può selezionare un pattern dalla UI per i mostri, ma viene ignorato.

**Soluzione proposta:** Aggiungere il parametro `patternKey` e implementare la selezione come in `HumanBackstoryGenerator`.

---

### 1.9 `window.onclick` override globale nella modal

**File:** `js/app/ModalManager.js:37`

```js
window.onclick = (event) => {
    if (event.target == modal) closeModal();
};
```

Assegna direttamente a `window.onclick`, sovrascrivendo qualsiasi altro handler globale di click. Questo è problematico se in futuro si aggiungono altri handler globali.

**Rischio:** Basso (ora non ci sono conflitti, ma è un anti-pattern).

**Soluzione proposta:** Usare `window.addEventListener('click', ...)` con cleanup appropriato.

---

### 1.10 Animation frame mismatch: 3 frame generati, 2 esportati

**File:** `js/app/ExportManager.js:148,188`

L'animazione genera 3 frame (indici 0, 1, 2 per exhale/neutral/inhale), ma l'export strip e sequence esportano solo `numFrames = 2`. Questo significa che il terzo frame (inhale) non viene mai esportato.

**Rischio:** Medio (funzionale). L'utente ottiene un export incompleto dell'animazione.

**Soluzione proposta:** Cambiare `numFrames` a 3, o documentare la scelta se intenzionale.

---

## 2. CODICE MORTO E INUTILIZZATO

### 2.1 `CharacterManager` quasi interamente inutilizzato

**File:** `js/app/CharacterManager.js`

Questa classe viene istanziata in `main.js:37` e esposta su `window.characterManager` (riga 55), ma **nessun metodo viene mai chiamato** dal codice dell'applicazione. I metodi `createCharacter()`, `updateCharacter()`, `getCharacter()`, `selectCharacter()`, `getSelectedCharacter()`, `saveToStorage()`, `loadFromStorage()` non sono utilizzati da nessuna parte.

L'applicazione gestisce i personaggi direttamente tramite `App.characters[]` e `App.singleModeCharacter`, bypassando completamente il manager.

**Soluzione proposta:** Rimuovere la classe o integrarla effettivamente nel flusso dell'app.

---

### 2.2 `CharacterData.js` (schema) non utilizzato

**File:** `js/schemas/CharacterData.js`

Il `CharacterSchema` esportato non viene importato da nessun file. I personaggi vengono creati come oggetti plain senza validazione o struttura formale.

**Soluzione proposta:** Rimuovere o integrare come factory per la creazione dei personaggi.

---

### 2.3 `BODY_PROPORTIONS` in config.js parzialmente duplicato

**File:** `js/config.js` (BODY_PROPORTIONS) vs `js/core/generator.js:200-277` (getParamRanges)

La classe base `CharacterGenerator.getParamRanges()` ha i propri range hardcoded (identici ai monster ranges). `MonsterGenerator` e `HumanGenerator` fanno override con i dati da `BODY_PROPORTIONS`. Tuttavia, il metodo della base class non viene mai usato direttamente (sempre overridden dai figli), rendendo i ~80 righe di codice nella base class non necessari.

**Soluzione proposta:** Rendere `getParamRanges()` abstract nella base class, o rimuovere l'implementazione di default.

---

### 2.4 `PARAM_CONFIG.safeMin/safeMax` vs `BODY_PROPORTIONS`

**File:** `js/config.js`

I `safeMin`/`safeMax` in `PARAM_CONFIG` sono documentati come "fallback" ma i range effettivi vengono sempre da `BODY_PROPORTIONS` (human/monster) o da `getParamRanges()`. `safeMin`/`safeMax` sono usati solo:
- Come fallback in `UIManager.getParamsFromUI()` se un slider non esiste.
- Per il preset "max" (Chaos) in `applyPresetToSliders()`.

Questa doppia fonte di verità è confusa.

**Soluzione proposta:** Documentare chiaramente il ruolo di ciascuno, oppure unificare.

---

### 2.5 Display options nascosti e inutilizzati

**File:** `index.html:113-120`

```html
<div class="checkbox-row" style="display:none">
    <input type="checkbox" id="showShapes">
    <label for="showShapes">Raw Shapes</label>
</div>
<div class="checkbox-row" style="display:none">
    <input type="checkbox" id="showAnalysis">
    <label for="showAnalysis">Analysis</label>
</div>
```

I checkbox `showShapes` e `showAnalysis` sono nascosti e non gestiti da nessuna logica di rendering. L'array `displayCheckboxes` in UIManager li include ma il renderer non li usa.

**Soluzione proposta:** Rimuovere dal HTML e dall'array in UIManager.

---

### 2.6 `setupBatchOptions()` vuoto

**File:** `js/app/UIManager.js:236-238`

```js
setupBatchOptions() {
    // Presets are now handled in setupGeneratorType via buttons
}
```

Metodo vuoto, solo un commento.

**Soluzione proposta:** Rimuovere.

---

### 2.7 `singleParamsContainer` legacy

**File:** `index.html:328`

```html
<div id="singleParamsContainer" style="display: none;"></div>
```

Commento dice "Legacy container for compatibility" ma non è usato da nessuna parte nel codice JS.

**Soluzione proposta:** Rimuovere.

---

### 2.8 `HumanGenerator.getRandomColor()` inutilizzato

**File:** `js/generators/human/human-generator.js:76-79`

```js
getRandomColor(array) {
    return array[Math.floor(Math.random() * array.length)];
}
```

Questo metodo non è mai chiamato. La versione seeded (`getRandomColor` come closure in `randomParamsInRange`) lo sostituisce completamente.

**Soluzione proposta:** Rimuovere.

---

### 2.9 `pointToSegmentDistance()` non utilizzato

**File:** `js/utils/math.js:91-107`

Esportato ma mai importato o usato da nessun file.

**Soluzione proposta:** Rimuovere.

---

### 2.10 Import inutilizzati

**File:** `js/generators/human/human-generator.js:3`
```js
import { randomFloat, randomInt, SeededRandom } from '../../utils/random.js';
```
`randomFloat` e `randomInt` non sono usati in questo file (solo `SeededRandom`).

**File:** `js/generators/monster/monster-generator.js:4`
```js
import { PARAM_CONFIG, BODY_PROPORTIONS } from '../../config.js';
```
`PARAM_CONFIG` non è usato in questo file.

**File:** `js/generators/human/human-generator.js:4`
```js
import { createTrapezoid, createJoint, getTrapezoidBottom, isPointInPolygon } from '../../utils/math.js';
```
`createTrapezoid`, `createJoint`, `getTrapezoidBottom` sono importati qui ma sono già usati tramite la base class. L'import di `isPointInPolygon` è legittimo (usato in `generatePixels`), ma gli altri sono ridondanti.

**File:** `js/app/UIManager.js:6`
```js
import { hash, SeededRandom, randomFloat } from '../utils/random.js';
```
`hash` è usato in `setupFaceSelectors()` ma `randomFloat` è usato solo nel `wireRandomizer('randBody')` dove accede a `PARAM_CONFIG[key]` con `.min/.max` che non esistono (usa `safeMin/safeMax`). Questo potrebbe essere un bug: `randomFloat(conf.min, conf.max)` genera `NaN` perché `PARAM_CONFIG` non ha `.min/.max`, ha `.safeMin/.safeMax`.

---

## 3. INCONSISTENZE E PROBLEMI DI DESIGN

### 3.1 `randBody` usa proprietà inesistenti di PARAM_CONFIG

**File:** `js/app/UIManager.js:295-298`

```js
keyParams.forEach(key => {
    const conf = PARAM_CONFIG[key];
    if (conf) {
        controller.workingParams[key] = randomFloat(conf.min, conf.max); // BUG
    }
});
```

`PARAM_CONFIG` ha `hardMin/hardMax` e `safeMin/safeMax`, **non** `min/max`. Il risultato di `randomFloat(undefined, undefined)` è `NaN`, che viene poi assegnato ai parametri del personaggio. Questo rende il bottone "Random" nella sezione Body del single mode non funzionante (produce personaggi corrotti).

**Rischio:** Alto (funzionale).

**Soluzione proposta:** Usare `conf.safeMin` e `conf.safeMax` (o `hardMin/hardMax`).

---

### 3.2 Commenti come sviluppo-in-progress nel codice di produzione

**File:** `index.html:46-52`

L'HTML contiene un commento di design molto lungo che discute l'implementazione. Simili commenti si trovano in diversi file JS.

**Soluzione proposta:** Ripulire i commenti che descrivono decisioni di sviluppo passate. Tenere solo commenti che spiegano il "perché" del codice.

---

### 3.3 Stile inline vs CSS

**File:** `index.html` passim

Ci sono diversi `style="display:none"` e `style="width: 100%; margin-top: 8px;"` inline. I preset buttons usano `style.background` e `style.color` inline via JS (`UIManager.js:58-59, 66-69`) invece di toggle di classi CSS.

**Soluzione proposta:** Centralizzare gli stili in `style.css` e usare classi togglabili.

---

### 3.4 Listener management inconsistente

**File:** `js/app/UIManager.js`

Alcuni listener sono impostati con `addEventListener` (non rimovibili), altri con `element.onclick = ...` (sovrascrivibili). In `populateSingleModeControls()`, i listener vengono reimpostati ad ogni chiamata senza rimuovere i precedenti per quelli con `addEventListener`, e sovrascrivendo per quelli con `.onclick`.

Esempio: `resetBtn.onclick = () => ...` sovrascrive il precedente handler, che va bene. Ma `card.addEventListener('click', ...)` in `renderCharacters()` accumula handler se non si ricrea l'elemento (cosa che si fa, essendo `innerHTML = ''`). In generale funziona, ma il pattern è inconsistente.

**Soluzione proposta:** Scegliere un pattern unico. Per elementi ricreativi (grid, sliders), `addEventListener` è ok perché l'elemento viene distrutto e ricreato. Per elementi persistenti (bottoni sidebar), `.onclick` o `addEventListener` con cleanup.

---

### 3.5 Generazione nomi non deterministica

I generatori di nomi (`HumanNameGenerator`, `MonsterNameGenerator`) usano `Math.random()` direttamente, non il seeded RNG. Questo significa che:
- Rigenerando lo stesso seed si ottiene lo stesso corpo ma un nome diverso.
- In `HumanGenerator.generate()` (riga 22), il nome viene generato **dopo** `super.generate()`, ma poi in `App.generateCharacters()` (riga 130) il backstory usa quel nome. Se si rigenera, il nome cambia.

Nella logica attuale, `regenerateCurrentCharacters()` preserva manualmente il nome e backstory (righe 183-185), quindi il problema è mitigato. Ma per la prima generazione, il nome non è legato al seed.

**Rischio:** Basso (funzionamento attuale ok, ma design non deterministico).

**Soluzione proposta:** Passare l'RNG seeded ai name generators se si vuole piena determinismo.

---

### 3.6 `torsoY` hardcoded a 20 in `getParamsFromUI()`

**File:** `js/app/UIManager.js:905`

```js
torsoY: 20,
```

Valore fisso, non derivato da nessun slider o configurazione. Nella generazione effettiva, `HumanGenerator` ricalcola `torsoY` dinamicamente, e `MonsterGenerator` usa il range da `BODY_PROPORTIONS`. Questo valore 20 viene usato solo in `resolveParams()` quando si rigenera con gli slider, dove è potenzialmente inadeguato per certi preset.

**Rischio:** Medio. Potrebbe causare personaggi con torso posizionato troppo alto o basso durante la rigenerazione batch.

**Soluzione proposta:** Includere `torsoY` come range slider o derivarlo dinamicamente.

---

### 3.7 `shinLength` hardcoded a 24 in `resolveParams()`

**File:** `js/core/generator.js:139`

```js
resolved.shinLength = 24; // Fixed at 24%
```

Questo sovrascrive qualsiasi valore di `shinLength` dallo slider. Se l'utente imposta uno slider per `shinLength`, non avrà effetto durante la rigenerazione (che passa per `resolveParams`).

Tuttavia, `shinLength` non è esposto come slider nell'UI, quindi questo non è un problema visibile per l'utente. Ma se si volesse aggiungere, non funzionerebbe.

**Rischio:** Basso (funziona per ora).

**Soluzione proposta:** Documentare il motivo della scelta, o usare il valore risolto dal range.

---

### 3.8 `gridSize` hidden input non utilizzato

**File:** `index.html:131`

```html
<input type="hidden" id="gridSize" value="64">
```

Non è mai letto dal codice JS. Il canvasSize è gestito tramite l'altro slider (`canvasSize`). Il valore 64 non corrisponde nemmeno al default del canvas (50).

**Soluzione proposta:** Rimuovere.

---

## 4. DUPLICAZIONI DI CODICE

### 4.1 `generateBodyParts()` triplicato

Il metodo `generateBodyParts()` è implementato in tre posti:
1. `CharacterGenerator` (base) - ~170 righe
2. `HumanGenerator` - ~190 righe (override completo)
3. `MonsterGenerator` - ~170 righe (quasi identico alla base)

`MonsterGenerator.generateBodyParts()` è **quasi identico** a `CharacterGenerator.generateBodyParts()`. L'unica differenza è che il monster non ha `region` assignments (righe 260-284 nell'human) e che l'human ha logica diversa per la posizione delle gambe (hip inward offset, torsoY calculation). Il monster potrebbe usare direttamente il metodo della base class.

**Soluzione proposta:** Rimuovere `MonsterGenerator.generateBodyParts()` e usare quello della base class. Estrarre la logica comune in metodi helper.

---

### 4.2 `hexToRgb()` duplicato

Implementato in:
1. `CharacterGenerator.hexToRgb()` - riga 728
2. `OutlineProcessor.hexToRgb()` - riga 66

**Soluzione proposta:** Spostare in `utils/` e importare dove necessario.

---

### 4.3 `getMostCommonColor()` duplicato

Implementato in:
1. `CharacterGenerator.getMostCommonColor()` - riga 705
2. `SmoothingProcessor.getMostCommonColor()` - riga 60

**Soluzione proposta:** Come sopra, spostare in `utils/`.

---

### 4.4 `shade()` e `tint()` duplicati 4 volte

Implementati in:
1. `LightingProcessor.shade()` / `LightingProcessor.tint()`
2. `FaceGenerator` (inline come closure)
3. `ClothingGenerator.applyPattern()` (inline come closure, con bug al punto 1.2)
4. Implicitamente nella logica di `SmoothingProcessor`

**Soluzione proposta:** Creare utility functions `shade(color, percent)` e `tint(color, percent)` in `utils/color.js`.

---

### 4.5 Face pixel extraction/application duplicata

La logica per estrarre i pixel del viso dal primo frame e riapplicarli con offset (head bobbing) è duplicata tra:
1. `HumanGenerator.generateAnimationFrames()` - righe 491-528
2. `MonsterGenerator.generateAnimationFrames()` - righe 257-296

**Soluzione proposta:** Estrarre in un metodo condiviso della base class, tipo `applyFaceConsistency(frames, headBounds)`.

---

## 5. PROBLEMI DI PERFORMANCE

### 5.1 Rigenerazione costosa ad ogni cambio slider

Ogni cambio di slider batch (`change` event) trigger `regenerateCurrentCharacters()`, che rigenera **tutti** i personaggi da zero, inclusi animation frames. Per 100 personaggi, questo è significativamente costoso.

**Soluzione proposta:** Debounce sugli slider (già parzialmente fatto da noUiSlider con l'evento `change` vs `update`). Considerare la rigenerazione lazy (solo quando visibile) o la rigenerazione progressiva.

---

### 5.2 Animation frames generati anche in batch mode

In `generateCharacters()` e `regenerateCurrentCharacters()`, vengono generati 3 animation frames per ogni personaggio. Questo triplica il costo di generazione. I frame servono solo per l'animazione nel modal, che mostra un solo personaggio alla volta.

**Soluzione proposta:** Generare i frame di animazione on-demand (quando si apre il modal) invece che per tutti i personaggi.

---

### 5.3 `drawBelt()` itera l'intera griglia pixel

**File:** `js/generators/human/accessory-generator.js:80-102`

Il metodo scorre tutti i pixel del canvas per trovare transizioni shirt→pants. Questo è un O(n²) che potrebbe essere ottimizzato conoscendo le coordinate del torso bottom.

**Soluzione proposta:** Limitare il loop alla regione del torso bottom ± qualche pixel.

---

## 6. PROBLEMI UI/UX

### 6.1 Click su "Single" mode button senza personaggio

**File:** `js/app/UIManager.js:243`

Cliccando il bottone "Single" nella sidebar sinistra chiama `switchMode('single')` che mostra i controlli single mode, ma **non entra effettivamente in single mode** (nessun personaggio selezionato). L'utente vede una sidebar con controlli vuoti e il main content resta invariato.

**Soluzione proposta:** Disabilitare il bottone "Single" quando non c'è un personaggio selezionato, oppure selezionare automaticamente il primo personaggio.

---

### 6.2 `randomize` button in batch mode randomizza gli slider, non i personaggi

Il bottone "RANDOMIZE" nell'header della sidebar destra chiama `randomizeSliders()`, che modifica i range degli slider e poi rigenera i personaggi. Non genera nuovi seed/nomi/backstory. Potrebbe non essere chiaro all'utente.

**Soluzione proposta:** Chiarire il comportamento (es. label "RANDOMIZE RANGES") o cambiare comportamento per rigenerare completamente.

---

### 6.3 Nessun feedback durante generazione batch pesante

Generare 100 personaggi blocca il thread principale senza alcun indicatore di caricamento.

**Soluzione proposta:** Mostrare un indicatore di loading o usare `requestAnimationFrame`/chunking per non bloccare la UI.

---

### 6.4 Light direction "top" e "top-right" mancanti come opzioni consistenti

**File:** `index.html:77-83` vs `js/core/processors/LightingProcessor.js:44-62`

L'HTML offre 5 direzioni: top-left, top, top-right, left, right.
Il processor gestisce solo: top-left, top-right, bottom-right, bottom-left.
Le opzioni `top`, `left`, `right` non sono gestite dal processor e cadono nel `default` (top-right).

**Rischio:** Medio (funzionale). Selezionare "top" (↑), "left" (←), o "right" (→) produce lo stesso risultato di "top-right".

**Soluzione proposta:** Implementare le 5 direzioni nel processor, o rimuovere quelle non supportate dalla UI.

---

### 6.5 Export card con backstory di fallback in italiano hardcoded

**File:** `js/app/ExportManager.js:79`

```js
const descText = char.backstory || "Di Narril si sa poco. Qualcuno sostiene che non invecchi mai davvero.";
```

Se manca la backstory, viene usato un testo hardcoded specifico di un personaggio ("Narril"). Questo è probabilmente un residuo di testing.

**Soluzione proposta:** Rimuovere il fallback specifico, usare una stringa vuota o un generico placeholder.

---

### 6.6 Nessun export da single mode

Dalla single mode view non c'è modo diretto di esportare il personaggio. L'utente deve tornare in batch mode e aprire il modal per accedere ai bottoni di export.

**Soluzione proposta:** Aggiungere bottoni di export nella sezione actions del single mode.

---

## 7. CSS/HTML

### 7.1 `--sidebar-width: 320px` non usata

La variabile CSS è definita ma le sidebar hanno larghezze hardcoded nel grid:
```css
grid-template-columns: 280px 1fr 300px;
```

**Soluzione proposta:** Usare le variabili CSS o rimuovere quelle inutilizzate.

---

### 7.2 `.export-grid` non usata

La classe CSS è definita (riga 280-287) ma non compare in nessun elemento HTML.

**Soluzione proposta:** Rimuovere.

---

### 7.3 `button` selector troppo ampio

**File:** `style.css:197-219`

Il selector `button` senza classi applica stili a **tutti** i bottoni della pagina, inclusi quelli del modal e della navigazione. I nav buttons (`<` e `>`) devono poi sovrascrivere pesantemente (`.nav-btn`). Sarebbe più pulito avere uno stile base più neutro.

**Soluzione proposta:** Restringere il selector base o usare classi specifiche.

---

### 7.4 `btn-random-section` width issue

**File:** `style.css:250-267`

Il selector `button` base imposta `width: 100%`. Il `.btn-random-section` non sovrascrive la width, quindi i bottoni "Random" nelle sezioni del single mode sono forzati al 100% di larghezza, anche se il design voleva che fossero compatti nell'header. Funzionano solo perché sono dentro un flex container con `justify-content: space-between`.

**Rischio:** Basso (funziona per caso).

**Soluzione proposta:** Aggiungere `width: auto` a `.btn-random-section`.

---

## 8. ARCHITETTURA E SUGGERIMENTI GENERALI

### 8.1 Stato globale sparso

Lo stato dell'applicazione è distribuito tra:
- `App.characters[]`
- `App.singleModeCharacter`
- `App.batchCharactersBackup`
- `App.currentParams`
- `App.displayOptions`
- `App.currentMode`
- `App.batchOptions`
- `SingleModeController.workingParams`
- `SingleModeController.originalCharacter`
- `CharacterManager.characters` (non usato)
- `ModalManager.currentModalCharacter`
- `window.characterManager` (debug)
- `window.app` (debug)

Considerare una centralizzazione dello stato (anche semplice, tipo un oggetto `AppState`), specialmente per evitare desync tra backup e stato attuale.

---

### 8.2 `nameGenerator.generate()` in HumanGenerator genera sempre tipo 'human'

**File:** `js/generators/name-generator.js:20`

```js
generate(type = 'human') {
```

`HumanGenerator.generate()` chiama `nameGenerator.generate()` senza argomenti, usando il default `'human'`. Funziona, ma il tipo non viene derivato dal contesto -- è hardcoded nel default. `MonsterGenerator` usa il suo proprio `MonsterNameGenerator` diretto, bypassando il `NameGeneratorManager`.

L'astrazione `NameGeneratorManager` è quindi solo parzialmente sfruttata.

---

### 8.3 Mancanza di error boundaries

Nessun `try/catch` intorno alle operazioni critiche (generazione, export, JSZip). Se un parametro invalido causa un errore in `generateBodyParts()`, l'intera app si blocca silenziosamente.

**Soluzione proposta:** Aggiungere gestione errori almeno intorno a generazione e export.

---

## RIEPILOGO PRIORITA'

### Critici (Bug funzionali)
1. **Bug `tint()` nel ClothingGenerator** (1.2) - Colori errati sui vestiti
2. **`randBody` usa `conf.min/max` inesistenti** (3.1) - Bottone Random Body non funziona
3. **Light directions non implementate** (6.4) - 3 opzioni su 5 non funzionano

### Importanti (Funzionalità degradata)
4. **Belt identity check** (1.3) - Cintura frammentata
5. **Monster backstory patternKey ignorato** (1.8) - Dropdown pattern ignorato per mostri
6. **Export frames count mismatch** (1.10) - 1 frame di animazione perso nell'export
7. **`updateSingleModeBackstoryDisplay` punta a id inesistente** (1.7)

### Pulizia (Codice morto e duplicazioni)
8. **CharacterManager inutilizzato** (2.1)
9. **CharacterData schema inutilizzato** (2.2)
10. **generateBodyParts triplicato** (4.1)
11. **shade/tint/hexToRgb duplicati** (4.2-4.4)
12. **Metodi legacy nella base class** (2.3)
13. **Import inutilizzati** (2.10)

### Miglioramenti (Qualità e UX)
14. **Animation frames on-demand** (5.2) - Performance
15. **Single mode senza personaggio** (6.1) - UX
16. **Loading indicator per batch 100** (6.3) - UX
17. **Stato centralizzato** (8.1) - Architettura
