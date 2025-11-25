// === MONSTER BACKSTORY GENERATOR - DATASET ===
// Version: 2.0 (Expanded & Fixed)
// 
// GUIDELINES:
// - Azioni e oggetti CONCRETI
// - Descrizioni specifiche, non vaghe
// - Usare {a|b|c} per varianti interne
// - Tono dark fantasy / horror
// - No meta-narrazione

export const monsterBackstoryData = {

    // =============================================
    // PLACES (~40 entries)
    // Luoghi oscuri, mostruosi, dimenticati
    // Alcuni mantengono articoli perché funzionano meglio (es. "la Fossa")
    // =============================================
    places: [
        // Sotterranei e abissi
        "la Fossa dei Dannati", "l'Abisso Nero", "le Caverne Urlanti", "il Pozzo Senza Fondo",
        "le Miniere Maledette", "la Cripta Dimenticata", "il Sottosuolo di Karnath",
        "le Catacombe Infinite", "il Labirinto di Carne", "la Gola delle Ossa",

        // Luoghi naturali corrotti
        "la Palude Silente", "la Foresta delle Ombre", "il Deserto di Cenere",
        "il Lago di Sangue", "la Tundra Urlante", "la Giungla Velenosa",
        "le Montagne Nere", "la Valle dei Vermi", "il Bosco Morto",

        // Rovine e luoghi artificiali
        "le Rovine di Xar", "la Torre dello Stregone", "il Laboratorio di Morken",
        "il Tempio Sconsacrato", "la Città Sommersa", "il Forte Abbandonato",
        "le Fonderie Oscure", "la Biblioteca Proibita", "il Castello Caduto",

        // Luoghi extraplanari e innaturali
        "la Dimensione del Caos", "il Piano delle Ombre", "il Vuoto tra i Mondi",
        "la Ferita nel Cielo", "il Punto Cieco", "la Cicatrice Dimensionale",

        // Luoghi specifici
        "il Cimitero dei Draghi", "l'Isola dei Morti", "il Vulcano Dormiente",
        "la Fogna della Capitale", "il Cratere dell'Impatto", "la Nave Fantasma",
        "il Pozzo dei Desideri", "la Caverna di Cristallo Nero"
    ],

    placeDescriptors: [
        "le profondità", "le ombre", "i vapori tossici", "le rovine",
        "i tunnel", "le acque scure", "i fuochi fatui", "le ossa",
        "i cristalli pulsanti", "le macchine antiche", "i rituali",
        "le urla", "il silenzio", "il buio", "le fiamme verdi",
        "i cadaveri", "le catene arrugginite", "le rune incise",
        "il sangue secco", "le radici contorte"
    ],

    // =============================================
    // ORIGIN PHRASES (~30 entries)
    // Come è nato/creato/evocato il mostro
    // =============================================
    originPhrases: [
        // Evocazione e creazione magica
        (name, place) => `${name} è stato evocato {da uno stregone|durante un rituale|per errore|da una setta} a ${place}`,
        (name, place) => `${name} è stato creato in un laboratorio a ${place} {come arma|per vendetta|per curiosità|in un esperimento fallito}`,
        (name, place) => `${name} è il risultato di {un incantesimo|un esperimento|un patto|una fusione} andato {terribilmente|orribilmente|catastroficamente} male a ${place}`,
        (name, place) => `Le energie di ${place} hanno {corrotto|mutato|risvegliato|fuso} {un animale|un uomo|una bestia|qualcosa} creando ${name}`,
        (name, place) => `${name} è nato da {una maledizione|un rituale di sangue|un portale aperto|un sacrificio} a ${place}`,

        // Risveglio e emersione
        (name, place) => `${name} è emerso da ${place} {dopo secoli|durante un'eclissi|quando i sigilli si spezzarono|affamato}`,
        (name, place) => `${name} si è risvegliato a ${place} dopo {millenni|un lungo sonno|la fine della guerra|che tutti lo dimenticarono}`,
        (name, place) => `${name} è salito dalle profondità di ${place} {seguendo l'odore del sangue|attrato da voci|chiamato da sogni|per fame}`,
        (name, place) => `${name} è stato liberato da ${place} quando {un avventuriero|un terremoto|una tempesta|la curiosità} aprì {la porta|il sigillo|la gabbia|la tomba}`,

        // Trasformazione
        (name, place) => `Una maledizione a ${place} ha trasformato {un re|un mago|un guerriero|una famiglia intera} in ${name}`,
        (name, place) => `${name} era {un uomo|una donna|un bambino|un sacerdote} prima che ${place} lo {consumasse|mutasse|corrompesse|spezzasse}`,
        (name, place) => `${name} è ciò che resta di {un eroe|un drago|un angelo|una città} dopo che ${place} lo ha {digerito|assorbito|trasformato}`,

        // Origine extraplanare
        (name, place) => `${name} è caduto {dalle stelle|dal cielo|da un altro mondo|da una dimensione morente} atterrando a ${place}`,
        (name, place) => `${name} è penetrato nella realtà attraverso ${place} quando {i piani si allinearono|qualcuno aprì un portale|la barriera si indebolì}`,
        (name, place) => `${name} è stato {esiliato|bandito|espulso|lanciato} dal suo mondo e imprigionato a ${place}`,

        // Sopravvivenza e ultima creatura
        (name, place) => `${name} è l'ultimo {sopravvissuto|guardiano|custode|abitante} di ${place} {dimenticato da tutti|ancora fedele|che ricorda}`,
        (name, place) => `${name} è ciò che rimane dopo che ${place} è {caduto|bruciato|sprofondato|stato divorato}`,

        // Nascita mostruosa
        (name, place) => `${name} è nato nelle profondità di ${place} {da un uovo nero|da una pozza di sangue|dalle viscere della terra|da un'esplosione magica}`,
        (name, place) => `${name} è cresciuto a ${place} {nutrendosi di|divorando|assorbendo} {cadaveri|energia oscura|magia residua|paura}`,
        (name, place) => `${name} si è formato a ${place} quando {troppo sangue|troppe anime|troppa magia|troppo dolore} si accumularono`,

        // Costruzione e assemblaggio
        (name, place) => `${name} è stato {assemblato|cucito|forgiato|scolpito} da {parti di cadaveri|ossa di drago|metallo vivente|ombre solidificate} a ${place}`,
        (name, place) => `${name} è stato costruito a ${place} come {sentinella|punizione|esperimento|opera d'arte} da {qualcuno|qualcosa} dimenticato`,

        // Fuga e distruzione
        (name, place) => `${name} è fuggito da ${place} {distruggendo tutto|uccidendo i suoi creatori|bruciando le celle|spezzando le catene}`,
        (name, place) => `${name} è stato rilasciato da ${place} come {ultima risorsa|arma finale|punizione|vendetta} contro {gli invasori|il mondo|se stessi}`,

        // Possessione
        (name, place) => `${name} è {un demone|uno spirito|un'entità|un parassita} che ha posseduto {una statua|un cadavere|un animale|una reliquia} a ${place}`,
        (name, place) => `Qualcosa a ${place} ha preso controllo di {una bestia|un golem|un guardiano|un corpo} creando ${name}`,

        // Duplicazione e frammentazione
        (name, place) => `${name} è un frammento di {qualcosa di più grande|un dio morto|una creatura antica|un incubo collettivo} che si è staccato a ${place}`,
        (name, place) => `${name} è una copia {difettosa|impazzita|mutata|evoluta} di qualcosa creato a ${place} {molto tempo fa|come scherzo crudele|per sbaglio}`,
    ],

    // =============================================
    // FORMATION PHRASES (~30 entries)
    // Eventi che hanno formato/trasformato il mostro
    // Cose SPECIFICHE che sono successe
    // =============================================
    formationPhrases: [
        // Violenza e cannibalismo
        "ha divorato {il suo creatore|un intero villaggio|i propri simili|centotre anime|un esercito} {per fame insaziabile|in un accesso di rabbia|mentre dormivano|lentamente}",
        "ha massacrato {una carovana|una famiglia reale|un tempio intero|chi lo amava} con {le zanne|artigli|magia grezza|un sorriso}",
        "ha strappato {il cuore|gli occhi|le ali|la voce} a {un angelo|un demone|il proprio maestro|chi lo aveva creato}",
        "ha bevuto {il sangue|le lacrime|la linfa vitale|l'essenza} di {mille vittime|un drago|un dio minore|un vulcano}",

        // Modifiche e torture
        "è stato {torturato|modificato|potenziato|viviseizionato} per {anni|decadi|secoli} da {stregoni pazzi|cultisti|una mente alveare|se stesso}",
        "è stato infuso con {sangue di drago|veleno puro|energia del Vuoto|anime in pena|cristalli viventi} fino a {esplodere|mutare|trascendere|implodere}",
        "ha subito {diciassette rituali|cento trapianti|innumerevoli incantesimi|fusione con metallo} che lo hanno {spezzato|riforgiato|illuminato|distrutto e ricostruito}",
        "è stato cucito insieme usando {cadaveri freschi|parti di bestie|frammenti dimensionali|ombre materializzate}",

        // Perdite e trasformazioni mentali
        "ha perso {la ragione|la sua forma originale|il controllo sul corpo|tutti i ricordi|il senso del sé} a causa di {un rituale incompiuto|una maledizione ereditaria|troppo dolore|l'isolamento eterno}",
        "ha dimenticato {il proprio nome|come morire|la forma originale|perché esiste} dopo {troppi secoli|aver visto l'abisso|essere morto tre volte}",
        "è impazzito quando ha visto {la verità|l'infinito|morire tutti|il proprio riflesso|cosa si nasconde oltre}",

        // Assorbimento e accumulo
        "ha assorbito {anime in pena|energia negativa|sogni incubi|radiazioni magiche|la vita stessa} fino a {non poter più fermarsi|diventare ciò che è ora|perdere la forma|brillare di oscurità}",
        "ha incorporato {parti di ogni vittima|frammenti di realtà|paure altrui|echi di battaglie} nel proprio corpo",
        "ha mangiato {un libro di incantesimi|un artefatto maledetto|il cuore di un lich|testi proibiti|ceneri di santi} e ne è stato {cambiato|illuminato|corrotto|potenziato}",

        // Prigionia
        "è stato incatenato per {tre secoli|millenni|ere perdute|il tempo necessario} in {una prigione dimensionale|ghiaccio eterno|una runa vivente|un incubo senza fine}",
        "è stato sepolto vivo sotto {una montagna|mille tonnellate di sale|sigilli divini|le fondamenta di una città} finché {le catene si arrugginirono|lo dimenticarono|trovò la forza|qualcuno lo liberò}",
        "è rimasto immobile per {secoli|eoni|oltre il tempo} aspettando {il momento giusto|che i sigilli cedessero|vendetta|qualcosa che non arriverà mai}",

        // Combattimenti
        "ha combattuto contro {un'intera legione|sette eroi|un dio minore|se stesso in un'altra dimensione} e {ha vinto|ha perso metà del corpo|ha guadagnato cicatrici che brillano|ne porta ancora i segni}",
        "ha ucciso {il proprio creatore|chi lo amava|il guardiano|l'ultimo ostacolo} con {un solo colpo|lentezza metodica|gioia evidente|rimpianto}",
        "si è nutrito dei {cuori|ricordi|ossa|nomi} dei {caduti|dimenticati|dannati} in {una battaglia|un massacro|un rituale} che durò {tre giorni|un anno|un'eternità}",

        // Esperienze cosmiche
        "ha visto {la fine del mondo|nascere le stelle|morire gli dei|l'abisso tra gli atomi|cose che non hanno nome} e {ha riso|ha pianto sangue|è impazzito|è diventato silenzioso}",
        "ha toccato {il confine della realtà|un dio addormentato|la fonte della magia|il cuore del Vuoto} ed è tornato {cambiato|spezzato|illuminato|vuoto}",
        "ha ascoltato {la voce della creazione|il canto dell'entropia|sussurri dall'oltre|la propria morte futura} e {non può più dormire|ha risposto|continua a ridere|ripete le parole}",

        // Esperimenti falliti
        "è stato il {primo|ultimo|unico riuscito|centesimo tentativo} di {creare vita|raggiungere l'immortalità|superare i limiti|aprire un portale}",
        "è il risultato di {un esperimento dimenticato|una guerra magica|un amore proibito|ambizione senza limiti} che {nessuno voleva|nessuno poteva fermare|ha distrutto chi l'ha iniziato}",

        // Fusioni e assimilazioni
        "è stato fuso con {una bestia|una macchina|un elementale|qualcosa dall'esterno} durante {un rituale|un incidente|una battaglia|l'apocalisse}",
        "ha assimilato {i propri fratelli|la propria specie|i guardiani|le vittime} fino a {diventare uno sciame|perdere l'individualità|essere ovunque}",

        // Punizioni e maledizioni
        "è stato maledetto da {un dio vendicativo|chi ha tradito|l'ultima vittima|se stesso} a {non poter mai morire|non provare altro che dolore|ricordare tutto|esistere in questo modo}",
        "porta il peso di {mille anime|un peccato imperdonabile|una profezia spezzata|una promessa infranta} che lo {consuma|trasforma|guida|tormenta}",
    ],

    // =============================================
    // SKILL PHRASES (~35 entries)
    // Cosa SA FARE il mostro - abilità CONCRETE
    // =============================================
    skillPhrases: [
        // Attacchi elementali
        "sputa {acido nero|fiamme blu|ghiaccio bollente|vapori necrotici|fulmini} che {sciolgono la pietra|bruciano l'anima|congelano il tempo|divorano la luce}",
        "emana {freddo mortale|calore infernale|radiazioni|un'aura di disperazione} che {uccide le piante|fa evaporare il sangue|corrompe la carne|spegne le fiamme}",
        "respira {nebbia tossica|spore paralizzanti|nuvole di insetti|aria così pura da bruciare} su {chiunque gli si avvicini|chi osa guardarlo|il campo di battaglia}",

        // Movimento e furtività  
        "si muove {nell'ombra|attraverso i muri|più veloce del suono|senza toccare terra|tra i riflessi} per {colpire alla schiena|fuggire|seguire|confondere}",
        "può {scavare|nuotare|volare|planare|teletrasportarsi} attraverso {roccia solida|lava|il vuoto|le dimensioni} come se fosse {aria|acqua|niente}",
        "sparisce {quando lo guardi direttamente|nella nebbia|dietro un angolo|tra un battito di ciglia} e riappare {alle tue spalle|dove meno te lo aspetti|nei tuoi incubi}",
        "caccia {in assoluto silenzio|emettendo ultrasuoni|seguendo l'odore della paura|sentendo i battiti cardiaci} da {chilometri|attraverso i muri|nel buio totale}",

        // Manipolazione mentale
        "può {leggere le menti|controllare i sogni|piegare la volontà|rubare i ricordi|inserire pensieri} di {chiunque lo guardi|chi è solo|le sue prede|vittime dormienti}",
        "sussurra {promesse|verità|bugie|segreti} direttamente nella mente fino a {spezzare la ragione|ottenere obbedienza|far impazzire|convincere}",
        "mostra {visioni|incubi|desideri|il futuro|il passato dimenticato} a chi {lo tocca|sente la sua voce|entra nel suo territorio}",

        // Rigenerazione e adattamento
        "rigenera {le ferite|gli arti perduti|la pelle|organi|persino la testa} in {secondi|un batter d'occhio|modo innaturale e doloroso da vedere}",
        "non può essere ucciso da {armi normali|fuoco|annegamento|decapitazione|nulla che è stato tentato finora}",
        "si adatta {all'ambiente|alle armi usate contro di lui|al dolore|alla magia} diventando {immune|più forte|più veloce|resistente}",
        "guarisce nutrendosi di {carne viva|paura|dolore altrui|luce lunare|sangue versato}",

        // Suoni e vibrazioni
        "emette {un urlo|un ronzio|una nota grave|un silenzio assoluto} che {paralizza|uccide|confonde|spezza il vetro|ferma i cuori} chiunque sia entro {cento passi|portata d'udito|la valle}",
        "il suo {battito cardiaco|respiro|movimento|esistenza stessa} produce vibrazioni che {fanno tremare la terra|rompono le ossa|disintegrano la pietra}",
        "canta con {mille voci|voci di morti|una melodia ipnotica|frequenze impossibili} che {attira|uccide|addormenta|fa impazzire}",

        // Metamorfosi
        "cambia {forma|colore|dimensione|consistenza|numero di arti} per {ingannare|nascondersi|adattarsi|terrorizzare|sopravvivere}",
        "può apparire come {chiunque abbia divorato|i desideri della vittima|la persona più amata|l'incubo peggiore}",
        "muta {la propria carne|le ossa|gli organi interni} in {armi|armatura|ali|tentacoli} a volontà",

        // Controllo e comando
        "comanda {i morti|gli insetti|le ombre|le bestie|i parassiti} con {un gesto|il pensiero|un fischio|la volontà|l'odore}",
        "controlla {cadaveri|marionette di carne|ombre viventi|sciami} come estensioni del proprio corpo",
        "risveglia {morti sepolti|spiriti dormienti|antichi guardiani|orrori dimenticati} ovunque passi",

        // Veleni e malattie
        "il suo {morso|tocco|sangue|respiro|sguardo} inietta {veleno necrotico|paralisi permanente|allucinazioni|una malattia senza cura}",
        "produce {tossine|acidi|spore|uova parassite} che {divorano dall'interno|si riproducono|trasformano|diffondono il contagio}",
        "porta {una pestilenza|una malattia dimenticata|un morbo magico|la decomposizione accelerata} ovunque vada",

        // Manipolazione fisica
        "afferra le vittime con {tentacoli|catene viventi|radici|ombre solide|appendici innumerevoli}",
        "stritola {ossa|armature|muri|tutto} con {una forza terribile|fauci|anelli del corpo|una stretta}",
        "può {assorbire|incorporare|fondere|divorare} {carne|metallo|magia|anime} nel proprio corpo",

        // Sensi sovrannaturali
        "vede {nel buio assoluto|attraverso le illusioni|il futuro immediato|la paura|l'aura vitale}",
        "sente {ogni battito cardiaco|bugie|magia|anime|movimenti} entro {la sua tana|chilometri|il suo territorio}",
        "percepisce {la vita|la morte imminente|il sangue versato|la magia usata|intenzioni ostili} come {un odore|un sapore|vibrazioni|dolore}",
    ],

    // =============================================
    // REPUTATION SOURCES (~15 entries)
    // =============================================
    reputationSources: [
        "Le leggende narrano che",
        "I contadini sussurrano che",
        "Gli antichi testi avvertono che",
        "I sopravvissuti giurano che",
        "Si teme che",
        "C'è chi dice che",
        "Nelle taverne si racconta che",
        "I saggi hanno scritto che",
        "Le madri spaventano i figli dicendo che",
        "I cacciatori sostengono che",
        "Gli sciamani avvertono che",
        "Chi l'ha visto giura che",
        "I folli profetizzano che",
        "Le visioni mostrano che",
        "Antiche profezie dicono che",
    ],

    // =============================================
    // REPUTATION CLAIMS (~30 entries)
    // Cosa si dice del mostro - specifico e memorabile
    // =============================================
    reputationClaims: [
        // Immortalità e invulnerabilità
        "sia {immortale|invulnerabile|un dio caduto|più antico della morte stessa}",
        "non possa essere ucciso da {armi mortali|fuoco|acciaio benedetto|nulla che sia stato provato}",
        "ritorni sempre {più forte|più grande|più affamato|cambiato} ogni volta che viene ucciso",

        // Scopi e desideri
        "cerchi {un modo per morire|il suo cuore perduto|vendetta contro gli dei|di spegnere il sole|colei che lo ha creato}",
        "stia raccogliendo {anime|ossa|nomi|ricordi|parti di sé stesso} per {un rituale|completarsi|ricostruire qualcosa|un esercito}",
        "aspetti {un'eclissi|l'allineamento|il risveglio di qualcosa|la fine del mondo|il momento giusto}",

        // Distruzione passata
        "abbia distrutto {sette regni|un'intera civiltà|l'antica luna|i propri creatori|la sua stessa specie}",
        "sia la causa di {una piaga dimenticata|la caduta di Xarenth|il Grande Incendio|l'Inverno Eterno}",
        "abbia divorato {un dio minore|mille eroi|un'intera foresta|un vulcano|i sogni di un regno}",

        // Segreti nascosti
        "nasconda {un tesoro maledetto|il suo unico punto debole|una porta per l'inferno|l'anima del mondo|sette nomi veri} {nel suo corpo|nella sua tana|in un'altra dimensione}",
        "custodisca {un uovo antico|una chiave dimensionale|l'ultimo seme|un frammento di dio} che {tutti cercano|nessuno deve trovare|darà potere assoluto}",
        "sia fatto di {anime compresse|materia stellare|carne di draghi|ombre solidificate|dolore puro}",

        // Debolezze specifiche
        "possa essere ucciso solo da {una lama forgiata nel suo sangue|un bacio sincero|chi non ha paura|una lacrima d'innocente|qualcuno che ami}",
        "tema {l'argento benedetto|la luce del sole|il proprio nome pronunciato|specchi|acqua corrente|il silenzio}",
        "sia vulnerabile durante {la luna nuova|quando dorme|se separato dal|quando piange}",

        // Profezie e destino
        "sia l'araldo di {una nuova era|la fine dei tempi|un dio oscuro|una pestilenza cosmica|il ritorno degli antichi}",
        "sia {nato|cresciuto|creato|destinato} per {distruggere il mondo|giudicare l'umanità|aprire un portale|risvegliare qualcosa}",
        "adempia {una profezia|una maledizione antica|un patto dimenticato|il volere di qualcosa oltre}",

        // Caratteristiche uniche
        "pianga {sangue nero|acido|diamanti liquidi|fiamme fredde|luce} quando {uccide|dorme|guarda la luna|si nutre|è solo}",
        "non abbia {ombra|riflesso|odore|suono dei passi|battito cardiaco}",
        "sia in realtà {molte creature|un alveare|frammenti di un dio|l'incubo di qualcuno|un paradosso vivente}",

        // Relazioni e origini
        "un tempo fosse {umano|un angelo|un eroe leggendario|il re di Karnath|amato da tutti}",
        "sia {il figlio|la creazione|la vendetta|il rimpianto} di {un dio impazzito|uno stregone pentito|qualcosa dimenticato}",
        "abbia {divorato|assorbito|sostituito|fuso con} {il precedente guardiano|i suoi creatori|tutto ciò che era}",

        // Numeri e dettagli specifici
        "abbia {mille occhi|sette cuori|diciannove bocche|ali senza piume|troppi arti per contarli}",
        "sia lungo {trenta metri|quanto tre case|abbastanza da circondare il villaggio} e largo {il doppio|metà}",
        "esista {in tre luoghi contemporaneamente|tra le dimensioni|fuori dal tempo|solo quando osservato}",
    ],

    // =============================================
    // CURRENT STATES (~25 entries)
    // Cosa fa ADESSO il mostro - azioni concrete
    // =============================================
    currentStates: [
        // Attesa e sonno
        "ora {dorme|attende|si nasconde|si prepara} {nelle profondità|sotto la montagna|in una dimensione parallela} aspettando {il risveglio|il momento giusto|che i sigilli cedano|qualcuno abbastanza coraggioso}",
        "riposa in {un bozzolo di carne|un sarcofago di ghiaccio|una pozza di sangue|una cripta sigillata} {rigenerandosi|sognando vendetta|accumulando forza}",
        "attende {immobile|nascosto|mimetizzato} che {una preda passi|qualcuno apra la porta|arrivi il suo padrone|finisca il rituale}",

        // Vagabondaggio
        "vaga per {le terre desolate|il mondo sotterraneo|i sogni|le rovine dimenticate} cercando {cibo|pace impossibile|una fine|chi lo ha creato|compagnia}",
        "attraversa {villaggi|foreste|montagne|dimensioni} lasciando {solo morte|una scia di follia|terre bruciate|silenzio innaturale}",
        "segue {l'odore del sangue|voci che solo lui sente|un istinto antico|il richiamo di qualcosa|memorie frammentate}",

        // Costruzione e accumulo
        "costruisce {un nido di ossa|un trono di cadaveri|un tempio oscuro|una torre vivente} usando {le sue vittime|pietre maledette|ombre solidificate}",
        "accumula {tesori rubati|artefatti magici|parti di corpi|anime in bottiglie|oggetti specifici} per {un motivo dimenticato|compagnia|un rituale|fame da collezionista}",
        "modifica {il proprio corpo|la sua tana|l'ambiente circostante|le sue vittime} {costantemente|lentamente|dolorosamente|artisticamente}",

        // Protezione
        "protegge {un uovo pulsante|un portale chiuso|un fiore di cristallo|l'ultimo ricordo} {fino alla morte|con ferocia|da chiunque si avvicini|senza sapere perché}",
        "custodisce {una tomba|una reliquia|un segreto|un luogo} che {nessuno deve trovare|tutti cercano|non ricorda più perché}",
        "difende {il suo territorio|la tana|i suoi piccoli|qualcosa sepolto} con {brutale efficienza|violenza estrema|astuzia crudele}",

        // Caccia
        "caccia {ogni notte|durante le tempeste|quando la luna è piena|senza sosta} {per fame insaziabile|per istinto|per sport crudele|per necessità}",
        "si nutre di {paura|carne viva|sangue giovane|magia residua|anime fresche|sogni} ogni {notte|luna|settimana}",
        "uccide {tutto ciò che respira|solo chi lo disturba|metodicamente|seguendo un pattern}",

        // Ricerca e desiderio
        "cerca disperatamente {di ricordare chi era|di tornare umano|un modo per morire|il proprio creatore} ma {non può fermarsi|continua a uccidere|sta perdendo la forma}",
        "tenta di {comunicare|capire|ricostruire|imitare} {l'umanità|la propria origine|cosa ha perso} ma {esce solo orrore|spaventa|non riesce}",
        "vuole {trovare un simile|non essere solo|essere compreso|tornare a dormire} ma {è l'ultimo|nessuno sopravvive abbastanza|tutti fuggono}",

        // Servizio e controllo
        "serve {un padrone oscuro|un istinto cieco|una profezia antica|il Vuoto} {fedelmente|senza domande|contro la propria volontà}",
        "obbedisce a {comandi dimenticati|una programmazione spezzata|voci nella sua testa|un patto antico} che {non può ignorare|lo tormenta|lo distrugge lentamente}",

        // Riproduzione e diffusione
        "sta {deponendo uova|creando copie|infettando|trasformando} {tutto ciò che tocca|le sue vittime|l'ambiente|lentamente il mondo}",
        "si sta {moltiplicando|dividendo|evolvendo|diffondendo} in {modi innaturali|segreto|sotto terra|attraverso i sogni}",

        // Declino e agonia
        "sta {morendo lentamente|perdendo la forma|decomponendosi|tornando nel nulla} ma {non riesce a finire|continua a vivere|si rifiuta di cedere}",
        "soffre {costantemente|senza fine|in modi incomprensibili} e {vuole solo finire|cerca vendetta|porta tutti con sé|non sa cosa fare}",
    ],

    // =============================================
    // CURRENT CONNECTORS (~12 entries)
    // =============================================
    currentConnectors: [
        "Adesso", "Ora", "Oggi", "In questo momento", "Da allora",
        "Nelle notti senza luna", "Quando il vento urla", "Nel buio",
        "Sotto la montagna", "Oltre il confine", "Nei sotterranei",
        "Durante le tempeste"
    ]
};

export const poolNames = {
    PLACES: 'places',
    ORIGINS: 'originPhrases',
    FORMATIONS: 'formationPhrases',
    SKILLS: 'skillPhrases',
    REP_SOURCES: 'reputationSources',
    REP_CLAIMS: 'reputationClaims',
    CURRENTS: 'currentStates'
};

export default monsterBackstoryData;