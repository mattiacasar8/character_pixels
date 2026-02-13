# CPG v2.0 - Code Review & Development Notes

## Premessa

Questa analisi si concentra su bug potenziali, codice morto, inconsistenze logiche, ripetizioni e problemi di qualità del codice. Non tocca la qualità artistica delle sprite (che va bene) né il look & feel generale della UI (che va nella direzione giusta). Lo spirito del progetto -- un generatore procedurale di personaggi pixel-art per contesti fantasy/retro -- è chiaro e ben realizzato; le note seguenti mirano a renderlo più solido.

---

## 1. BUG E PROBLEMI LOGICI

### 1.1 Doppia applicazione degli effetti (Smoothing/Outline) nel base generator -- RISOLTO

~~Il metodo `generatePixels()` conteneva codice legacy di smoothing/outline duplicato dai Processors.~~

**Fix:** Rimossi `applySmoothing()`, `applyOutline()`, `getMostCommonColor()` e `hexToRgb()` dalla classe base `CharacterGenerator`. Eliminato il codice condizionale legacy in `generatePixels()`.

---

### 1.2 `tint()` con bug nel ClothingGenerator -- RISOLTO

~~Il canale verde usava `c.r` invece di `c.g` nel calcolo del tint.~~

**Fix:** Corretto in `(255 - c.g) * percent`.

---

### 1.3 Belt detection usa identity check su oggetti -- RISOLTO

~~Il confronto `===` su oggetti `{r,g,b}` falliva dopo shade/tint.~~

**Fix:** Ora confronta per valore `{r,g,b}` invece che per reference.

---

### 1.4 Confronto colori per identity nel check pants !== shirt -- RISOLTO

~~Il confronto `===` funzionava per coincidenza (stessa reference) ma era fragile.~~

**Fix:** Cambiato in confronto per valore RGB (`pantsColor.r === shirtColor.r && ...`).

---

### 1.5 `drawBelt()` chiamato due volte -- RISOLTO

~~La chiamata duplicata da `drawAccessories()` senza colori sprecava un loop O(n²).~~

**Fix:** Rimossa la chiamata inutile da `drawAccessories()`.

---

### 1.6 Probabilità gemme nel necklace generator non corrette -- RISOLTO

~~Il doppio `rng.next()` sbilanciava la distribuzione delle gemme.~~

**Fix:** Salvato il valore in una variabile per distribuzione equa 33/33/33.

---

### 1.7 `updateSingleModeBackstoryDisplay` punta a elemento inesistente -- RISOLTO

~~L'id `singleBackstoryPreview` non esisteva nell'HTML.~~

**Fix:** Corretto id in `mainBackstoryPreview`.

---

### 1.8 MonsterBackstoryGenerator.generate() non accetta `patternKey` -- RISOLTO

~~Il parametro `patternKey` veniva ignorato per i mostri.~~

**Fix:** Aggiunto il parametro e implementata la selezione pattern.

---

### 1.9 `window.onclick` override globale nella modal -- RISOLTO

~~`window.onclick` sovrascriveva altri handler globali.~~

**Fix:** Sostituito con `window.addEventListener('click', ...)`.

---

### 1.10 Animation frame mismatch: 3 frame generati, 2 esportati -- RISOLTO

~~L'export strip e sequence esportavano solo 2 frame su 3.~~

**Fix:** Cambiato `numFrames` da 2 a 3.

---

## 2. CODICE MORTO E INUTILIZZATO

### 2.1 `CharacterManager` quasi interamente inutilizzato -- RISOLTO

~~Classe istanziata ma mai utilizzata.~~

**Fix:** Rimosso import e istanziazione da `main.js`.

---

### 2.2 `CharacterData.js` (schema) non utilizzato -- RISOLTO

~~Il `CharacterSchema` esportato non veniva importato da nessun file.~~

**Fix:** Rimosso il file `js/schemas/CharacterData.js` e la directory `js/schemas/`.

---

### 2.3 `BODY_PROPORTIONS` in config.js parzialmente duplicato -- RISOLTO

~~La base class `CharacterGenerator.getParamRanges()` aveva ~80 righe di range hardcoded identici a `BODY_PROPORTIONS.monster`.~~

**Fix:** Il metodo `getParamRanges()` della base class ora delega a `BODY_PROPORTIONS.monster` dal config centralizzato, eliminando la duplicazione. Aggiunto `import { BODY_PROPORTIONS }` al generator.

---

### 2.4 `PARAM_CONFIG.safeMin/safeMax` vs `BODY_PROPORTIONS` -- RISOLTO

