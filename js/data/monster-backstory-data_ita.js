// === MONSTER BACKSTORY GENERATOR - DATASET ===
// Version: 3.0 (Expanded, Grammar-Fixed, Preposition-Safe)
//
// GUIDELINES:
// - Azioni e oggetti CONCRETI
// - Descrizioni specifiche, non vaghe
// - Usare {a|b|c} per varianti interne
// - Tono dark fantasy / horror
// - No meta-narrazione
//
// PREPOSITION NOTE:
// I nomi dei luoghi hanno articoli (la Fossa, l'Abisso, il Pozzo...).
// Le origin phrases usano "presso", "dentro", "nelle profondità di", "attraverso"
// per evitare scontri preposizione+articolo (es. "a la Fossa" → SBAGLIATO).

export const monsterBackstoryData = {

    // =============================================
    // PLACES (~90 entries)
    // Luoghi oscuri, mostruosi, dimenticati
    // Tutti con articolo per coerenza horror
    // =============================================
    places: [
        // Sotterranei e abissi
        "la Fossa dei Dannati", "l'Abisso Nero", "le Caverne Urlanti", "il Pozzo Senza Fondo",
        "le Miniere Maledette", "la Cripta Dimenticata", "il Sottosuolo di Karnath",
        "le Catacombe Infinite", "il Labirinto di Carne", "la Gola delle Ossa",
        "il Baratro Sussurrante", "la Voragine di Vetro", "le Grotte dei Lamenti",
        "il Tunnel degli Echi", "la Fossa Comune di Aldrath", "le Gallerie Putride",
        "il Pozzo della Follia", "la Tomba dei Senzanome", "le Cisterne di Sangue",
        "il Cunicolo delle Radici Morte",

        // Luoghi naturali corrotti
        "la Palude Silente", "la Foresta delle Ombre", "il Deserto di Cenere",
        "il Lago di Sangue", "la Tundra Urlante", "la Giungla Velenosa",
        "le Montagne Nere", "la Valle dei Vermi", "il Bosco Morto",
        "la Steppa dei Teschi", "il Ghiacciaio Vivente", "la Brughiera delle Spore",
        "il Pantano Fosforescente", "la Savana delle Ceneri", "le Dune Striscianti",
        "il Fiume di Pece", "la Selva Carnivora", "il Canyon delle Urla",
        "la Landa Sbiancata", "il Passo dei Corvi Morti",

        // Rovine e luoghi artificiali
        "le Rovine di Xar", "la Torre dello Stregone", "il Laboratorio di Morken",
        "il Tempio Sconsacrato", "la Città Sommersa", "il Forte Abbandonato",
        "le Fonderie Oscure", "la Biblioteca Proibita", "il Castello Caduto",
        "l'Arena dei Sacrifici", "la Prigione Eterna", "il Santuario Invertito",
        "le Forge di Osso", "la Cattedrale Sepolta", "il Mausoleo Errante",
        "l'Osservatorio Cieco", "la Fortezza di Vetro Nero", "il Mattatoio di Ghrendal",
        "le Cisterne Imperiali", "la Diga Spezzata",

        // Luoghi extraplanari e innaturali
        "la Dimensione del Caos", "il Piano delle Ombre", "il Vuoto tra i Mondi",
        "la Ferita nel Cielo", "il Punto Cieco", "la Cicatrice Dimensionale",
        "il Riflesso Storto", "la Soglia del Non-Essere", "il Corridoio Infinito",
        "la Tasca Temporale", "il Nodo Planare", "la Piega nella Realtà",
        "il Limbo dei Noncreati", "la Bolla di Silenzio Eterno",

        // Luoghi specifici
        "il Cimitero dei Draghi", "l'Isola dei Morti", "il Vulcano Dormiente",
        "la Fogna della Capitale", "il Cratere dell'Impatto", "la Nave Fantasma",
        "il Pozzo dei Desideri", "la Caverna di Cristallo Nero",
        "il Relitto della Nave Regale", "la Miniera di Sale Rosso",
        "il Faro Spento di Calthera", "il Mercato Sotterraneo dei Reietti"
    ],

    placeDescriptors: [
        "le profondità", "le ombre", "i vapori tossici", "le rovine",
        "i tunnel", "le acque scure", "i fuochi fatui", "le ossa",
        "i cristalli pulsanti", "le macchine antiche", "i rituali",
        "le urla", "il silenzio", "il buio", "le fiamme verdi",
        "i cadaveri", "le catene arrugginite", "le rune incise",
        "il sangue secco", "le radici contorte",
        "le spore luminose", "i muri che respirano", "la nebbia acida",
        "le stalattiti di carne", "il pavimento di ossa", "i sussurri costanti",
        "le pozze nere", "i simboli graffiati", "la muffa vivente",
        "le correnti gelide", "i riflessi sbagliati", "le ragnatele di acciaio",
        "il fango ribollente", "i frammenti di specchi", "le incisioni sanguinanti",
        "le statue piangenti", "i funghi che pulsano", "la luce malata",
        "le pareti umide", "il terreno che si muove", "le eco deformate",
        "i condotti arrugginiti"
    ],

    // =============================================
    // ORIGIN PHRASES (~60 entries)
    // Come è nato/creato/evocato il mostro
    // NOTA: usano "presso", "dentro", "nelle profondità di", "attraverso"
    // per evitare scontri preposizione+articolo con i nomi dei luoghi
    // =============================================
    originPhrases: [
        // Evocazione e creazione magica
        (name, place) => `${name} è stato evocato {da uno stregone|durante un rituale|per errore|da una setta} presso ${place}`,
        (name, place) => `${name} è stato creato in un laboratorio dentro ${place} {come arma|per vendetta|per curiosità|in un esperimento fallito}`,
        (name, place) => `${name} è il risultato di {un incantesimo|un esperimento|un patto|una fusione} andato {terribilmente|orribilmente|catastroficamente} male presso ${place}`,
        (name, place) => `Le energie che permeano ${place} hanno {corrotto|mutato|risvegliato|fuso} {un animale|un uomo|una bestia|qualcosa} creando ${name}`,
        (name, place) => `${name} è nato da {una maledizione|un rituale di sangue|un portale aperto|un sacrificio} presso ${place}`,
        (name, place) => `${name} è stato plasmato {dalla magia selvaggia|dalla disperazione|dalla rabbia} che permeava ${place}`,
        (name, place) => `${name} è stato invocato dentro ${place} {con sangue di vergine|sacrificando tredici anime|usando un tomo proibito|per ordine del re folle}`,
        (name, place) => `${name} è stato concepito quando un rituale presso ${place} {attirò qualcosa dall'esterno|spezzò la barriera|aprì un varco|sovraccaricò i sigilli}`,

        // Risveglio e emersione
        (name, place) => `${name} è emerso dalle profondità sotto ${place} {dopo secoli|durante un'eclissi|quando i sigilli si spezzarono|affamato}`,
        (name, place) => `${name} si è risvegliato dentro ${place} dopo {millenni|un lungo sonno|la fine della guerra|che tutti lo dimenticarono}`,
        (name, place) => `${name} è salito dalle profondità sotto ${place} {seguendo l'odore del sangue|attratto da voci|chiamato da sogni|per fame}`,
        (name, place) => `${name} è stato liberato quando {un avventuriero|un terremoto|una tempesta|la curiosità} aprì {la porta|il sigillo|la gabbia|la tomba} dentro ${place}`,
        (name, place) => `${name} ha sfondato le pareti dentro ${place} {in un accesso di furia|dopo eoni di prigionia|quando la luna si tinse di rosso|senza preavviso}`,
        (name, place) => `${name} è strisciato fuori da sotto ${place} {lasciando una scia di muco|rompendo le fondamenta|sciogliendo la pietra|nel cuore della notte}`,

        // Trasformazione
        (name, place) => `Una maledizione presso ${place} ha trasformato {un re|un mago|un guerriero|una famiglia intera} in ${name}`,
        (name, place) => `${name} era {un uomo|una donna|un bambino|un sacerdote} prima che ${place} lo {consumasse|mutasse|corrompesse|spezzasse}`,
        (name, place) => `${name} è ciò che resta di {un eroe|un drago|un angelo|una città} dopo che ${place} lo ha {digerito|assorbito|trasformato}`,
        (name, place) => `${name} è nato dalla carne di {un traditore|un martire|un folle|una vergine} sacrificato presso ${place}`,
        (name, place) => `La terra stessa sotto ${place} ha {partorito|vomitato|generato|espulso} ${name} {durante un plenilunio|in una notte senza stelle|quando l'ultimo guardiano morì}`,

        // Origine extraplanare
        (name, place) => `${name} è caduto {dalle stelle|dal cielo|da un altro mondo|da una dimensione morente} atterrando presso ${place}`,
        (name, place) => `${name} è penetrato nella realtà attraverso ${place} quando {i piani si allinearono|qualcuno aprì un portale|la barriera si indebolì}`,
        (name, place) => `${name} è stato {esiliato|bandito|espulso|lanciato} dal suo mondo e imprigionato dentro ${place}`,
        (name, place) => `${name} è scivolato tra le pieghe della realtà presso ${place} quando {il tessuto si assottigliò|un incantesimo strappò il velo|la dimensione collassò}`,
        (name, place) => `${name} proviene da {un piano di pura tenebra|una dimensione di carne|il vuoto cosmico|un sogno che divenne reale} e si è materializzato presso ${place}`,

        // Sopravvivenza e ultima creatura
        (name, place) => `${name} è l'ultimo {sopravvissuto|guardiano|custode|abitante} rimasto presso ${place} {dimenticato da tutti|ancora fedele|che ricorda}`,
        (name, place) => `${name} è ciò che rimane dopo che ${place} è {caduto|bruciato|sprofondato|stato divorato}`,
        (name, place) => `${name} è l'unico testimone di ciò che accadde dentro ${place} {e porta le cicatrici|e non parla più|e ne è stato deformato}`,

        // Nascita mostruosa
        (name, place) => `${name} è nato nelle profondità sotto ${place} {da un uovo nero|da una pozza di sangue|dalle viscere della terra|da un'esplosione magica}`,
        (name, place) => `${name} è cresciuto dentro ${place} {nutrendosi di|divorando|assorbendo} {cadaveri|energia oscura|magia residua|paura}`,
        (name, place) => `${name} si è formato presso ${place} quando {troppo sangue|troppe anime|troppa magia|troppo dolore} si accumularono`,
        (name, place) => `${name} è germogliato {come un fungo|come un tumore|come una piaga|come una radice} nelle viscere sotto ${place}`,
        (name, place) => `${name} si è aggregato {da polvere e ossa|da resti organici|da magia condensata|da ombre impazzite} dentro ${place}`,

        // Costruzione e assemblaggio
        (name, place) => `${name} è stato {assemblato|cucito|forgiato|scolpito} da {parti di cadaveri|ossa di drago|metallo vivente|ombre solidificate} presso ${place}`,
        (name, place) => `${name} è stato costruito dentro ${place} come {sentinella|punizione|esperimento|opera d'arte} da {qualcuno|qualcosa} dimenticato`,
        (name, place) => `${name} è stato {inciso|intagliato|modellato} nella pietra viva dentro ${place} e poi {la pietra ha aperto gli occhi|il sangue ha cominciato a scorrere|ha iniziato a muoversi}`,
        (name, place) => `Un artigiano folle ha forgiato ${name} dentro ${place} usando {organi vivi|metallo maledetto|cristalli di dolore|legno che sanguina}`,

        // Fuga e distruzione
        (name, place) => `${name} è fuggito dalle profondità sotto ${place} {distruggendo tutto|uccidendo i suoi creatori|bruciando le celle|spezzando le catene}`,
        (name, place) => `${name} è stato rilasciato dalle viscere sotto ${place} come {ultima risorsa|arma finale|punizione|vendetta} contro {gli invasori|il mondo|se stessi}`,
        (name, place) => `${name} ha rotto {i sigilli|le catene|le pareti|la gabbia} dentro ${place} {con la sola forza|grazie a un terremoto|quando il guardiano morì|dopo secoli di tentativi}`,

        // Possessione
        (name, place) => `${name} è {un demone|uno spirito|un'entità|un parassita} che ha posseduto {una statua|un cadavere|un animale|una reliquia} presso ${place}`,
        (name, place) => `Qualcosa dentro ${place} ha preso controllo di {una bestia|un golem|un guardiano|un corpo} creando ${name}`,
        (name, place) => `${name} è la volontà stessa che anima ${place}, divenuta {carne|ombra|furia|entità} per {difendersi|vendicarsi|espandersi|divorare}`,

        // Duplicazione e frammentazione
        (name, place) => `${name} è un frammento di {qualcosa di più grande|un dio morto|una creatura antica|un incubo collettivo} che si è staccato presso ${place}`,
        (name, place) => `${name} è una copia {difettosa|impazzita|mutata|evoluta} di qualcosa creato dentro ${place} {molto tempo fa|come scherzo crudele|per sbaglio}`,
        (name, place) => `${name} è nato dalla {divisione|mitosi|scissione|frammentazione} di un'entità più grande dentro ${place}`,

        // Corruzione e contagio
        (name, place) => `${name} era {un guardiano|una sentinella|un custode|una creatura comune} che proteggeva ${place} prima che {un morbo|una maledizione|un'influenza esterna|la follia} lo corrompesse`,
        (name, place) => `${name} è il primo infetto nato dentro ${place}, {il paziente zero|la scintilla|la radice} che ha dato inizio a {una piaga|un'epidemia|una mutazione|un orrore} che si diffonde ancora`,
        (name, place) => `${name} è stato contaminato {da acque nere|da spore antiche|da un artefatto|da sangue infetto} dentro ${place}`,

        // Accumulo e coalescenza
        (name, place) => `${name} è la somma di {ogni creatura morta|ogni anima intrappolata|ogni eco dimenticata|ogni incubo sognato} dentro ${place}`,
        (name, place) => `${name} si è condensato dalla {sofferenza|rabbia|paura|disperazione} che saturava ${place} da {secoli|millenni|tempi immemori}`,

        // Incidente e catastrofe
        (name, place) => `${name} è nato da {un'esplosione arcana|un collasso dimensionale|un terremoto magico|un esperimento critico} che devastò ${place}`,
        (name, place) => `${name} è emerso dal cratere lasciato quando ${place} fu {distrutto|raso al suolo|annientato|devastato}, {fatto di macerie animate|forgiato dalla catastrofe|alimentato dal residuo}`,

        // Patto e debito
        (name, place) => `${name} è stato chiamato presso ${place} {per saldare un debito|in cambio di potere|come prezzo di un patto|per esaudire un desiderio} e non è più ripartito`,
        (name, place) => `Qualcuno dentro ${place} ha stretto un patto {con l'abisso|con il Vuoto|con la morte stessa|con qualcosa senza nome} e ${name} è il risultato`,

        // Evoluzione spontanea
        (name, place) => `${name} si è evoluto {dalla fauna|dalla flora|dai parassiti|dai funghi} che infestano ${place} in {qualcosa di terribile|un predatore perfetto|un abominio|una forma di vita impossibile}`,
        (name, place) => `${name} è ciò che succede quando la vita dentro ${place} {viene lasciata sola troppo a lungo|muta senza controllo|trova un nuovo equilibrio|si rivolta contro se stessa}`,
    ],

    // =============================================
    // FORMATION PHRASES (~65 entries)
    // Eventi che hanno formato/trasformato il mostro
    // Cose SPECIFICHE che sono successe
    // =============================================
    formationPhrases: [
        // Violenza e cannibalismo
        "ha divorato {il suo creatore|un intero villaggio|i propri simili|centotre anime|un esercito} {per fame insaziabile|in un accesso di rabbia|mentre dormivano|lentamente}",
        "ha massacrato {una carovana|una famiglia reale|un tempio intero|chi lo amava} con {le zanne|artigli|magia grezza|un sorriso}",
        "ha strappato {il cuore|gli occhi|le ali|la voce} a {un angelo|un demone|il proprio maestro|chi lo aveva creato}",
        "ha bevuto {il sangue|le lacrime|la linfa vitale|l'essenza} di {mille vittime|un drago|un dio minore|un vulcano}",
        "ha inghiottito {un'intera colonia|quaranta soldati|un branco di lupi|la guardia del tempio} in {un sol boccone|una notte|meno di un'ora}",
        "ha scuoiato {un eroe leggendario|un intero ordine di cavalieri|tre stregoni|la propria prole} e ne ha {indossato la pelle|decorato la tana|fatto trofei}",
        "ha schiacciato {un avamposto|un ponte levatoio|una torre di guardia|un carro blindato} con {il proprio peso|un solo colpo|le fauci|indifferenza}",

        // Modifiche e torture
        "è stato {torturato|modificato|potenziato|vivisezionato} per {anni|decadi|secoli} da {stregoni pazzi|cultisti|una mente alveare|se stesso}",
        "è stato infuso con {sangue di drago|veleno puro|energia del Vuoto|anime in pena|cristalli viventi} fino a {esplodere|mutare|trascendere|implodere}",
        "ha subito {diciassette rituali|cento trapianti|innumerevoli incantesimi|fusione con metallo} che lo hanno {spezzato|riforgiato|illuminato|distrutto e ricostruito}",
        "è stato cucito insieme usando {cadaveri freschi|parti di bestie|frammenti dimensionali|ombre materializzate}",
        "è stato {immerso|bollito|conservato|marinato} in {acido alchemico|liquido amniotico|sangue di demone|acqua del Vuoto} per {mesi|anni|un tempo incalcolabile}",
        "è stato {trapanato|inciso|marchiato|perforato} con {rune viventi|sigilli di contenimento|glifi che bruciano|aghi di osso} su ogni centimetro del corpo",
        "ha subito {l'innesto|la fusione|l'impianto|l'inserimento} di {un parassita senziente|un cuore supplementare|un organo alieno|spine di cristallo} che lo ha {potenziato|deformato|reso instabile|fatto impazzire}",

        // Perdite e trasformazioni mentali
        "ha perso {la ragione|la sua forma originale|il controllo sul corpo|tutti i ricordi|il senso del sé} a causa di {un rituale incompiuto|una maledizione ereditaria|troppo dolore|l'isolamento eterno}",
        "ha dimenticato {il proprio nome|come morire|la forma originale|perché esiste} dopo {troppi secoli|aver visto l'abisso|essere morto tre volte}",
        "è impazzito quando ha visto {la verità|l'infinito|morire tutti|il proprio riflesso|cosa si nasconde oltre}",
        "ha perso {la capacità di parlare|la memoria a breve termine|il concetto di pietà|la distinzione tra sé e le prede} dopo {l'ennesima mutazione|un trauma indicibile|aver attraversato il Vuoto}",
        "ha smarrito {ogni emozione|la percezione del tempo|la differenza tra sogno e realtà|il proprio volto} e {non lo cerca più|lo rimpiange|non se ne accorge}",

        // Assorbimento e accumulo
        "ha assorbito {anime in pena|energia negativa|sogni incubi|radiazioni magiche|la vita stessa} fino a {non poter più fermarsi|diventare ciò che è ora|perdere la forma|brillare di oscurità}",
        "ha incorporato {parti di ogni vittima|frammenti di realtà|paure altrui|echi di battaglie} nel proprio corpo",
        "ha mangiato {un libro di incantesimi|un artefatto maledetto|il cuore di un lich|testi proibiti|ceneri di santi} e ne è stato {cambiato|illuminato|corrotto|potenziato}",
        "ha accumulato {tossine|magia residua|frammenti di anime|ricordi rubati} nel corpo fino a {diventare velenoso|irradiare oscurità|perdere la solidità|non poter più essere toccato}",
        "ha consumato {un intero ecosistema|una rete di funghi senzienti|una colonia di parassiti|le riserve magiche di una torre} e {ne è stato trasformato|ha ereditato le loro proprietà|è diventato simile a loro}",

        // Prigionia
        "è stato incatenato per {tre secoli|millenni|ere perdute|il tempo necessario} in {una prigione dimensionale|ghiaccio eterno|una runa vivente|un incubo senza fine}",
        "è stato sepolto vivo sotto {una montagna|mille tonnellate di sale|sigilli divini|le fondamenta di una città} finché {le catene si arrugginirono|lo dimenticarono|trovò la forza|qualcuno lo liberò}",
        "è rimasto immobile per {secoli|eoni|oltre il tempo} aspettando {il momento giusto|che i sigilli cedessero|vendetta|qualcosa che non arriverà mai}",
        "è stato rinchiuso in {un cristallo|una sfera di vetro|un dipinto|una moneta maledetta} e {ha osservato il mondo passare|ha accumulato rancore|ha lentamente eroso la prigione|è impazzito in silenzio}",
        "è stato confinato dentro {un cerchio di sale|un labirinto senza uscita|una dimensione tascabile|il corpo di un ospite} per {un'eternità|troppo poco|finché non è stato dimenticato}",

        // Combattimenti
        "ha combattuto contro {un'intera legione|sette eroi|un dio minore|se stesso in un'altra dimensione} e {ha vinto|ha perso metà del corpo|ha guadagnato cicatrici che brillano|ne porta ancora i segni}",
        "ha ucciso {il proprio creatore|chi lo amava|il guardiano|l'ultimo ostacolo} con {un solo colpo|lentezza metodica|gioia evidente|rimpianto}",
        "si è nutrito dei {cuori|ricordi|ossa|nomi} dei {caduti|dimenticati|dannati} in {una battaglia|un massacro|un rituale} che durò {tre giorni|un anno|un'eternità}",
        "è sopravvissuto a {un'esecuzione|uno sterminio|un cataclisma|un tentativo di purificazione} che {avrebbe dovuto distruggerlo|uccise tutti gli altri|lo rese più forte|lo spezzò in frammenti}",
        "ha sconfitto {ogni cacciatore inviato|un ordine intero di paladini|tre draghi adulti|un esercito di non-morti} e {ne ha fatto trofei|ne ha assorbito la forza|li ha aggiunti al suo corpo}",

        // Esperienze cosmiche
        "ha visto {la fine del mondo|nascere le stelle|morire gli dei|l'abisso tra gli atomi|cose che non hanno nome} e {ha riso|ha pianto sangue|è impazzito|è diventato silenzioso}",
        "ha toccato {il confine della realtà|un dio addormentato|la fonte della magia|il cuore del Vuoto} ed è tornato {cambiato|spezzato|illuminato|vuoto}",
        "ha ascoltato {la voce della creazione|il canto dell'entropia|sussurri dall'oltre|la propria morte futura} e {non può più dormire|ha risposto|continua a ridere|ripete le parole}",
        "ha guardato {attraverso il tempo|dentro il tessuto della realtà|negli occhi del nulla|oltre l'orizzonte degli eventi} e {qualcosa ha guardato indietro|ne è stato marchiato|ha perso la vista per sempre|non è mai veramente tornato}",

        // Esperimenti falliti
        "è stato il {primo|ultimo|unico riuscito|centesimo tentativo} di {creare vita|raggiungere l'immortalità|superare i limiti|aprire un portale}",
        "è il risultato di {un esperimento dimenticato|una guerra magica|un amore proibito|ambizione senza limiti} che {nessuno voleva|nessuno poteva fermare|ha distrutto chi l'ha iniziato}",
        "era {un prototipo|un modello scartato|una bozza|la versione sbagliata} di qualcosa {che non doveva esistere|di peggio|che fu poi perfezionato|che fallì comunque}",
        "è stato progettato per {obbedire|proteggere|distruggere|servire} ma {la programmazione si è corrotta|ha sviluppato volontà propria|ha frainteso gli ordini|ha deciso diversamente}",

        // Fusioni e assimilazioni
        "è stato fuso con {una bestia|una macchina|un elementale|qualcosa dall'esterno} durante {un rituale|un incidente|una battaglia|l'apocalisse}",
        "ha assimilato {i propri fratelli|la propria specie|i guardiani|le vittime} fino a {diventare uno sciame|perdere l'individualità|essere ovunque}",
        "si è {unito|fuso|combinato|amalgamato} con {il terreno|la struttura|un altro mostro|l'ambiente} fino a {non poter essere separato|perdere i confini|diventare parte del luogo}",
        "ha inglobato {armi conficcate nel corpo|armature di nemici caduti|frammenti di edifici|radici e minerali} che ora {sporgono dalla carne|sono parte di lui|gli servono come protezione}",

        // Punizioni e maledizioni
        "è stato maledetto da {un dio vendicativo|chi ha tradito|l'ultima vittima|se stesso} a {non poter mai morire|non provare altro che dolore|ricordare tutto|esistere in questo modo}",
        "porta il peso di {mille anime|un peccato imperdonabile|una profezia spezzata|una promessa infranta} che lo {consuma|trasforma|guida|tormenta}",
        "è stato condannato a {rivivere la propria morte|cercare senza trovare|proteggere ciò che ha distrutto|divorare senza mai saziarsi} per {l'eternità|punizione divina|uno scherzo crudele del fato}",
        "è stato {marchiato|segnato|bollato|inciso} con {il sigillo della vergogna|una runa di dolore perpetuo|il nome del proprio peccato|un glifo che brucia senza sosta}",

        // Morte e rinascita
        "è {morto e risorto|stato distrutto e riformato|imploso e riesploso|collassato su se stesso} {sette volte|più volte del contabile|ogni volta diverso|sempre più sbagliato}",
        "è tornato {dalla morte|dal Vuoto|dall'oblio|da un luogo senza nome} ma {qualcosa mancava|era cambiato|aveva portato qualcosa con sé|non era più lo stesso}",

        // Crescita innaturale
        "è cresciuto {troppo in fretta|senza controllo|in modi impossibili|ben oltre i limiti} fino a {riempire la caverna|non riconoscersi|diventare troppo grande per muoversi|collassare e riformarsi}",
        "si è {evoluto|adattato|mutato|trasformato} {ogni volta che veniva ferito|ad ogni generazione|dopo ogni pasto|con ogni nuova preda} fino a raggiungere {questa forma|la perfezione predatoria|l'aberrazione completa}",

        // Tradimento
        "ha tradito {chi lo aveva creato|chi lo proteggeva|il proprio branco|l'unico alleato} per {sopravvivere|potere|fame|istinto|nessun motivo comprensibile}",
        "è stato tradito da {chi doveva proteggerlo|il proprio padrone|un alleato|la propria mente} e {ha giurato vendetta|si è spezzato|ha smesso di fidarsi|ha divorato il traditore}",

        // Contaminazione
        "ha {infettato|contaminato|corrotto|avvelenato} {la terra sotto di sé|l'acqua per miglia|l'aria circostante|tutto ciò che ha toccato} trasformandolo in {un'estensione di sé|un territorio ostile|un incubo vivente}",
        "ha diffuso {spore|uova|larve|frammenti di sé} in {ogni fessura|le fondamenta|il sistema idrico|le radici degli alberi} creando {una rete|un'infestazione|un dominio|un organismo distribuito}",

        // Sacrificio e auto-mutilazione
        "si è {strappato|tagliato|amputato|cavato} {un arto|un occhio|il cuore|metà del corpo} per {ottenere potere|compiere un rituale|sfuggire a una trappola|nutrire la prole}",
        "ha sacrificato {la propria voce|i ricordi|la capacità di sentire dolore|la forma umanoide} in cambio di {forza|velocità|immortalità|un potere specifico}",

        // Migrazione e conquista
        "ha {svuotato|sterminato|conquistato|corrotto} {un intero livello di caverne|un bosco millenario|una rete di tunnel|un sistema fluviale sotterraneo} facendone {il proprio dominio|un deserto|un cimitero|un nido}",
        "ha migrato attraverso {tre continenti|il sottosuolo per migliaia di chilometri|dimensioni parallele|epoche diverse} lasciando {distruzione|una stirpe|leggende|cicatrici nel terreno} ovunque",

        // Simbiosi forzata
        "ha {costretto|ingannato|sedotto|catturato} {un'altra creatura|un elementale|un non-morto|uno spirito} a fondersi con lui formando {un'entità duale|un abominio composito|una chimera senziente|qualcosa di nuovo}",
        "si è innestato su {un albero antico|le fondamenta di un tempio|un cadavere colossale|una vena di cristallo} diventando {inamovibile|parte del paesaggio|impossibile da estirpare|una struttura vivente}",

        // Apprendimento predatorio
        "ha {osservato|studiato|analizzato|vivisezionato} {centinaia di prede|diverse specie|i propri cacciatori|creature più forti} per {imparare|adattarsi|copiare|superare} le loro {tecniche|difese|anatomie|strategie}",
    ],

    // =============================================
    // SKILL PHRASES (~72 entries)
    // Cosa SA FARE il mostro - abilità CONCRETE
    // =============================================
    skillPhrases: [
        // Attacchi elementali
        "sputa {acido nero|fiamme blu|ghiaccio bollente|vapori necrotici|fulmini} che {sciolgono la pietra|bruciano l'anima|congelano il tempo|divorano la luce}",
        "emana {freddo mortale|calore infernale|radiazioni|un'aura di disperazione} che {uccide le piante|fa evaporare il sangue|corrompe la carne|spegne le fiamme}",
        "respira {nebbia tossica|spore paralizzanti|nuvole di insetti|aria così pura da bruciare} su {chiunque gli si avvicini|chi osa guardarlo|il campo di battaglia}",
        "genera {scariche elettriche|onde di calore|impulsi sonici|esplosioni di luce nera} che {frantumano la materia|cuociono la carne|spengono ogni suono|annullano la magia}",
        "proietta {spine di osso|schegge di cristallo|getti di sangue bollente|frammenti del proprio corpo} contro {le prede|chiunque si muova|tutto ciò che vive}",

        // Movimento e furtività
        "si muove {nell'ombra|attraverso i muri|più veloce del suono|senza toccare terra|tra i riflessi} per {colpire alla schiena|fuggire|seguire|confondere}",
        "può {scavare|nuotare|volare|planare|teletrasportarsi} attraverso {roccia solida|lava|il vuoto|le dimensioni} come se fosse {aria|acqua|niente}",
        "sparisce {quando lo guardi direttamente|nella nebbia|dietro un angolo|tra un battito di ciglia} e riappare {alle tue spalle|dove meno te lo aspetti|nei tuoi incubi}",
        "caccia {in assoluto silenzio|emettendo ultrasuoni|seguendo l'odore della paura|sentendo i battiti cardiaci} da {chilometri|attraverso i muri|nel buio totale}",
        "striscia su {pareti|soffitti|superfici verticali|liquidi} senza sforzo e {senza fare rumore|lasciando una scia vischiosa|a velocità innaturale}",
        "si sposta attraverso {le ombre|i riflessi|le crepe nei muri|gli specchi} come se fossero {porte|corridoi|scorciatoie} raggiungendo {qualsiasi luogo buio|la vittima ovunque sia|posti impossibili}",

        // Manipolazione mentale
        "può {leggere le menti|controllare i sogni|piegare la volontà|rubare i ricordi|inserire pensieri} di {chiunque lo guardi|chi è solo|le sue prede|vittime dormienti}",
        "sussurra {promesse|verità|bugie|segreti} direttamente nella mente fino a {spezzare la ragione|ottenere obbedienza|far impazzire|convincere}",
        "mostra {visioni|incubi|desideri|il futuro|il passato dimenticato} a chi {lo tocca|sente la sua voce|entra nel suo territorio}",
        "cancella {i ricordi|il senso di sé|la volontà|la paura} nelle vittime {con un tocco|con lo sguardo|con un suono|lentamente} lasciandole {vuote|obbedienti|catatoniche|sorridenti}",
        "proietta {la propria sofferenza|terrore puro|ricordi di morte|follia} nella mente di chi {si avvicina|lo ferisce|lo guarda negli occhi|pronuncia il suo nome}",

        // Rigenerazione e adattamento
        "rigenera {le ferite|gli arti perduti|la pelle|organi|persino la testa} in {secondi|un batter d'occhio|modo innaturale e doloroso da vedere}",
        "non può essere ucciso da {armi normali|fuoco|annegamento|decapitazione|nulla che è stato tentato finora}",
        "si adatta {all'ambiente|alle armi usate contro di lui|al dolore|alla magia} diventando {immune|più forte|più veloce|resistente}",
        "guarisce nutrendosi di {carne viva|paura|dolore altrui|luce lunare|sangue versato}",
        "ricostruisce {il proprio corpo|i tessuti|le ossa|la struttura} usando {materiale circostante|le vittime|detriti|qualsiasi materia organica} quando viene danneggiato",
        "ogni ferita inferta {si richiude in secondi|genera un nuovo arto|lo rende più grande|rilascia un liquido corrosivo} rendendo {inutile combatterlo|ogni attacco controproducente|la situazione sempre peggiore}",

        // Suoni e vibrazioni
        "emette {un urlo|un ronzio|una nota grave|un silenzio assoluto} che {paralizza|uccide|confonde|spezza il vetro|ferma i cuori} chiunque sia entro {cento passi|portata d'udito|la valle}",
        "il suo {battito cardiaco|respiro|movimento|esistenza stessa} produce vibrazioni che {fanno tremare la terra|rompono le ossa|disintegrano la pietra}",
        "canta con {mille voci|voci di morti|una melodia ipnotica|frequenze impossibili} che {attira|uccide|addormenta|fa impazzire}",
        "produce {un ronzio costante|un crepitio di ossa|un sibilo metallico|un rumore bianco} che {rende impossibile pensare|causa nausea|fa sanguinare le orecchie|copre ogni altro suono}",

        // Metamorfosi
        "cambia {forma|colore|dimensione|consistenza|numero di arti} per {ingannare|nascondersi|adattarsi|terrorizzare|sopravvivere}",
        "può apparire come {chiunque abbia divorato|i desideri della vittima|la persona più amata|l'incubo peggiore}",
        "muta {la propria carne|le ossa|gli organi interni} in {armi|armatura|ali|tentacoli} a volontà",
        "si {liquefa|solidifica|vaporizza|comprime} per {passare attraverso fessure|evitare colpi|intrappolare prede|fuggire}",
        "replica {l'aspetto|la voce|i movimenti|l'odore} di {chi ha ucciso|chi gli sta davanti|creature più grandi|qualcosa di familiare} per {tendere trappole|avvicinarsi|seminare caos}",

        // Controllo e comando
        "comanda {i morti|gli insetti|le ombre|le bestie|i parassiti} con {un gesto|il pensiero|un fischio|la volontà|l'odore}",
        "controlla {cadaveri|marionette di carne|ombre viventi|sciami} come estensioni del proprio corpo",
        "risveglia {morti sepolti|spiriti dormienti|antichi guardiani|orrori dimenticati} ovunque passi",
        "attira {vermi|insetti|parassiti|piccoli predatori|creature notturne} che lo {circondano|proteggono|nutrono|trasportano} come un esercito vivente",
        "può {possedere|controllare|pilotare|abitare} {altri corpi|cadaveri freschi|costrutti|animali} abbandonando temporaneamente {il proprio corpo|la forma attuale}",

        // Veleni e malattie
        "il suo {morso|tocco|sangue|respiro|sguardo} inietta {veleno necrotico|paralisi permanente|allucinazioni|una malattia senza cura}",
        "produce {tossine|acidi|spore|uova parassite} che {divorano dall'interno|si riproducono|trasformano|diffondono il contagio}",
        "porta {una pestilenza|una malattia dimenticata|un morbo magico|la decomposizione accelerata} ovunque vada",
        "secerne {un muco paralizzante|un liquido corrosivo|feromoni di terrore|una sostanza che scioglie la volontà} da {ogni poro|le fauci|le ferite|ghiandole pulsanti}",
        "il suo {sangue|sudore|saliva|respiro} è {altamente tossico|infettivo|mutageno|esplosivo a contatto con l'aria} rendendo {pericoloso ferirlo|impossibile avvicinarsi|letale ogni contatto}",

        // Manipolazione fisica
        "afferra le vittime con {tentacoli|catene viventi|radici|ombre solide|appendici innumerevoli}",
        "stritola {ossa|armature|muri|tutto} con {una forza terribile|fauci|anelli del corpo|una stretta}",
        "può {assorbire|incorporare|fondere|divorare} {carne|metallo|magia|anime} nel proprio corpo",
        "manipola {la gravità|la densità dell'aria|la temperatura|la pressione} intorno a sé {schiacciando|sollevando|congelando|surriscaldando} tutto ciò che è vicino",
        "estende {radici|filamenti|pseudopodi|arpioni di carne} dal corpo per {agganciare|intrappolare|perforare|trascinare} le prede",

        // Sensi sovrannaturali
        "vede {nel buio assoluto|attraverso le illusioni|il futuro immediato|la paura|l'aura vitale}",
        "sente {ogni battito cardiaco|bugie|magia|anime|movimenti} entro {la sua tana|chilometri|il suo territorio}",
        "percepisce {la vita|la morte imminente|il sangue versato|la magia usata|intenzioni ostili} come {un odore|un sapore|vibrazioni|dolore}",
        "fiuta {la paura|il sangue|la magia|le bugie|la debolezza} anche attraverso {muri|dimensioni|il tempo|la distanza}",
        "è consapevole di {ogni creatura|ogni movimento|ogni suono|ogni pensiero} nel raggio di {un miglio|cento passi|tutta la regione|quanto riesce a estendere la propria influenza}",

        // Trappole e inganno
        "costruisce {trappole elaborate|tele di carne|fosse disseminate di spine|nidi di ossa} per {catturare prede|difendere il territorio|giocare|collezionare}",
        "imita {voci umane|pianti di bambino|richieste di aiuto|suoni familiari} per {attirare prede|confondere cacciatori|avvicinarsi inosservato}",
        "crea {illusioni|miraggi|copie di sé|falsi rifugi} per {intrappolare|disorientare|stancare|terrorizzare} chi lo cerca",
        "lascia {scie false|tracce fuorvianti|trappole chimiche|esche viventi} che {conducono in vicoli ciechi|attirano altri predatori|drenano energie|avvelenano chi le segue}",

        // Poteri dimensionali e temporali
        "piega {lo spazio|il tempo|la realtà|le dimensioni} intorno a sé creando {labirinti impossibili|loop temporali|zone di distorsione|trappole gravitazionali}",
        "esiste {in più dimensioni contemporaneamente|leggermente sfasato nel tempo|tra la realtà e l'ombra|solo parzialmente in questo piano}",
        "può {rallentare|accelerare|fermare|invertire} il tempo in {una piccola area|un raggio di pochi metri|il suo campo visivo} per {un istante|pochi secondi|quanto serve}",

        // Parassitismo
        "si attacca {alle vittime|agli ospiti|ai corpi|alle menti} come {un parassita|una sanguisuga|una pianta rampicante|un'ombra} e {ne drena la vita|le controlla|le trasforma|le usa come armatura}",
        "depone {uova|larve|spore|semi} {nei corpi delle vittime|nel terreno|nelle ferite|nell'acqua} che {crescono lentamente|prendono il controllo|divorano dall'interno|creano nuove copie}",
        "infesta {i sogni|i ricordi|il subconscio|le paure} delle vittime {nutrendosi della loro angoscia|crescendo nella loro mente|corrompendo la loro personalità|fino a sostituirle}",

        // Resistenza e durabilità
        "la sua {pelle|corazza|membrana|superficie} è {impenetrabile|dura come diamante|in costante rigenerazione|coperta di spine} e {respinge le lame|assorbe la magia|riflette i proiettili|brucia chi la tocca}",
        "sopravvive {senza ossigeno|nel vuoto|nel magma|sotto pressioni immense|in ambienti che sciolgono il metallo} senza {rallentare|indebolirsi|alcun effetto visibile}",

        // Manipolazione ambientale
        "corrompe {la terra|l'acqua|l'aria|la vegetazione} nel raggio di {cento passi|un miglio|quanto riesce a vedere} trasformandola in {un'estensione del proprio corpo|un ambiente tossico|un territorio di caccia|un incubo}",
        "altera {il clima locale|la temperatura|la luce|la gravità} con {la sola presenza|un gesto|il respiro|la volontà} creando {tempeste|oscurità totale|piogge acide|zone di silenzio}",

        // Abilità specifiche horror
        "si nutre {attraverso la pelle|per osmosi|assorbendo il calore corporeo|risucchiando l'aria dai polmoni} delle vittime {senza bisogno di toccarle|mentre dormono|attraverso le pareti|lentamente}",
        "può {staccare|lanciare|controllare|far esplodere} parti del proprio corpo che {crescono autonomamente|cercano le prede|si riformano|diventano trappole}",
        "genera {un campo di terrore|un'aura di nausea|una zona di follia|un raggio di decadimento} che {precede il suo arrivo|rimane dopo il passaggio|si espande costantemente|colpisce solo i viventi}",

        // Comunicazione innaturale
        "comunica {con vibrazioni|attraverso il dolore|iniettando immagini|tramite odori chimici} che {solo le sue prede percepiscono|causano emicranie|trasmettono emozioni pure|non possono essere ignorati}",
        "emette {segnali chimici|frequenze subsoniche|impulsi psichici|feromoni di panico} che {attirano altre creature|causano fuga istintiva|paralizzano la volontà|disorientano completamente}",

        // Mimetismo avanzato
        "si mimetizza {perfettamente|istantaneamente|in modi impossibili} con {l'ambiente|le ombre|il terreno|le strutture} diventando {invisibile|indistinguibile|parte dello scenario|una trappola vivente}",
        "assume {la forma|il colore|la texture|le dimensioni} di {rocce|alberi|strutture|cadaveri} rimanendo {immobile per giorni|in attesa|perfettamente camuffato|indistinguibile dall'originale} finché {una preda si avvicina|è troppo tardi|qualcuno lo tocca}",
    ],

    // =============================================
    // REPUTATION SOURCES (~30 entries)
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
        "I soldati raccontano che",
        "I monaci hanno registrato che",
        "Le guardie del confine riferiscono che",
        "I mercanti di passaggio avvertono che",
        "I prigionieri confessano che",
        "I bambini cantano che",
        "Le cronache imperiali riportano che",
        "I negromanti confermano che",
        "Ogni mappa della regione annota che",
        "I rifugiati piangendo raccontano che",
        "I druidi della foresta temono che",
        "Gli esploratori tornati vivi giurano che",
        "I carcerieri dei sotterranei sanno che",
        "Le iscrizioni sulle rovine dicono che",
        "I morti stessi sembrano sussurrare che",
    ],

    // =============================================
    // REPUTATION CLAIMS (~62 entries)
    // Cosa si dice del mostro - specifico e memorabile
    // =============================================
    reputationClaims: [
        // Immortalità e invulnerabilità
        "sia {immortale|invulnerabile|un dio caduto|più antico della morte stessa}",
        "non possa essere ucciso da {armi mortali|fuoco|acciaio benedetto|nulla che sia stato provato}",
        "ritorni sempre {più forte|più grande|più affamato|cambiato} ogni volta che viene ucciso",
        "sia {impossibile da intrappolare|resistente a ogni magia conosciuta|immune al dolore|incapace di morire davvero}",

        // Scopi e desideri
        "cerchi {un modo per morire|il suo cuore perduto|vendetta contro gli dei|di spegnere il sole|colei che lo ha creato}",
        "stia raccogliendo {anime|ossa|nomi|ricordi|parti di sé stesso} per {un rituale|completarsi|ricostruire qualcosa|un esercito}",
        "aspetti {un'eclissi|l'allineamento|il risveglio di qualcosa|la fine del mondo|il momento giusto}",
        "stia {costruendo|scavando|preparando|coltivando} qualcosa nelle profondità che {nessuno osa indagare|cambierà tutto|è quasi pronto|richiede ancora vittime}",
        "cerchi {un ospite specifico|una reliquia perduta|il luogo della propria nascita|qualcuno che ricordi il suo nome}",

        // Distruzione passata
        "abbia distrutto {sette regni|un'intera civiltà|l'antica luna|i propri creatori|la sua stessa specie}",
        "sia la causa di {una piaga dimenticata|la caduta di Xarenth|il Grande Incendio|l'Inverno Eterno}",
        "abbia divorato {un dio minore|mille eroi|un'intera foresta|un vulcano|i sogni di un regno}",
        "abbia svuotato {un mare|una catena montuosa|tre città|un'intera regione} lasciando solo {cenere|silenzio|ossa|nulla}",
        "sia responsabile della scomparsa di {un'intera razza|dodici spedizioni|ogni esploratore della regione|tutti coloro che lo hanno cercato}",

        // Segreti nascosti
        "nasconda {un tesoro maledetto|il suo unico punto debole|una porta per l'inferno|l'anima del mondo|sette nomi veri} {nel suo corpo|nella sua tana|in un'altra dimensione}",
        "custodisca {un uovo antico|una chiave dimensionale|l'ultimo seme|un frammento di dio} che {tutti cercano|nessuno deve trovare|darà potere assoluto}",
        "sia fatto di {anime compresse|materia stellare|carne di draghi|ombre solidificate|dolore puro}",
        "contenga {una prigione|un portale|un cuore che batte|un universo in miniatura} nel proprio corpo",
        "celi {un messaggio|una mappa|una profezia|un avvertimento} {nella propria pelle|nel suo canto|nel disegno delle cicatrici|nel ritmo dei passi}",

        // Debolezze specifiche
        "possa essere ucciso solo da {una lama forgiata nel suo sangue|un bacio sincero|chi non ha paura|una lacrima d'innocente|qualcuno che ami}",
        "tema {l'argento benedetto|la luce del sole|il proprio nome pronunciato|gli specchi|l'acqua corrente|il silenzio}",
        "sia vulnerabile durante {la luna nuova|il sonno|le ore dell'alba|il pianto} e solo {in quei momenti|se colpito al cuore|se chiamato per nome}",
        "perda {i poteri|la solidità|la forza|la coscienza} quando {sente campane|vede il proprio riflesso|qualcuno ride|piove}",

        // Profezie e destino
        "sia l'araldo di {una nuova era|la fine dei tempi|un dio oscuro|una pestilenza cosmica|il ritorno degli antichi}",
        "sia {nato|cresciuto|creato|destinato} per {distruggere il mondo|giudicare l'umanità|aprire un portale|risvegliare qualcosa}",
        "adempia {una profezia|una maledizione antica|un patto dimenticato|il volere di qualcosa oltre}",
        "sia {il primo segno|l'ultimo avvertimento|la causa|il catalizzatore} di {una catastrofe imminente|un'era di tenebra|la fine dell'equilibrio|un risveglio di massa}",

        // Caratteristiche uniche
        "pianga {sangue nero|acido|diamanti liquidi|fiamme fredde|luce} quando {uccide|dorme|guarda la luna|si nutre|è solo}",
        "non abbia {ombra|riflesso|odore|suono dei passi|battito cardiaco}",
        "sia in realtà {molte creature|un alveare|frammenti di un dio|l'incubo di qualcuno|un paradosso vivente}",
        "emani {un odore di fiori marci|un calore innaturale|un freddo che brucia|un silenzio assoluto|una luce che non illumina}",
        "lasci {impronte che bruciano|un'eco che dura giorni|tracce di gelo|segni che sanguinano|un odore che non va via} ovunque passi",

        // Relazioni e origini
        "un tempo fosse {umano|un angelo|un eroe leggendario|il re di Karnath|amato da tutti}",
        "sia {il figlio|la creazione|la vendetta|il rimpianto} di {un dio impazzito|uno stregone pentito|qualcosa dimenticato}",
        "abbia {divorato|assorbito|sostituito|fuso con} {il precedente guardiano|i suoi creatori|tutto ciò che era}",
        "sia {un gemello|un'ombra|un riflesso distorto|la controparte oscura} di {un eroe vivente|una divinità|una creatura leggendaria|qualcuno che non sa}",
        "sia stato un tempo {il più grande guaritore|un protettore di bambini|un costruttore di ponti|amico di tutti} prima della {caduta|corruzione|trasformazione|maledizione}",

        // Numeri e dettagli specifici
        "abbia {mille occhi|sette cuori|diciannove bocche|ali senza piume|troppi arti per contarli}",
        "sia lungo {trenta metri|quanto tre case|abbastanza da circondare il villaggio} e largo {il doppio|metà}",
        "esista {in tre luoghi contemporaneamente|tra le dimensioni|fuori dal tempo|solo quando osservato}",
        "abbia {novantanove denti|undici code|tre teste che litigano|un unico occhio enorme|un numero variabile di zampe}",
        "pesi {quanto una montagna|nulla|più di quanto il terreno possa reggere|diversamente a seconda del momento}",

        // Comportamenti inquietanti
        "collezioni {denti|occhi|mani sinistre|nomi|ricordi|ombre} delle proprie vittime",
        "ripeta {sempre la stessa frase|i nomi dei morti|una conta infinita|le ultime parole di chi uccide}",
        "sorrida {sempre|solo prima di uccidere|con una bocca che non dovrebbe essere lì|in un modo che è peggio di un ringhio}",
        "si {gratti|strofini|morda|strappi} {la propria pelle|le croste|gli arti|i parassiti} {in continuazione|quando è nervoso|creando nuove ferite|con metodica ossessione}",

        // Conoscenza e intelligenza
        "sia {più intelligente di quanto sembri|senziente|capace di parlare|in grado di ragionare} ma {scelga di non farlo|abbia smesso|lo faccia solo per ingannare}",
        "conosca {il nome di ogni persona che incontra|i segreti dei re|il futuro prossimo|le debolezze di ognuno} senza {che nessuno sappia come|averlo mai chiesto|aver bisogno di parlare}",
        "ricordi {ogni dolore inflitto|ogni faccia vista|ogni promessa fatta|la propria vita precedente} e {ne soffra|li usi come arma|non riesca a dimenticare}",
        "comprenda {ogni lingua|il linguaggio degli animali|le rune antiche|parole che non esistono più} ma {non possa parlare|scelga il silenzio|comunichi solo con violenza}",

        // Orrore esistenziale
        "non sia {veramente vivo|completamente morto|reale nel senso tradizionale|fatto di materia normale}",
        "sia {un buco nella realtà|un errore della creazione|qualcosa che non avrebbe dovuto esistere|un sogno divenuto materia}",
        "la sua esistenza {indebolisca la realtà|causi incubi ai sensitivi|disturbi le profezie|confonda i veggenti}",

        // Effetti sulla zona
        "la terra {muoia|marcisca|si avveleni|si spacchi} ovunque {cammini|riposi|respiri|guardi troppo a lungo}",
        "le {stagioni|maree|stelle|bussole|orologi} impazziscano in sua {presenza|vicinanza|ombra|scia}",
        "gli animali {fuggano|muoiano|impazziscano|si immobilizzino} quando {si avvicina|è nei paraggi|il vento porta il suo odore}",

        // Connessioni disturbanti
        "sia collegato {a ogni ombra|a ogni specchio|ai sogni di tutti|alla paura stessa} e {possa emergere da qualsiasi|li usi come porte|ne sia parte}",
        "abbia {un patto|un legame|una simbiosi|una connessione} con {la luna|il sottosuolo|le tempeste|la morte stessa} che lo {nutre|protegge|rende ciclico|guida}",

        // Capacità disturbanti
        "possa {sentire|assaporare|percepire|annusare} {la paura|le bugie|la disperazione|l'innocenza} come {un odore dolce|una vibrazione|un sapore metallico|musica}",
        "sia capace di {parlare con i morti|prevedere le morti|ricordare vite non sue|sapere come morirai} e {lo faccia spesso|non possa smettere|lo usi per cacciare}",
        "cambi {dimensione|peso|numero di arti|consistenza} in base a {la fase lunare|la quantità di sangue versato|la paura circostante|il numero di vittime recenti}",
        "possa {entrare nei sogni|camminare tra i riflessi|muoversi tra le ombre|viaggiare attraverso il dolore} per {raggiungere le vittime|fuggire|cacciare|tornare alla tana}",
    ],

    // =============================================
    // CURRENT STATES (~52 entries)
    // Cosa fa ADESSO il mostro - azioni concrete
    // =============================================
    currentStates: [
        // Attesa e sonno
        "ora {dorme|attende|si nasconde|si prepara} {nelle profondità|sotto la montagna|in una dimensione parallela} aspettando {il risveglio|il momento giusto|che i sigilli cedano|qualcuno abbastanza coraggioso}",
        "riposa in {un bozzolo di carne|un sarcofago di ghiaccio|una pozza di sangue|una cripta sigillata} {rigenerandosi|sognando vendetta|accumulando forza}",
        "attende {immobile|nascosto|mimetizzato} che {una preda passi|qualcuno apra la porta|arrivi il suo padrone|finisca il rituale}",
        "giace {in letargo|immobile|semi-cosciente|sospeso} {sotto strati di terra|in un uovo di pietra|nel cuore di un ghiacciaio|in fondo a un lago nero} e {il terreno sopra di lui trema|la zona è morta|nessuno vi si avventura|si sente il battito}",
        "è {rannicchiato|arrotolato|compresso|ripiegato} in uno spazio {troppo piccolo|impossibile|nascosto|dimenticato} aspettando {con infinita pazienza|senza fretta|da più tempo di quanto chiunque ricordi}",

        // Vagabondaggio
        "vaga per {le terre desolate|il mondo sotterraneo|i sogni|le rovine dimenticate} cercando {cibo|pace impossibile|una fine|chi lo ha creato|compagnia}",
        "attraversa {villaggi|foreste|montagne|dimensioni} lasciando {solo morte|una scia di follia|terre bruciate|silenzio innaturale}",
        "segue {l'odore del sangue|voci che solo lui sente|un istinto antico|il richiamo di qualcosa|memorie frammentate}",
        "erra senza meta per {le pianure|il sottosuolo|le coste|i confini del mondo conosciuto} {distruggendo senza intenzione|cercando qualcosa che non sa nominare|ripetendo un percorso circolare|allontanandosi dalla civiltà}",
        "migra {verso nord|in profondità|seguendo le stagioni|senza schema apparente} trascinandosi dietro {un'aura di morte|la propria prole|i resti delle vittime|una scia di corruzione}",

        // Costruzione e accumulo
        "costruisce {un nido di ossa|un trono di cadaveri|un tempio oscuro|una torre vivente} usando {le sue vittime|pietre maledette|ombre solidificate}",
        "accumula {tesori rubati|artefatti magici|parti di corpi|anime in bottiglie|oggetti specifici} per {un motivo dimenticato|compagnia|un rituale|fame da collezionista}",
        "modifica {il proprio corpo|la sua tana|l'ambiente circostante|le sue vittime} {costantemente|lentamente|dolorosamente|artisticamente}",
        "sta {scavando|allargando|decorando|espandendo} {la propria tana|un sistema di tunnel|una rete di caverne|un labirinto} con {ossa e carne|materiale rubato|i corpi dei caduti|secrezioni indurite}",
        "ordina {le ossa|i teschi|le armi raccolte|i trofei} in {file precise|cerchi concentrici|strutture geometriche|modi che solo lui comprende}",

        // Protezione
        "protegge {un uovo pulsante|un portale chiuso|un fiore di cristallo|l'ultimo ricordo} {fino alla morte|con ferocia|da chiunque si avvicini|senza sapere perché}",
        "custodisce {una tomba|una reliquia|un segreto|un luogo} che {nessuno deve trovare|tutti cercano|non ricorda più perché}",
        "difende {il suo territorio|la tana|i suoi piccoli|qualcosa sepolto} con {brutale efficienza|violenza estrema|astuzia crudele}",
        "sorveglia {un passaggio|un artefatto|una prigione|un confine} {instancabilmente|con ossessione|da prima che qualcuno ricordi|come programmato}",

        // Caccia
        "caccia {ogni notte|durante le tempeste|quando la luna è piena|senza sosta} {per fame insaziabile|per istinto|per sport crudele|per necessità}",
        "si nutre di {paura|carne viva|sangue giovane|magia residua|anime fresche|sogni} ogni {notte|luna|settimana}",
        "uccide {tutto ciò che respira|solo chi lo disturba|metodicamente|seguendo un pattern}",
        "tende agguati {lungo le strade|presso i guadi|negli edifici abbandonati|dove la gente si sente al sicuro} {con pazienza calcolata|per gioco|senza fretta|come un ragno}",
        "sta {imparando|affinando|perfezionando|cambiando} le proprie {tecniche di caccia|strategie|prede preferite|zone di caccia} diventando {più efficiente|più imprevedibile|più difficile da evitare}",

        // Ricerca e desiderio
        "cerca disperatamente {di ricordare chi era|di tornare umano|un modo per morire|il proprio creatore} ma {non può fermarsi|continua a uccidere|sta perdendo la forma}",
        "tenta di {comunicare|capire|ricostruire|imitare} {l'umanità|la propria origine|cosa ha perso} ma {esce solo orrore|spaventa|non riesce}",
        "vuole {trovare un simile|non essere solo|essere compreso|tornare a dormire} ma {è l'ultimo|nessuno sopravvive abbastanza|tutti fuggono}",
        "sta cercando {un artefatto specifico|un luogo dimenticato|una persona|una risposta} {da secoli|con crescente disperazione|distruggendo tutto nel processo|senza sapere cosa troverà}",

        // Servizio e controllo
        "serve {un padrone oscuro|un istinto cieco|una profezia antica|il Vuoto} {fedelmente|senza domande|contro la propria volontà}",
        "obbedisce a {comandi dimenticati|una programmazione spezzata|voci nella sua testa|un patto antico} che {non può ignorare|lo tormenta|lo distrugge lentamente}",
        "esegue {ordini|rituali|compiti|missioni} che {non ha mai ricevuto|ricorda a malapena|gli sono stati impressi|non comprende più} con {cieca dedizione|crescente confusione|brutale precisione}",

        // Riproduzione e diffusione
        "sta {deponendo uova|creando copie|infettando|trasformando} {tutto ciò che tocca|le sue vittime|l'ambiente|lentamente il mondo}",
        "si sta {moltiplicando|dividendo|evolvendo|diffondendo} in {modi innaturali|segreto|sotto terra|attraverso i sogni}",
        "sta {contaminando|corrompendo|alterando|avvelenando} {le falde acquifere|il terreno|la fauna locale|l'ecosistema} {lentamente|senza che nessuno se ne accorga|in un raggio sempre più ampio}",
        "i suoi {frammenti|figli|spore|echi} stanno {comparendo|emergendo|maturando|risvegliandosi} in {luoghi distanti|tutto il continente|pozzi e cisterne|i sogni della gente}",

        // Declino e agonia
        "sta {morendo lentamente|perdendo la forma|decomponendosi|tornando nel nulla} ma {non riesce a finire|continua a vivere|si rifiuta di cedere}",
        "soffre {costantemente|senza fine|in modi incomprensibili} e {vuole solo finire|cerca vendetta|porta tutti con sé|non sa cosa fare}",
        "sta {perdendo pezzi|dissolvendosi|rimpicciolendo|dimenticando} ma {ogni frammento perso diventa pericoloso|il nucleo resta letale|la sostanza si diffonde|diventa più concentrato}",

        // Crescita e trasformazione
        "sta {crescendo|mutando|cambiando|evolvendo} {senza controllo|in modi mai visti|a velocità preoccupante|verso una forma finale}",
        "sta {assorbendo|incorporando|fondendosi con|inghiottendo} {il terreno circostante|creature vicine|la vegetazione|l'acqua} espandendo {la propria massa|i confini del corpo|il territorio controllato}",

        // Rituale e preparazione
        "sta {completando un rituale|preparando un'invocazione|accumulando potere|raccogliendo ingredienti} che {richiede tempo|nessuno deve interrompere|è quasi completo|cambierà tutto}",
        "dispone {ossa|simboli|corpi|pietre} in {cerchi|spirali|schemi geometrici|configurazioni impossibili} per {un rituale imminente|un motivo sconosciuto|aprire qualcosa|completare sé stesso}",

        // Conflitto interiore
        "lotta {contro la propria natura|per mantenere il controllo|con le voci nella testa|tra la fame e il ricordo di chi era}",
        "alterna momenti di {lucidità e furia|calma e violenza|silenzio e urla|immobilità e distruzione} senza {preavviso|logica|schema|possibilità di previsione}",

        // Osservazione e attesa attiva
        "osserva {i villaggi vicini|le carovane|i viaggiatori|la civiltà} da {lontano|l'ombra|sotto terra|attraverso gli occhi di altri} {studiando|pianificando|aspettando|imparando}",
        "sta {mappando|memorizzando|catalogando|studiando} {il territorio|le difese|le abitudini|i punti deboli} di {chi vive nei paraggi|la città più vicina|il regno|chiunque lo cerchi}",

        // Imitazione e infiltrazione
        "sta {imitando|copiando|studiando|osservando} {il comportamento umano|i rituali locali|il linguaggio|le strutture sociali} per {infiltrarsi|avvicinarsi|comprendere|sfruttare} {la civiltà|una comunità|un insediamento|le difese}",
        "ha {preso le sembianze|assunto l'identità|sostituito|rimpiazzato} {un viandante|un mercante|una guardia|un eremita} e nessuno {se ne è accorto|sospetta|lo sa ancora|è sopravvissuto per scoprirlo}",

        // Stasi forzata
        "è {bloccato|incastrato|intrappolato|congelato} tra {due stati|la vita e la morte|due dimensioni|una forma e l'altra} e {soffre|si dibatte|attende|sta lentamente liberandosi}",
        "è {sigillato|contenuto|soppresso|rallentato} da {incantesimi antichi|catene runiche|preghiere costanti|un artefatto} che si stanno {indebolendo|consumando|spezzando|erodendo}",

        // Comunicazione
        "sta {tentando di comunicare|inviando segnali|lasciando messaggi|gridando} {attraverso i sogni|con simboli di sangue|modificando il terreno|con vibrazioni} ma {nessuno capisce|tutti fraintendono|il messaggio arriva distorto|sembra solo violenza}",
        "emette {un richiamo|un canto|un segnale|vibrazioni} che {attira altri della sua specie|attraversa dimensioni|disturba i sogni|fa vibrare le ossa} da {settimane|mesi|quando è arrivato|sempre più forte}",
    ],

    // =============================================
    // CURRENT CONNECTORS (~22 entries)
    // =============================================
    currentConnectors: [
        "Adesso", "Ora", "Oggi", "In questo momento", "Da allora",
        "Nelle notti senza luna", "Quando il vento urla", "Nel buio",
        "Sotto la montagna", "Oltre il confine", "Nei sotterranei",
        "Durante le tempeste", "Al calare del sole", "Prima dell'alba",
        "Nei giorni di nebbia", "Tra le rovine", "Nel silenzio della notte",
        "Ogni luna piena", "Quando nessuno guarda", "Nelle ore più buie",
        "Mentre il mondo dorme", "Fin da quel giorno"
    ],

    patternConnectors: {
        patternD_intro: (place, name) => `Presso ${place}, ${name}`,
        patternD_mid: 'Poi',
        patternE_mid: 'Intanto,',
        patternE_name_insert: true,
        patternF_intro: (place) => `Presso ${place},`,
        formationSubject: ''
    }
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
