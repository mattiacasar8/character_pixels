// === BACKSTORY GENERATOR - EXPANDED DATASET ===
// Version: 2.0
// Last updated: 2025
// 
// GUIDELINES:
// - Linguaggio neutro (no accordi di genere)
// - Azioni concrete, non etichette
// - Oggetti specifici, non vaghi
// - Luoghi senza articoli
// - No meta-narrazione

export const data = {
  
  // =============================================
  // PLACES (~50 entries)
  // Mix di suoni: nordico, mediterraneo, orientale, generico fantasy
  // NO articoli (evita "a le", "di il")
  // =============================================
  
  places: [
    // Nordico/Germanico
    "Thornwall", "Grimhold", "Frostmere", "Ashford", "Ironvale",
    "Blackmoor", "Stormwatch", "Ravenscar", "Winterfell", "Greystone",
    "Dunharrow", "Whitecliff", "Shadowfen", "Coldwater", "Highgarden",
    
    // Mediterraneo/Latino
    "Valdoria", "Porto Grigio", "Solmara", "Pietralunga", "Acquanera",
    "Rocca Nera", "Ponte Vecchio", "Tornalta", "Campofalco", "Selvafredda",
    "Costabruna", "Villachiara", "Montespino", "Fondovalle", "Altomare",
    
    // Orientale/Esotico
    "Karveth", "Zar'khan", "Vornheim", "Ashkar", "Myr'then",
    "Khalindra", "Vor'nash", "Thal'mera", "Sandoral", "Oasis Prime",
    
    // Generico/Descrittivo
    "un villaggio senza nome", "una città portuale", "un avamposto dimenticato",
    "un monastero in rovina", "una fortezza abbandonata", "un crocevia malfamato"
  ],
  
  // =============================================
  // PLACE DESCRIPTORS (~25 entries)
  // Usati per costruzioni tipo "tra [descriptor] di [place]"
  // =============================================
  
  placeDescriptors: [
    "i vicoli", "le strade polverose", "le ombre", "i mercati",
    "le nebbie", "le taverne", "i bassifondi", "le torri",
    "i templi abbandonati", "le miniere", "i campi", "i moli",
    "le fogne", "i tetti", "le cantine", "i magazzini", "le rovine",
    "le mura", "i bordelli", "le prigioni", "i cimiteri", "le arene",
    "i cantieri navali", "le fucine", "i quartieri poveri"
  ],
  
  // =============================================
  // ORIGIN PHRASES (~25 entries)
  // Funzioni che ricevono (name, place) e ritornano stringa
  // Usare {a|b|c} per varianti interne
  // =============================================
  
  originPhrases: [
    // Semplici
    (name, place) => `${name} viene da ${place}`,
    (name, place) => `${name} è cresciuto a ${place}`,
    (name, place) => `${name} ha lasciato ${place} {anni fa|molto tempo fa|quando era giovane}`,
    
    // Con dettaglio temporale
    (name, place) => `${name} ha passato {l'infanzia|i primi anni|troppo tempo|metà della vita} a ${place}`,
    (name, place) => `${name} è arrivato a ${place} {senza niente|in fuga|cercando rifugio|per caso|seguendo una voce}`,
    (name, place) => `${name} è {scappato|partito|scomparso|fuggito} da ${place} {anni fa|una notte|senza voltarsi|lasciando tutto}`,
    
    // Con ambiente
    (name, place) => `Le {strade|ombre|notti|piogge|guerre} di ${place} hanno {cresciuto|forgiato|segnato|indurito} ${name}`,
    (name, place) => `${name} ha trovato {rifugio|lavoro|guai|nemici|amici} a ${place}`,
    (name, place) => `${name} ricorda {poco|troppo|solo il peggio|solo il sangue|ogni dettaglio} di ${place}`,
    
    // Con mistero
    (name, place) => `Nessuno sa {da quanto|perché|come|quando} ${name} {viva|sia arrivato|si nasconda|lavori} a ${place}`,
    (name, place) => `${name} non parla mai di ${place}, ma {viene da lì|qualcosa lo lega a quel posto|lì ha lasciato qualcosa|porta ancora le cicatrici}`,
    (name, place) => `A ${place}, ${name} era {nessuno|qualcun altro|già nei guai|conosciuto con un altro nome}`,
    
    // Con azione
    (name, place) => `${name} ha {bruciato i ponti|sepolto il passato|cambiato nome} quando ha lasciato ${place}`,
    (name, place) => `Prima di arrivare a ${place}, ${name} era {nessuno|un fantasma|in fuga|dato per morto}`,
    (name, place) => `${name} ha {ereditato|rubato|comprato|vinto} un posto a ${place}`,
    
    // Con conseguenza
    (name, place) => `${place} ha {cacciato|accolto|tradito|dimenticato} ${name}`,
    (name, place) => `${name} ha giurato di non tornare mai a ${place}`,
    (name, place) => `${name} sogna ancora {le strade|i volti|le fiamme|il sangue} di ${place}`,
    
    // Specifiche
    (name, place) => `${name} è nato in {una prigione|un bordello|una carovana|un campo di battaglia} vicino a ${place}`,
    (name, place) => `${name} ha perso {la famiglia|tutto|la memoria|un braccio} a ${place}`,
    (name, place) => `${name} deve la vita a qualcuno di ${place}`,
    (name, place) => `${name} ha {un debito|un nemico|una tomba|un segreto} a ${place}`,
    (name, place) => `${name} ha {comprato|guadagnato|rubato} la libertà a ${place}`,
    (name, place) => `${name} è stato {venduto|tradito|abbandonato|salvato} a ${place}`,
  ],
  
  // =============================================
  // FORMATION PHRASES (~35 entries)
  // Eventi che hanno formato il personaggio
  // Usare oggetti e situazioni CONCRETE
  // =============================================
  
  formationPhrases: [
    // Perdite concrete
    "ha perso {la famiglia|un fratello|un figlio|un maestro|l'unico amico} in {una notte|un incendio|una guerra|un'epidemia|un tradimento}",
    "ha visto morire {il proprio maestro|chi lo ha cresciuto|l'unica persona di cui si fidava|un innocente} davanti ai propri occhi",
    "ha perso {un occhio|una mano|tre dita|l'udito da un orecchio|la voce per un anno} per {una lama|un incantesimo|un morso|proteggere qualcuno}",
    "ha seppellito {un figlio|un compagno|un amante|il proprio passato} e non ne parla",
    
    // Tradimenti e inganni
    "ha visto tradire {un giuramento sacro|la propria gilda|un patto di sangue|chi non se lo meritava}",
    "è stato venduto da {un parente|un amico|un amante|chi doveva proteggerlo} per {oro|potere|paura|vendetta}",
    "ha scoperto che {il proprio mentore|un vecchio amico|chi lo ha cresciuto} {mentiva da sempre|era il nemico|lo usava}",
    "ha tradito {un giuramento|una gilda|un amico|un signore} per {sopravvivere|proteggere qualcuno|oro|paura}",
    
    // Patti e segreti
    "ha stretto un patto {di sangue|con un demone|con una strega|che non può rompere} di cui non parla",
    "ha scoperto un segreto che {costa vite|altri hanno pagato caro|vale una fortuna|doveva restare sepolto}",
    "ha fatto una promessa a {un morente|un fantasma|un nemico|se stesso} che intende mantenere",
    "conosce {la verità|l'ubicazione|il nome vero|il punto debole} di qualcosa che altri cercano",
    
    // Crimini e violenza
    "ha {ucciso|risparmiato} {per la prima volta|senza esitare|per proteggere qualcuno|per sbaglio} e non lo dimentica",
    "ha rubato {un antico artefatto|un tomo proibito|un sigillo reale|un pugnale maledetto} da {un tempio|una tomba|un nobile|un mago}",
    "ha {bruciato|distrutto|avvelenato} {un villaggio|una nave|un raccolto|una biblioteca} per {ordini|vendetta|denaro|errore}",
    "ha {liberato|catturato|ucciso} qualcuno che {non doveva|meritava di peggio|era innocente|lo perseguita ancora}",
    
    // Sopravvivenza
    "ha imparato a sopravvivere {rubando|combattendo|mentendo|nascondendosi|vendendo informazioni}",
    "ha passato {un anno|tre inverni|troppo tempo} in {una prigione|una miniera|catene|esilio}",
    "è sopravvissuto a {un naufragio|un'epidemia|un massacro|un rituale fallito|una condanna a morte}",
    "ha camminato per {settimane|mesi} attraverso {un deserto|una palude|montagne|terre maledette} senza sapere se sarebbe arrivato",
    
    // Apprendimento
    "ha imparato {a combattere|a leggere|un mestiere|la magia} da {un esiliato|un prigioniero|un nemico|un morente}",
    "ha trovato {un maestro|una guida|uno scopo|una famiglia} tra {mercenari|ladri|monaci|stranieri}",
    "ha studiato {in segreto|per anni|sotto falso nome|testi proibiti} qualcosa che non doveva",
    "ha scoperto di avere {un talento|un dono|una maledizione|un legame} che non capisce",
    
    // Scelte difficili
    "ha dovuto scegliere tra {la lealtà e la sopravvivenza|due persone che amava|la verità e la vita|l'onore e la famiglia}",
    "ha sacrificato {tutto ciò che aveva|la propria reputazione|un amico|anni di lavoro} per {uno sconosciuto|un principio|niente}",
    "ha rifiutato {un titolo|una fortuna|un matrimonio|un ordine} e ne paga le conseguenze",
    "ha accettato {un lavoro|un patto|una missione|una maledizione} di cui si è pentito",
    
    // Trasformazioni
    "ha cambiato {nome|volto|lealtà|fede} almeno {una volta|tre volte|più di quanto ammetta}",
    "ha abbandonato {una fede|un giuramento|una vita|tutto} per {ricominciare|vendetta|amore|paura}",
    "ha perso {la fede|la speranza|la fiducia|la paura} dopo {quella notte|quel giorno|l'ultimo inverno}",
    "ha {costruito|perso|ricostruito} tutto {più di una volta|da zero|senza aiuto}",
    
    // Relazioni
    "ha amato {una volta sola|la persona sbagliata|senza essere ricambiato|e perso}",
    "ha cresciuto {un orfano|un animale|un allievo} che ora {è scomparso|è morto|lo odia|è tutto ciò che ha}",
    "deve la vita a {un nemico|uno sconosciuto|qualcuno che ora è morto|chi meno se lo aspettava}",
  ],
  
  // =============================================
  // SKILL PHRASES (~40 entries)
  // Cosa SA FARE il personaggio (azioni, non etichette)
  // Evitare "è un X" - preferire "fa X"
  // =============================================
  
  skillPhrases: [
    // Combattimento
    "combatte {senza esitazione|come se non avesse nulla da perdere|per chi paga bene|solo quando necessario|meglio di quanto sembri}",
    "usa {la spada|il pugnale|l'arco|le mani nude} come {un'estensione del corpo|pochi sanno fare|chi è cresciuto in guerra}",
    "sa colpire {dove fa più male|senza essere visto|prima che l'altro capisca|i punti vitali}",
    "ha {ucciso|sconfitto|affrontato} {più persone di quante ammetta|avversari più forti|cose che non dovrebbero esistere}",
    
    // Furto e inganno
    "ruba {senza farsi scoprire|solo da chi può permetterselo|come respira|cose che altri non vedono nemmeno}",
    "mente {meglio di quanto parli|con la stessa facilità con cui respira|solo quando serve|a tutti tranne se stesso}",
    "apre {qualsiasi serratura|porte che dovrebbero restare chiuse|vie che altri non vedono} dato abbastanza tempo",
    "sparisce {quando serve|meglio di chiunque|lasciando solo debiti|prima che arrivi il conto}",
    "si muove {senza fare rumore|nell'ombra|dove non dovrebbe|come se fosse invisibile}",
    
    // Conoscenza e informazioni
    "sa cose che {si trovano solo nei libri proibiti|altri pagano per sapere|non dovrebbe sapere|potrebbero ucciderlo}",
    "trova {chiunque|qualsiasi cosa|risposte|vie d'uscita}, dato abbastanza {tempo|oro|motivazione}",
    "raccoglie {informazioni|voci|segreti|debiti} per {chi paga|quando serviranno|abitudine|sopravvivere}",
    "conosce {i segreti|le vie|i punti deboli|i prezzi} di {questa città|troppa gente|chi comanda|ogni taverna}",
    "vende {segreti|informazioni|menzogne|verità pericolose} al {miglior offerente|prezzo giusto|momento giusto}",
    
    // Artigianato e commercio
    "forgia {armi|armature|strumenti|gioielli} {che non si spezzano|di rara fattura|che vende a caro prezzo|per pochi clienti}",
    "cucina {piatti|intrugli|rimedi|veleni} che {nessuno dimentica|hanno effetti interessanti|guariscono o uccidono}",
    "commercia in {favori|debiti|oggetti rari|merci proibite} che {valgono più dell'oro|altri non toccano|un giorno serviranno}",
    "costruisce {trappole|congegni|protesi|strumenti} che {funzionano sempre|sorprendono|nessun altro sa fare}",
    "falsifica {qualsiasi documento|sigilli|identità|monete|opere d'arte} {meglio degli originali|senza lasciare tracce}",
    
    // Guarigione e veleni
    "guarisce {chi può pagare|chi ne ha bisogno|con metodi non ortodossi|ferite che altri non toccano}",
    "conosce {veleni|erbe|sostanze|rimedi} che {possono salvare o uccidere|non si trovano nei libri|altri temono}",
    "sa {estrarre frecce|cucire ferite|riattaccare dita|fermare il sangue} {senza strumenti|meglio di un chirurgo|in silenzio}",
    "prepara {antidoti|pozioni|unguenti|tinture} per {chi paga|chi ne ha bisogno|se stesso}",
    
    // Magia e soprannaturale
    "ha imparato {la magia|l'arcano|arti proibite|rituali antichi} {senza maestri|da chi non doveva|a caro prezzo|in segreto}",
    "legge {le stelle|i segni|le carte|le ossa|i sogni} e {a volte dicono la verità|chi ascolta paga|qualcosa risponde}",
    "scaccia {demoni|fantasmi|spiriti|creature|maledizioni} {per chi paga|dove altri non osano|senza fare domande}",
    "parla con {i morti|gli spiriti|cose che non dovrebbero rispondere|chi non c'è più}",
    "sente {bugie|paura|magia|il pericolo} come {altri sentono il vento|un istinto|una maledizione}",
    
    // Animali e natura
    "doma {cavalli|lupi|falchi|bestie|creature} che {altri temono|nessuno vuole avvicinare|mordono chi non conoscono}",
    "vive {nei boschi|nelle paludi|nelle montagne|ovunque} meglio che {in città|tra la gente|al chiuso}",
    "caccia {per sopravvivere|su commissione|cose che cacciano gli altri|ciò che non dovrebbe esistere}",
    "segue tracce {vecchie di giorni|invisibili ad altri|attraverso qualsiasi terreno|come se brillassero}",
    
    // Trasporto e navigazione
    "porta {merci|messaggi|persone|segreti} dove {altri non osano|nessuno chiede|il prezzo è alto|non dovrebbero arrivare}",
    "conosce {ogni strada|le vie segrete|i passaggi|i confini} meglio di {chi li ha costruiti|qualsiasi mappa|chi ci è nato}",
    "naviga {in tempesta|di notte|senza stelle|verso luoghi che non esistono sulle mappe}",
    "guida {carovane|fuggiaschi|merci|eserciti} attraverso {territori ostili|confini chiusi|zone di guerra}",
    
    // Intrattenimento e influenza
    "canta {storie|ballate|canzoni} che {fanno piangere i soldati|nessuno vuole sentire|raccontano troppo|aprono porte}",
    "convince {chiunque|nobili|guardie|mercanti} a fare {quasi tutto|ciò che serve|errori|eccezioni}",
    "racconta {storie|bugie|verità} che {sembrano vere|cambiano idea alla gente|nessuno dimentica}",
    "disegna {mappe|ritratti|simboli|piani} di {luoghi dimenticati|chi paga|vie segrete|fortezze}",
  ],
  
  // =============================================
  // REPUTATION SOURCES (~20 entries)
  // Introduzioni per dicerie - devono funzionare con "che + congiuntivo"
  // =============================================
  
  reputationSources: [
    "La leggenda narra che",
    "Si dice in giro che",
    "Alcuni pensano che",
    "Chi lo conosce sa che",
    "Le storie raccontano che",
    "Tutti sanno che",
    "Alcuni sospettano che",
    "Una volta qualcuno ha detto che",
    "Girano voci che",
    "C'è chi giura che",
    "I più vecchi ricordano che",
    "In certe taverne si racconta che",
    "Chi ha bevuto abbastanza dice che",
    "Qualcuno sostiene che",
    "I più informati sanno che",
    "Chi lo ha incrociato dice che",
    "Tra i mercanti si mormora che",
    "Le guardie sospettano che",
    "I bambini raccontano che",
    "Chi è sopravvissuto giura che",
  ],
  
  // =============================================
  // REPUTATION CLAIMS (~30 entries)
  // Contenuto delle dicerie - cose SPECIFICHE e memorabili
  // =============================================
  
  reputationClaims: [
    // Imprese
    "abbia {ucciso|sconfitto|ingannato|derubato} un {drago|demone|re|arcimago} {senza aiuto|per una scommessa|e sia sopravvissuto}",
    "abbia {rubato|distrutto|nascosto} {la corona|un artefatto|il tesoro|i segreti} di {un re|una gilda|un tempio|un impero}",
    "abbia attraversato {il deserto|le montagne|il mare|l'abisso} {senza acqua|da solo|in tre giorni|e sia tornato}",
    "sia {l'unica persona|il primo|l'ultimo} a essere {uscito|tornato|sopravvissuto|scappato} da {quella prigione|quella tomba|quel luogo|quella battaglia}",
    
    // Identità nascoste
    "abbia sangue {nobile|maledetto|demoniaco|reale|fatato} nelle vene",
    "sia in realtà {un nobile|un assassino|uno spia|un esiliato|qualcun altro} sotto falso nome",
    "nasconda {un altro volto|un'altra identità|un passato|cicatrici} che {nessuno sospetta|valgono una fortuna|potrebbero ucciderlo}",
    "sia {l'erede|il bastardo|il carnefice|il traditore} di {una casata|un regno|una profezia|una leggenda}",
    
    // Poteri e maledizioni
    "non {dorma|mangi|sanguini|invecchi|senta dolore} {mai davvero|come gli altri|da anni|più}",
    "possa {parlare con i morti|vedere il futuro|sentire le bugie|camminare nei sogni|sparire nell'ombra}",
    "porti {sfortuna|morte|rovina|cambiamento|guerra} a chi {gli sta vicino|si fida|lo tradisce|lo assume}",
    "abbia fatto un patto con {un demone|qualcosa di antico|la morte|chi non si nomina|forze che non comprende}",
    "sia {immune|legato|condannato|promesso} a {veleni|ferro freddo|una profezia|qualcosa di peggio}",
    
    // Crimini e nemici
    "abbia un prezzo sulla testa in {tre regni|più città di quante ammetta|luoghi che non visiterà mai|tutto il continente}",
    "abbia tradito {la propria gilda|un giuramento sacro|chi si fidava|un patto di sangue} e sia ancora vivo",
    "sia {in debito|in guerra|in affari} con {la gilda dei ladri|un culto|la corona|qualcuno di pericoloso}",
    "abbia {ucciso|derubato|umiliato|tradito} {la persona sbagliata|un potente|chi non doveva|troppa gente}",
    "conosca {il vero nome|la posizione|il punto debole|i segreti} di {un demone|chi governa|qualcosa di antico|chi lo cerca}",
    
    // Possedimenti
    "custodisca {una mappa|una chiave|un sigillo|un segreto} per {un tesoro perduto|qualcosa di pericoloso|chi sa cosa|un luogo che non esiste}",
    "possieda {un'arma|un artefatto|un libro|un anello} che {non dovrebbe esistere|altri cercano|ha una volontà propria|uccide chi lo tocca}",
    "abbia {nascosto|sepolto|perso|venduto} una fortuna in {oro|gemme|segreti|artefatti} da qualche parte",
    
    // Eventi soprannaturali
    "sia {morto|nato|cambiato} {una volta|due volte|durante un'eclissi|in circostanze impossibili}",
    "abbia visto {il futuro|la propria morte|l'altra parte|troppo} e {non ne parli|lo tormenti|aspetti}",
    "sia {stato toccato|marchiato|scelto|maledetto} da {un dio|un demone|qualcosa|la morte stessa}",
    
    // Abilità impossibili
    "non abbia mai {perso una scommessa|sbagliato un colpo|detto la verità|mostrato paura}",
    "abbia {contato|visitato|mappato|derubato} ogni {taverna|prigione|tomba|bordello} {del regno|del continente|conosciuto}",
    "conosca {il nome|la storia|il prezzo|il segreto} di {ogni veleno|ogni lama|ogni bugia|chiunque incontri}",
    "sia capace di {uccidere|sparire|entrare|uscire} da {qualsiasi luogo|qualsiasi situazione|qualsiasi prigione} senza essere visto",
  ],
  
  // =============================================
  // CURRENT STATES (~30 entries)
  // Cosa fa/cerca/vuole ADESSO il personaggio
  // Motivazioni concrete
  // =============================================
  
  currentStates: [
    // Vendetta e giustizia
    "cerca {vendetta|chi l'ha tradito|chi ha ucciso|chi deve pagare}",
    "sta dando la caccia a {un traditore|un assassino|chi gli ha preso tutto|qualcuno che non sa di essere cercato}",
    "aspetta {il momento giusto|che il bersaglio si mostri|l'occasione|la debolezza del nemico}",
    "raccoglie {prove|alleati|forze|informazioni} per {colpire|vendicarsi|rovesciare qualcuno|un piano}",
    
    // Redenzione e fuga
    "cerca {redenzione|pace|perdono|un modo per rimediare}",
    "scappa da {il proprio passato|chi lo cerca|qualcosa che si avvicina|una condanna}",
    "vuole solo {sparire|essere dimenticato|ricominciare|che lo lascino in pace}",
    "sta cercando di {dimenticare|cambiare|espiare|lasciarsi tutto alle spalle}",
    
    // Ricerca
    "cerca {risposte|qualcuno che ha perso|un luogo leggendario|una cura}",
    "sta cercando {un artefatto|un libro|una persona|una via} che {potrebbe non esistere|altri cercano|è scomparso}",
    "segue {una pista|una mappa|una voce|un sogno} verso {qualcosa|un luogo|qualcuno} che forse non esiste",
    "vuole trovare {la verità|chi gli deve qualcosa|un modo per tornare|cosa è successo davvero}",
    
    // Sopravvivenza e lavoro
    "cerca solo {oro|il prossimo lavoro|abbastanza per andarsene|un modo per sopravvivere}",
    "lavora per {chi paga|sopravvivere|nessun padrone|qualcosa di più grande}",
    "prende {qualsiasi lavoro|solo certi incarichi|ciò che capita|quello che altri rifiutano}",
    "vive {un giorno alla volta|come se non ci fosse domani|nascondendosi|ai margini}",
    
    // Protezione e segreti
    "protegge {un segreto|qualcuno|un luogo|qualcosa} che non può spiegare",
    "custodisce {una promessa|un oggetto|un'informazione|una persona} con la propria vita",
    "tiene {nascosto|al sicuro|segreto|lontano} qualcosa che altri {vogliono|cercano|pagherebbero|ucciderebbero per avere}",
    "aspetta {che qualcuno torni|un segnale|il momento giusto|istruzioni}",
    
    // Pianificazione
    "sta pianificando {qualcosa di grosso|una partenza|un colpo|un ritorno}",
    "raccoglie {favori|alleati|risorse|debiti} per {quando serviranno|qualcosa di grosso|non restare senza}",
    "sta mettendo insieme {una squadra|un piano|i pezzi|le risorse} per {un lavoro|un'impresa|vendetta|fuggire}",
    "prepara {una trappola|un tradimento|una fuga|qualcosa} da {mesi|anni|quando è arrivato}",
    
    // Esistenziale
    "non sa più {cosa cercare|chi è|perché continua|da che parte stare}",
    "si tiene {occupato|in movimento|lontano dai guai|sveglio} per non pensare",
    "aspetta {la morte|una risposta|qualcosa|senza sapere cosa}",
    "ha smesso di {cercare|sperare|fidarsi|correre} e vede cosa succede",
    
    // Debiti e obblighi
    "deve {un favore|la vita|denaro|una risposta} a qualcuno che {prima o poi verrà a riscuotere|non dimentica|è pericoloso}",
    "sta ripagando {un debito|una promessa|un torto|una vita} che non finirà mai",
  ],
  
  // =============================================
  // CURRENT CONNECTORS (~15 entries)
  // Parole che collegano la storia precedente allo stato attuale
  // =============================================
  
  currentConnectors: [
    "Ora", "Oggi", "Da allora", "Dopo tutto questo",
    "Nonostante tutto", "Per questo", "E così", "Adesso",
    "Nel frattempo", "Questi giorni", "Ultimamente",
    "Da quel giorno", "Dopo quella notte", "Da quando è successo",
    "Ormai"
  ]
};

// =============================================
// EXPORT UTILITIES
// =============================================

export const poolNames = {
  PLACES: 'places',
  ORIGINS: 'origins',
  FORMATIONS: 'formations',
  SKILLS: 'skills',
  REP_SOURCES: 'repSources',
  REP_CLAIMS: 'repClaims',
  CURRENTS: 'currents'
};

export default data;