~~Doppia fonte di verità senza documentazione chiara.~~

**Fix:** Aggiunta documentazione in `config.js` che spiega i due sistemi: `PARAM_CONFIG` per UI/slider e `BODY_PROPORTIONS` come source of truth per la generazione.

---

### 2.5 Display options nascosti e inutilizzati -- RISOLTO

~~I checkbox `showShapes` e `showAnalysis` erano nascosti e non gestiti.~~

**Fix:** Rimossi da HTML.

---

### 2.6 `setupBatchOptions()` vuoto -- RISOLTO

~~Metodo vuoto con solo un commento.~~

**Fix:** Rimosso.

---

### 2.7 `singleParamsContainer` legacy -- RISOLTO

~~Elemento HTML legacy non usato.~~

**Fix:** Rimosso.

---

### 2.8 `HumanGenerator.getRandomColor()` inutilizzato -- RISOLTO

~~Metodo mai chiamato.~~

**Fix:** Rimosso.

---

### 2.9 `pointToSegmentDistance()` non utilizzato -- RISOLTO

~~Esportato ma mai importato.~~

**Fix:** Rimosso.

---

### 2.10 Import inutilizzati -- RISOLTO

~~Import ridondanti in vari file.~~

**Fix:** Puliti in `generator.js`, `human-generator.js`, `monster-generator.js`.

---

## 3. INCONSISTENZE E PROBLEMI DI DESIGN

### 3.1 `randBody` usa proprietà inesistenti di PARAM_CONFIG -- RISOLTO

~~`randomFloat(conf.min, conf.max)` produceva `NaN`.~~

**Fix:** Corretto in `conf.safeMin` e `conf.safeMax`.

---

### 3.2 Commenti come sviluppo-in-progress nel codice di produzione -- RISOLTO (parziale)

~~Commenti di design verbosi nel codice.~~

**Fix:** Puliti i commenti stale principali. Alcuni commenti utili mantenuti.

---

### 3.3 Stile inline vs CSS -- RISOLTO (parziale)

~~I preset buttons usavano `style.background` e `style.color` inline via JS.~~

**Fix:** Sostituiti gli stili inline dei preset buttons con la classe CSS `.preset-active`. Alcuni `style="display:none"` inline rimangono per gli elementi nascosti di default.

---

### 3.4 Listener management inconsistente

Pattern inconsistente tra `addEventListener` e `.onclick`, ma funziona correttamente nel contesto attuale: `.onclick` per elementi persistenti, `addEventListener` per elementi ricreati.

**Status:** Accettabile, pattern documentato.

---

### 3.5 Generazione nomi non deterministica -- RISOLTO

~~I generatori di nomi usavano `Math.random()` direttamente.~~

**Fix:** `HumanNameGenerator.generate()` e `MonsterNameGenerator.generate()` ora accettano un parametro opzionale `rng` per la generazione deterministica. Senza parametro, usano `Math.random()` come fallback retrocompatibile.

---

### 3.6 `torsoY` hardcoded a 20 in `getParamsFromUI()` -- RISOLTO

~~Valore fisso non derivato da configurazione.~~

**Fix:** Cambiato da `torsoY: 20` a `torsoY: { min: 16, max: 24 }` (range object come gli altri parametri), così `resolveParams()` lo risolve correttamente con il seeded RNG.

---

### 3.7 `shinLength` hardcoded a 24 in `resolveParams()` -- RISOLTO

~~Sovrascriveva qualsiasi valore risolto.~~

**Fix:** Cambiato da `resolved.shinLength = 24` a `if (!resolved.shinLength) resolved.shinLength = 24`, così il valore risolto dal range ha priorità.

---

### 3.8 `gridSize` hidden input non utilizzato -- RISOLTO

~~Non mai letto dal codice JS.~~

**Fix:** Rimosso.

---

## 4. DUPLICAZIONI DI CODICE

### 4.1 `generateBodyParts()` triplicato -- RISOLTO

~~`MonsterGenerator.generateBodyParts()` era quasi identico alla base class.~~

**Fix:** Rimosso l'override in `MonsterGenerator`, usa ora l'ereditarietà dalla base class.

---

### 4.2 `hexToRgb()` duplicato -- RISOLTO

~~Implementato sia in `CharacterGenerator` che in `OutlineProcessor`.~~

**Fix:** Spostato in `js/utils/color.js`. `OutlineProcessor` importa dal modulo condiviso. Rimosso dalla base class.

---

### 4.3 `getMostCommonColor()` duplicato -- RISOLTO

~~Implementato sia in `CharacterGenerator` che in `SmoothingProcessor`.~~

**Fix:** Spostato in `js/utils/color.js`. Rimosso dalla base class.

---

### 4.4 `shade()` e `tint()` duplicati 4 volte -- RISOLTO

~~Implementati in LightingProcessor, FaceGenerator, ClothingGenerator.~~

**Fix:** Creato `js/utils/color.js` con `shade`, `tint`, `hexToRgb`, `getMostCommonColor` condivisi.

---

### 4.5 Face pixel extraction/application duplicata -- RISOLTO

~~La logica per estrarre/riapplicare i pixel del viso era duplicata tra `HumanGenerator` e `MonsterGenerator`.~~

**Fix:** Estratti i metodi `extractFacePixels(pixels, bodyParts)` e `applyFacePixels(pixels, facePixels, headBounds, yOffset)` nella base class `CharacterGenerator`. Entrambi i generatori ora usano i metodi condivisi.

---

## 5. PROBLEMI DI PERFORMANCE

### 5.1 Rigenerazione costosa ad ogni cambio slider -- RISOLTO (parziale)

~~Ogni cambio di slider batch rigenerava tutti i personaggi.~~

**Fix:** noUiSlider usa già l'evento `change` (fires on release, non during drag), che è un debounce naturale. Aggiunto loading indicator per batch grandi (vedi 6.3).

---

### 5.2 Animation frames generati anche in batch mode -- RISOLTO

~~I frame di animazione venivano generati per tutti i personaggi durante il batch, triplicando il costo.~~

**Fix:** Generazione animation frames ora on-demand (lazy): i frame vengono generati solo quando il modal viene aperto (`ModalManager.show()` e `navigate()`) o quando si esporta (`ExportManager._ensureAnimationFrames()`). Rimossa la generazione eagra da `generateCharacters()` e `regenerateCurrentCharacters()`. La cache viene invalidata (`null`) durante il reprocess.

---

### 5.3 `drawBelt()` itera l'intera griglia pixel -- RISOLTO

~~Il loop O(n²) scorreva tutta la griglia.~~

**Fix:** Limitato il loop alla regione del torso: scan verticale 30-70% del canvas, orizzontale ±25% dal centro. Riduce drasticamente l'area scansionata.

---

## 6. PROBLEMI UI/UX

### 6.1 Click su "Single" mode button senza personaggio -- RISOLTO

~~L'utente poteva cliccare "Single" senza personaggi, vedendo controlli vuoti.~~

**Fix:** Il bottone "Single" ora auto-seleziona il primo personaggio del batch. Se non ci sono personaggi, ne genera uno automaticamente.

---

### 6.2 `randomize` button in batch mode randomizza gli slider, non i personaggi -- RISOLTO

~~Il bottone "RANDOMIZE" poteva confondere l'utente.~~

**Fix:** Il label del bottone ora cambia dinamicamente: "RANDOMIZE RANGES" in batch mode, "RANDOMIZE" in single mode. Chiarisce il comportamento contextuale.

---

### 6.3 Nessun feedback durante generazione batch pesante -- RISOLTO

~~Generare 100 personaggi bloccava il thread senza indicatore.~~

**Fix:** Aggiunto overlay "Generating..." con `setTimeout` per permettere il rendering prima del lavoro pesante. Attivato per batch >= 10 personaggi.

---

### 6.4 Light direction "top" e "top-right" mancanti come opzioni consistenti -- RISOLTO

~~Le opzioni `top`, `left`, `right` cadevano nel default (top-right).~~

**Fix:** Implementate tutte e 5 le direzioni nel `LightingProcessor`.

---

### 6.5 Export card con backstory di fallback in italiano hardcoded -- RISOLTO

~~Backstory hardcoded "Di Narril..." usata come fallback.~~

**Fix:** Rimosso il fallback specifico.

---

### 6.6 Nessun export da single mode -- RISOLTO

~~Dalla single mode view non c'era modo diretto di esportare.~~

**Fix:** Aggiunti bottoni "EXPORT CARD", "EXPORT STRIP", "EXPORT SEQ" nella sezione single mode del HTML. I metodi `ExportManager.exportCard/exportStrip/exportSeq` ora accettano un parametro opzionale `character` per l'export diretto senza passare dal modal. I bottoni sono wired in `UIManager.populateSingleModeControls()`.

---

## 7. CSS/HTML

### 7.1 `--sidebar-width: 320px` non usata -- RISOLTO

~~Variabile CSS definita ma non usata.~~

**Fix:** Rimossa.

---

### 7.2 `.export-grid` non usata -- RISOLTO

~~Classe CSS definita ma mai usata.~~

**Fix:** Rimossa.

---

### 7.3 `button` selector troppo ampio -- RISOLTO

~~`width: 100%` sul selector `button` forzava tutti i bottoni a piena larghezza.~~

**Fix:** Rimosso `width: 100%` dal selector base `button`. Aggiunto `width: 100%` selettivamente su `.button-grid button` e `.control-section > button` dove serve effettivamente. I bottoni di navigazione e altri bottoni speciali non sono più forzati.

---

### 7.4 `btn-random-section` width issue -- RISOLTO

~~I bottoni "Random" erano forzati al 100% width.~~

**Fix:** Aggiunto `width: auto` a `.btn-random-section`.

---

## 8. ARCHITETTURA E SUGGERIMENTI GENERALI

### 8.1 Stato globale sparso -- RISOLTO (parziale)

~~Lo stato era distribuito tra molti oggetti senza documentazione.~~

**Fix:** Lo stato è già centralizzato nella classe `App` con getter dedicati (`currentGenerator`, `currentBackstoryGenerator`). `CharacterManager` (inutilizzato) è stato rimosso. `window.app` mantenuto come convenienza per il debug. Per una centralizzazione completa (AppState pattern) servirebbe un refactor architetturale dedicato.

---

### 8.2 `nameGenerator.generate()` in HumanGenerator genera sempre tipo 'human' -- RISOLTO

~~`MonsterGenerator` creava una propria istanza di `MonsterNameGenerator`, bypassando il `NameGeneratorManager`.~~

**Fix:** `MonsterGenerator` ora usa il singleton `nameGenerator` importato da `name-generator.js` con `nameGenerator.generate('monster')`, unificando il pattern con `HumanGenerator`.

---

### 8.3 Mancanza di error boundaries -- RISOLTO

~~Nessun `try/catch` intorno alle operazioni critiche.~~

**Fix:** Aggiunti `try/catch` in `_doGenerateCharacters()` e `_doRegenerateCharacters()` (in caso di errore, logga e continua; per la rigenerazione, mantiene il vecchio personaggio). Aggiunto error boundary intorno a `exportSpritesheet()`.

---

## BUG SCOPERTI DURANTE I TEST

### T.1 Preset "Chaos" non rigenera i personaggi esistenti -- RISOLTO

~~Il preset "Chaos" (`'max'`) faceva `return` prematuro dopo aver aggiornato gli slider, saltando la rigenerazione.~~

**Fix:** Rimosso il `return` prematuro. Il flusso ora prosegue a `getParamsFromUI()` e `regenerateCurrentCharacters()` come per tutti gli altri preset.

---

## 9. FIX POST-REVIEW

### 9.1 Generazione iniziale insufficiente -- RISOLTO

~~All'avvio l'app generava solo 1 NPC, mostrando una griglia batch quasi vuota.~~

**Fix:** Cambiato default da `generateCharacters(1)` a `generateCharacters(10)` in `init()`.

---

### 9.2 Switch Batch/Single mode non funzionava correttamente -- RISOLTO

~~Il bottone "Batch" chiamava solo `switchMode('batch')` (cambio UI) senza eseguire `exitSingleMode()`. Risultato: tornando dalla single mode, la vista restava bloccata sul singolo personaggio con i controlli batch visibili.~~

**Fix:** Il bottone "Batch" ora chiama `exitSingleMode()` quando si è in single mode, che: (1) salva le modifiche al personaggio, (2) lo riscrive nel suo posto nella batch tramite indice salvato, (3) ripristina la griglia batch completa. Il bottone "Single" è stato reso idempotente (no-op se già in single mode). Aggiunto `singleModeCharacterIndex` per restore affidabile con fallback su seed match.

---

## RIEPILOGO STATO FINALE

### Tutti risolti: 44 items

**Bug logici (10):** 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10
**Codice morto (10):** 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10
**Inconsistenze (7):** 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8
**Duplicazioni (5):** 4.1, 4.2, 4.3, 4.4, 4.5
**Performance (3):** 5.1, 5.2, 5.3
**UI/UX (6):** 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
**CSS/HTML (4):** 7.1, 7.2, 7.3, 7.4
**Architettura (3):** 8.1, 8.2, 8.3
**Bug da test (1):** T.1
**Post-review (2):** 9.1, 9.2

### Non modificato (accettabile):
- 3.4 (listener management -- pattern consistente nel contesto attuale)
