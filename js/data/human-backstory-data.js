// === BACKSTORY GENERATOR - EXPANDED DATASET ===
// Version: 3.0
// Last updated: 2026
//
// GUIDELINES:
// - Linguaggio neutro (no accordi di genere)
// - Azioni concrete, non etichette
// - Oggetti specifici, non vaghi
// - Luoghi senza articoli
// - No meta-narrazione
//
// GRAMMAR CONCORDANCE:
// Every option inside {a|b|c} MUST agree with surrounding text:
// - Gender: "in una {locanda|chiesa}" OK, "in una {porto}" WRONG
// - Number: "dei {nemici|alleati}" OK, "dei {nemico}" WRONG
// - Preposition articles: "nella {foresta|palude}" OK, "nella {deserto}" WRONG

export const data = {

  // =============================================
  // PLACES (~110 entries)
  // Mix di suoni: nordico, mediterraneo, orientale, generico fantasy
  // NO articoli (evita "a le", "di il")
  // =============================================

  places: [
    // Nordico/Germanico
    "Thornwall", "Grimhold", "Frostmere", "Ashford", "Ironvale",
    "Blackmoor", "Stormwatch", "Ravenscar", "Winterfell", "Greystone",
    "Dunharrow", "Whitecliff", "Shadowfen", "Coldwater", "Highgarden",
    "Wolfreach", "Duskholm", "Nordhaven", "Stonemark", "Barrowfield",
    "Gallowmere", "Farholt", "Kingsfall", "Moorgate", "Wyrmthorn",
    "Brindlewick", "Dreadmarsh", "Helm's Breach", "Nighthollow", "Ironbend",

    // Mediterraneo/Latino
    "Valdoria", "Porto Grigio", "Solmara", "Pietralunga", "Acquanera",
    "Rocca Nera", "Ponte Vecchio", "Tornalta", "Campofalco", "Selvafredda",
    "Costabruna", "Villachiara", "Montespino", "Fondovalle", "Altomare",
    "Serra Rossa", "Cala Scura", "Terravecchia", "Campo Morto", "Vallebruna",
    "Pietra Cava", "Borgo Lungo", "Costa Salata", "Monte Cenere", "Fosso Nero",
    "Riva Storta", "Passo Stretto", "Torre Grigia", "Porto Antico", "Selva Amara",

    // Orientale/Esotico
    "Karveth", "Zar'khan", "Vornheim", "Ashkar", "Myr'then",
    "Khalindra", "Vor'nash", "Thal'mera", "Sandoral", "Oasis Prime",
    "Zul'kara", "Nhar'zuul", "Tal Vashir", "Qar'moth", "Shen'dai",
    "Ash'valen", "Drak'mora", "Kor'thane", "Sul'ravesh", "Mir'kazan",

    // Generico/Descrittivo
    "un villaggio senza nome", "una citta portuale", "un avamposto dimenticato",
    "un monastero in rovina", "una fortezza abbandonata", "un crocevia malfamato",
    "un porto di contrabbandieri", "una miniera esaurita", "un campo profughi",
    "una torre di guardia isolata", "un mercato ambulante", "un rifugio sotterraneo",
    "un avamposto di frontiera", "una colonia penale", "un accampamento nomade",
    "un relitto arenato", "una stazione di posta", "un villaggio bruciato",
    "un tempio sconsacrato", "una locanda ai confini"
  ],

  // =============================================
  // PLACE DESCRIPTORS (~55 entries)
  // Usati per costruzioni tipo "tra [descriptor] di [place]"
  // =============================================

  placeDescriptors: [
    "i vicoli", "le strade polverose", "le ombre", "i mercati",
    "le nebbie", "le taverne", "i bassifondi", "le torri",
    "i templi abbandonati", "le miniere", "i campi", "i moli",
    "le fogne", "i tetti", "le cantine", "i magazzini", "le rovine",
    "le mura", "i bordelli", "le prigioni", "i cimiteri", "le arene",
    "i cantieri navali", "le fucine", "i quartieri poveri",
    "i granai", "le piazze", "i sotterranei", "le botteghe", "i fossi",
    "le caserme", "i ponti", "le cisterne", "i cortili", "le cappelle",
    "i fondaci", "le scale", "i portici", "le volte", "i pozzi",
    "le stalle", "i bastioni", "le banchine", "i forni", "le concerie",
    "i macelli", "le manifatture", "i depositi", "le baracche",
    "i dormitori", "le rimesse", "i passaggi coperti", "le discariche",
    "i canali", "le palizzate"
  ],

  // =============================================
  // ORIGIN PHRASES (~55 entries)
  // Funzioni che ricevono (name, place) e ritornano stringa
  // Usare {a|b|c} per varianti interne
  // =============================================

  originPhrases: [
    // Semplici
    (name, place) => `${name} viene da ${place}`,
    (name, place) => `${name} ha passato l'infanzia a ${place}`,
    (name, place) => `${name} ha lasciato ${place} {anni fa|molto tempo fa|quando era giovane}`,
    (name, place) => `${name} ha vissuto a ${place} {per anni|abbastanza a lungo|troppo a lungo}`,

    // Con dettaglio temporale
    (name, place) => `${name} ha passato {l'infanzia|i primi anni|troppo tempo|meta della vita} a ${place}`,
    (name, place) => `${name} ha raggiunto ${place} {senza niente|in fuga|cercando rifugio|per caso|seguendo una voce}`,
    (name, place) => `${name} ha {abbandonato|lasciato} ${place} {anni fa|una notte|senza voltarsi|lasciando tutto}`,
    (name, place) => `${name} ha lasciato ${place} {di corsa|in silenzio|portando solo un pugnale|con una promessa da mantenere}`,

    // Con ambiente
    (name, place) => `Le {strade|ombre|notti|piogge|guerre} di ${place} hanno {forgiato|segnato|indurito|cambiato} ${name}`,
    (name, place) => `${name} ha trovato {rifugio|lavoro|guai|nemici|amici} a ${place}`,
    (name, place) => `${name} ricorda {poco|troppo|solo il peggio|solo il sangue|ogni dettaglio} di ${place}`,
    (name, place) => `Il {freddo|fango|fumo|silenzio|rumore} di ${place} ha {segnato|accompagnato|perseguitato} ${name} per anni`,
    (name, place) => `${name} ha passato a ${place} gli anni {peggiori|migliori|piu difficili|che contano}`,

    // Con mistero
    (name, place) => `Nessuno sa {da quanto|perche|come|quando} ${name} {viva|sia a|lavori a|si nasconda a} ${place}`,
    (name, place) => `${name} non parla mai di ${place}, ma {viene da li|qualcosa lo lega a quel posto|li ha lasciato qualcosa|porta ancora le cicatrici}`,
    (name, place) => `A ${place}, ${name} era {nessuno|qualcun altro|gia nei guai|conosciuto con un altro nome}`,
    (name, place) => `${name} ha {un conto aperto|affari incompiuti|una storia taciuta|qualcosa di sepolto} a ${place}`,
    (name, place) => `Chi ha conosciuto ${name} a ${place} {non lo riconoscerebbe|racconta storie diverse|preferisce non parlarne}`,

    // Con azione
    (name, place) => `${name} ha {bruciato i ponti|sepolto il passato|cambiato nome} quando ha lasciato ${place}`,
    (name, place) => `Prima di arrivare a ${place}, ${name} era {nessuno|un fantasma|in fuga|dato per morto}`,
    (name, place) => `${name} ha {ereditato|rubato|comprato|vinto} un posto a ${place}`,
    (name, place) => `${name} ha {attraversato|raggiunto|trovato} ${place} dopo {settimane di cammino|un naufragio|una fuga|aver perso tutto}`,
    (name, place) => `${name} ha messo piede a ${place} {senza un soldo|con una lama|con un nome falso|cercando qualcuno}`,

    // Con conseguenza
    (name, place) => `${place} ha {cacciato|accolto|tradito|dimenticato} ${name}`,
    (name, place) => `${name} ha giurato di non tornare mai a ${place}`,
    (name, place) => `${name} sogna ancora {le strade|i volti|le fiamme|il sangue} di ${place}`,
    (name, place) => `${name} porta {una cicatrice|un ricordo|un debito|un rancore} da ${place}`,
    (name, place) => `${place} ha dato a ${name} {una lezione|una cicatrice|un nemico|un motivo per andarsene}`,

    // Specifiche
    (name, place) => `${name} ha visto la luce in {una prigione|un bordello|una carovana|un campo di battaglia} vicino a ${place}`,
    (name, place) => `${name} ha perso {la famiglia|tutto|la memoria|un braccio} a ${place}`,
    (name, place) => `${name} deve la vita a qualcuno di ${place}`,
    (name, place) => `${name} ha {un debito|un nemico|una tomba|un segreto} a ${place}`,
    (name, place) => `${name} ha {comprato|guadagnato|rubato} la liberta a ${place}`,
    (name, place) => `${name} ha subito {un tradimento|una condanna|un torto|una perdita} a ${place}`,

    // Nuove - Relazionali
    (name, place) => `${name} ha seguito {un maestro|una promessa|una voce|un debito} fino a ${place}`,
    (name, place) => `${name} ha perso qualcuno a ${place} e {non se ne va|non dimentica|aspetta ancora}`,
    (name, place) => `A ${place}, ${name} ha {imparato a mentire|smesso di fidarsi|capito come funziona il mondo|trovato un motivo}`,
    (name, place) => `${name} ha lavorato {nei campi|ai moli|nelle miniere|nelle cucine} di ${place} per {anni|troppo tempo|pagare un debito}`,

    // Nuove - Con contesto
    (name, place) => `${name} conosce ${place} meglio di {chi ci governa|qualsiasi mappa|chi ci vive}`,
    (name, place) => `${name} ha visto ${place} {bruciare|cadere|cambiare|rinascere} e {non dimentica|porta le cicatrici|vuole tornare}`,
    (name, place) => `${place} non {vuole|accetta|tollera|ricorda} ${name}, ma ${name} {non se ne va|continua a tornare|non ha scelta}`,
    (name, place) => `${name} ha {costruito|perso|abbandonato} una vita a ${place}`,
    (name, place) => `${name} era {rispettato|temuto|ignorato|disprezzato} a ${place}, prima di {andarsene|sparire|perdere tutto}`,

    // Nuove - Drammatiche
    (name, place) => `L'ultima volta che ${name} ha visto ${place}, {c'erano fiamme|pioveva sangue|qualcuno moriva|tutto crollava}`,
    (name, place) => `${name} ha {pagato caro|sofferto|rischiato la vita} per lasciare ${place}`,
    (name, place) => `Quando ${name} ha lasciato ${place}, {nessuno ha chiesto perche|non c'era piu nulla da salvare|era troppo tardi}`,
    (name, place) => `${name} porta il {marchio|ricordo|peso|sapore} di ${place} ovunque vada`,
    (name, place) => `${name} ha {giurato|promesso|deciso} che ${place} non avrebbe avuto l'ultima parola`,

    // Nuove - Ambigue
    (name, place) => `${name} dice di venire da ${place}, ma {chi lo verifica|nessuno ci crede|i dettagli non tornano}`,
    (name, place) => `A ${place} qualcuno aspetta ancora che ${name} {torni|paghi|mantenga una promessa|si faccia vivo}`,
    (name, place) => `${name} ha lasciato a ${place} {un nome|una reputazione|dei debiti|dei nemici} che {non vuole riprendere|lo perseguono|un giorno torneranno}`,
    (name, place) => `${name} ha {dormito|combattuto|sofferto|rubato} abbastanza a ${place} da {conoscerne ogni angolo|non volerci piu tornare|sapere quando andarsene}`,
    (name, place) => `Ogni volta che qualcuno nomina ${place}, ${name} {cambia discorso|stringe i pugni|smette di parlare|tocca una vecchia cicatrice}`,
  ],

  // =============================================
  // FORMATION PHRASES (~75 entries)
  // Eventi che hanno formato il personaggio
  // Usare oggetti e situazioni CONCRETE
  // =============================================

  formationPhrases: [
    // Perdite concrete
    "ha perso {la famiglia|un fratello|un figlio|un maestro|l'unico amico} in {una notte|un incendio|una guerra|un'epidemia|un tradimento}",
    "ha visto morire {il proprio maestro|chi lo ha cresciuto|l'unica persona di cui si fidava|un innocente} davanti ai propri occhi",
    "ha perso {un occhio|una mano|tre dita|l'udito da un orecchio|la voce per un anno} per {una lama|un incantesimo|un morso|proteggere qualcuno}",
    "ha seppellito {un figlio|un compagno|un amante|il proprio passato} e non ne parla",
    "ha visto {bruciare|crollare|affondare|cadere} {una casa|una nave|una torre|un tempio} con {qualcuno|chi amava|tutto|l'intera vita} dentro",
    "ha perso {la vista da un occhio|l'uso di una mano|la sensibilita in un braccio|due dita della mano sinistra} in {una rissa|un crollo|una tortura|un incidente}",
    "ha assistito alla morte di {un intero villaggio|una compagnia|un equipaggio|tutti quelli che conosceva} senza poter fare nulla",
    "ha tenuto {un amico|un compagno|un maestro|un figlio} tra le braccia mentre {moriva|perdeva sangue|chiedeva aiuto|smetteva di respirare}",

    // Tradimenti e inganni
    "ha visto tradire {un giuramento sacro|la propria gilda|un patto di sangue|chi non se lo meritava}",
    "ha subito un tradimento da {un parente|un amico|un amante|chi doveva offrire protezione} per {oro|potere|paura|vendetta}",
    "ha scoperto che {il proprio mentore|un vecchio amico|chi lo ha cresciuto} {mentiva da sempre|era il nemico|lo usava}",
    "ha tradito {un giuramento|una gilda|un amico|un signore} per {sopravvivere|proteggere qualcuno|oro|paura}",
    "ha scoperto che {la propria famiglia|la gilda|il proprio signore|chi pagava} {era dalla parte sbagliata|mentiva|usava tutti}",
    "ha creduto a {una promessa|un alleato|un patto|una lettera} e ha pagato {caro|con il sangue|con anni di liberta|con tutto}",
    "ha consegnato {un amico|un compagno|un innocente|qualcuno che si fidava} a {un nemico|la giustizia|una morte certa} per {ordini|ricatto|paura|denaro}",
    "ha scoperto troppo tardi che {il lavoro|l'incarico|la missione|il patto} era {una trappola|un inganno|una condanna|un tradimento}",

    // Patti e segreti
    "ha stretto un patto {di sangue|con un demone|con una strega|che non puo rompere} di cui non parla",
    "ha scoperto un segreto che {costa vite|altri hanno pagato caro|vale una fortuna|doveva restare sepolto}",
    "ha fatto una promessa a {un morente|un fantasma|un nemico|se stesso} che intende mantenere",
    "conosce {la verita|l'ubicazione|il nome vero|il punto debole} di qualcosa che altri cercano",
    "ha firmato {un contratto|un patto|un accordo|un giuramento} con {il proprio sangue|inchiostro nero|una stretta di mano|parole che non si possono ritirare}",
    "custodisce {un messaggio|una mappa|una formula|un nome} che {vale piu dell'oro|potrebbe rovesciare un regno|qualcuno vuole distrutto|non capisce ancora}",
    "ha giurato {silenzio|fedelta|vendetta|obbedienza} a {un ordine|una causa|un morente|qualcuno che non ha mai visto}",
    "porta {un sigillo|un marchio|un tatuaggio|una cicatrice} che {apre porte|chiude discorsi|significa qualcosa che non vuole spiegare}",

    // Crimini e violenza
    "ha {ucciso|risparmiato} {per la prima volta|senza esitare|per proteggere qualcuno|per sbaglio} e non lo dimentica",
    "ha rubato {un antico artefatto|un tomo proibito|un sigillo reale|un pugnale maledetto} da {un tempio|una tomba|un nobile|un mago}",
    "ha {bruciato|distrutto|raso al suolo} {un villaggio|una nave|un raccolto|una biblioteca} per {ordini|vendetta|denaro|errore}",
    "ha {liberato|catturato|eliminato} qualcuno che {non doveva|meritava di peggio|era innocente|lo perseguita ancora}",
    "ha piantato un {pugnale|coltello|veleno|tradimento} nella schiena di {un alleato|un amico|un padrone|chi si fidava} e {non se ne pente|ci pensa ogni notte|lo rifarebbe|ne porta il peso}",
    "ha {saccheggiato|svuotato|dato fuoco a} {una carovana|un magazzino|una tomba|una cappella} per {fame|ordini|avidita|disperazione}",
    "ha {falsificato|rubato|distrutto} {un documento|un testamento|una lettera|un contratto} che ha {rovinato|salvato|condannato} qualcuno",
    "ha colpito {un nobile|una guardia|un sacerdote|chi non doveva} e da allora {ha un prezzo sulla testa|non dorme tranquillo|cambia citta|guarda dietro le spalle}",

    // Sopravvivenza
    "ha imparato a sopravvivere {rubando|combattendo|mentendo|nascondendosi|vendendo informazioni}",
    "ha passato {un anno|tre inverni|troppo tempo} in {una prigione|una miniera|catene|esilio}",
    "ha resistito a {un naufragio|un'epidemia|un massacro|un rituale fallito|una condanna a morte}",
    "ha camminato per {settimane|mesi} attraverso {un deserto|una palude|montagne|terre maledette} senza sapere se sarebbe arrivato",
    "ha mangiato {topi|insetti|radici|cuoio bollito} per {settimane|mesi|un intero inverno|non morire}",
    "ha dormito {per terra|sotto i ponti|nelle fogne|all'addiaccio} per {anni|troppo tempo|tutta l'infanzia|non avere scelta}",
    "ha lavorato in {una miniera|una galera|un'arena|una conceria} fino a {crollare|guadagnare la liberta|scappare|non sentire piu le mani}",
    "ha bevuto acqua da {pozzanghere|fiumi torbidi|cisterne arrugginite|fonti avvelenate} pur di {sopravvivere|arrivare|non fermarsi}",

    // Apprendimento
    "ha imparato {a combattere|a leggere|un mestiere|la magia} da {un esiliato|un prigioniero|un nemico|un morente}",
    "ha trovato {un maestro|una guida|uno scopo|una famiglia} tra {mercenari|ladri|monaci|stranieri}",
    "ha studiato {in segreto|per anni|sotto falso nome|testi proibiti} qualcosa che non doveva",
    "ha scoperto di avere {un talento|un dono|una maledizione|un legame} che non capisce",
    "ha imparato {a leggere le stelle|i nodi marinari|il linguaggio dei segni|la lingua dei morti} da {un vecchio|un prigioniero|un naufrago|qualcuno che non c'e piu}",
    "ha rubato {un libro|un manuale|delle pergamene|appunti segreti} e ha imparato {da solo|di nascosto|sbagliando|a caro prezzo}",
    "ha passato {anni|l'intera giovinezza|troppo tempo|ogni notte} a {osservare|copiare|esercitarsi|studiare} senza che nessuno lo sapesse",
    "ha ricevuto {un insegnamento|un avvertimento|una lezione|una tecnica} da {un condannato|un esiliato|un folle|qualcuno che nessuno ascoltava}",

    // Scelte difficili
    "ha dovuto scegliere tra {la lealta e la sopravvivenza|due persone che amava|la verita e la vita|l'onore e la famiglia}",
    "ha sacrificato {tutto cio che aveva|la propria reputazione|un amico|anni di lavoro} per {uno sconosciuto|un principio|niente}",
    "ha rifiutato {un titolo|una fortuna|un matrimonio|un ordine} e ne paga le conseguenze",
    "ha accettato {un lavoro|un patto|una missione|una maledizione} di cui si pente",
    "ha scelto {il silenzio|la fuga|il tradimento|l'obbedienza} quando avrebbe {dovuto parlare|potuto combattere|voluto restare|potuto rifiutare}",
    "ha lasciato morire {un compagno|un innocente|un amico|qualcuno} perche {non aveva scelta|era un ordine|aveva paura|non c'era tempo}",
    "ha rinunciato a {una vita normale|un amore|un nome|un futuro} per {un giuramento|una vendetta|proteggere qualcuno|un debito}",
    "ha dato {la propria parola|un anello|una promessa|un figlio} in cambio di {liberta|protezione|informazioni|tempo}",

    // Trasformazioni
    "ha cambiato {nome|volto|lealta|fede} almeno {una volta|tre volte|piu di quanto ammetta}",
    "ha abbandonato {una fede|un giuramento|una vita|tutto} per {ricominciare|vendetta|amore|paura}",
    "ha perso {la fede|la speranza|la fiducia|la paura} dopo {quella notte|quel giorno|l'ultimo inverno}",
    "ha {costruito|perso|ricostruito} tutto {piu di una volta|da zero|senza aiuto}",
    "ha smesso di {credere|pregare|sperare|sentire} dopo {la guerra|la perdita|il tradimento|quella notte}",
    "ha tagliato {i capelli|una mano|i ponti|ogni legame} come {promessa|penitenza|inizio|fine}",
    "ha bruciato {ogni lettera|il proprio diario|le prove|i vestiti} di {una vita precedente|un amore|un crimine|un'altra identita}",
    "ha camminato via da {un altare|una battaglia|una corona|un funerale} e non si e voltato",

    // Relazioni
    "ha amato {una volta sola|la persona sbagliata|senza essere ricambiato|e perso}",
    "ha cresciuto {un orfano|un animale|un allievo} che ora {non si trova piu|non c'e piu|lo odia|e tutto cio che ha}",
    "deve la vita a {un nemico|uno sconosciuto|qualcuno che ora non c'e piu|chi meno se lo aspettava}",
    "ha perdonato {chi non lo meritava|un tradimento|un torto imperdonabile|troppo} e se ne pente",
    "ha mandato via {l'unica persona|un figlio|un compagno|un amico} per {proteggerlo|orgoglio|paura|un segreto}",
    "ha promesso a {un morente|un figlio|un amico|se stesso} qualcosa che {non riesce a mantenere|costa piu del previsto|lo tiene sveglio la notte}",
    "ha trovato {un compagno|un cane|un cavallo|un corvo} che ora {e l'unica compagnia|vale piu di qualsiasi persona|non lo lascia mai|porta lo stesso nome di chi ha perso}",
  ],

  // =============================================
  // SKILL PHRASES (~85 entries)
  // Cosa SA FARE il personaggio (azioni, non etichette)
  // Evitare "e un X" - preferire "fa X"
  // =============================================

  skillPhrases: [
    // Combattimento
    "combatte {senza esitazione|come se non avesse nulla da perdere|per chi paga bene|solo quando necessario|meglio di quanto sembri}",
    "usa {la spada|il pugnale|l'arco|le mani nude} come {un'estensione del corpo|pochi sanno fare|chi ha passato una vita in guerra}",
    "sa colpire {dove fa piu male|senza farsi vedere|prima che l'altro capisca|i punti vitali}",
    "ha {sconfitto|affrontato|sopravvissuto a} {piu avversari di quanti ammetta|nemici piu forti|cose che non dovrebbero esistere}",
    "tiene {un pugnale|una lama|un chiodo|un vetro affilato} dove {nessuno penserebbe|la mano arriva prima|non si vede|serve}",
    "reagisce {prima di pensare|piu in fretta della maggior parte|come un animale in trappola|senza esitare} quando {attaccato|minacciato|messo all'angolo}",
    "preferisce {colpire per primo|finire in fretta|non lasciare testimoni|combattere sporco} piuttosto che {rischiare|aspettare|essere leale|perdere}",
    "sa usare {qualsiasi cosa|un bastone|una catena|uno sgabello} come arma se {necessario|non ha scelta|la situazione lo richiede}",

    // Furto e inganno
    "ruba {senza farsi scoprire|solo da chi puo permetterselo|come respira|cose che altri non vedono neppure}",
    "mente {meglio di quanto parli|con la stessa facilita con cui respira|solo quando serve|a tutti tranne a se stesso}",
    "apre {qualsiasi serratura|porte che dovrebbero restare chiuse|vie che altri non vedono} dato abbastanza tempo",
    "sparisce {quando serve|meglio di chiunque|lasciando solo debiti|prima che arrivi il conto}",
    "si muove {senza fare rumore|nell'ombra|dove non dovrebbe|come se fosse invisibile}",
    "entra e esce da {qualsiasi stanza|edifici sorvegliati|torri|prigioni} senza che {nessuno se ne accorga|scatti un allarme|resti una traccia}",
    "cambia {accento|portamento|nome|aspetto} a seconda di {chi ha davanti|dove si trova|cosa serve|chi paga}",
    "sa quando {qualcuno mente|una guardia si distrae|una porta e debole|e il momento di andarsene}",
    "crea {false identita|documenti|alibi|distrazioni} con {pochi materiali|facilita|una precisione inquietante}",

    // Conoscenza e informazioni
    "sa cose che {si trovano solo nei libri proibiti|altri pagano per sapere|non dovrebbe sapere|potrebbero ucciderlo}",
    "trova {chiunque|qualsiasi cosa|risposte|vie d'uscita}, dato abbastanza {tempo|oro|motivazione}",
    "raccoglie {informazioni|voci|segreti|debiti} per {chi paga|quando serviranno|abitudine|sopravvivere}",
    "conosce {i segreti|le vie|i punti deboli|i prezzi} di {questa citta|troppa gente|chi comanda|ogni taverna}",
    "vende {segreti|informazioni|menzogne|verita pericolose} al {miglior offerente|prezzo giusto|momento giusto}",
    "ascolta {conversazioni|confessioni|litigi|accordi} che {non sono per le sue orecchie|altri non notano|un giorno torneranno utili}",
    "ricorda {ogni volto|ogni nome|ogni debito|ogni bugia} che {ha incrociato|gli hanno detto|ha sentito|ha visto}",
    "sa {chi comanda davvero|dove va il denaro|chi deve cosa a chi|quali porte si aprono con l'oro} in {ogni citta|ogni porto|ogni gilda|ogni corte}",
    "legge {contratti|mappe|simboli|linguaggi} che {pochi conoscono|non dovrebbero esistere|sono scritti in codice|altri non sanno decifrare}",

    // Artigianato e commercio
    "forgia {armi|armature|strumenti|gioielli} {che non si spezzano|di rara fattura|che vende a caro prezzo|per pochi clienti}",
    "cucina {piatti|intrugli|rimedi|veleni} che {nessuno dimentica|hanno effetti interessanti|guariscono o uccidono}",
    "commercia in {favori|debiti|oggetti rari|merci proibite} che {valgono piu dell'oro|altri non toccano|un giorno serviranno}",
    "costruisce {trappole|congegni|protesi|strumenti} che {funzionano sempre|sorprendono|nessun altro sa fare}",
    "falsifica {qualsiasi documento|sigilli|identita|monete|opere d'arte} {meglio degli originali|senza lasciare tracce}",
    "ripara {armi|armature|congegni|meccanismi} che {altri butterebbero|sembrano perduti|nessuno sa toccare|hanno visto troppo uso}",
    "intaglia {ossa|legno|pietra|avorio} trasformandoli in {amuleti|strumenti|armi|oggetti che qualcuno paga bene}",
    "concia {pelli|cuoio|pellicce|materiali} con {metodi antichi|tecniche che pochi conoscono|una pazienza infinita|risultati che durano generazioni}",
    "tesse {reti|stoffe|inganni|trappole} con {le proprie mani|fili sottili|materiali impossibili|una precisione che inquieta}",

    // Guarigione e veleni
    "guarisce {chi puo pagare|chi ne ha bisogno|con metodi non ortodossi|ferite che altri non toccano}",
    "conosce {veleni|erbe|sostanze|rimedi} che {possono salvare o uccidere|non si trovano nei libri|altri temono}",
    "sa {estrarre frecce|cucire ferite|riattaccare dita|fermare il sangue} {senza strumenti|meglio di un chirurgo|in silenzio}",
    "prepara {antidoti|pozioni|unguenti|tinture} per {chi paga|chi ne ha bisogno|se stesso}",
    "distingue {un veleno|un'erba|una sostanza|un fungo} dall'odore {a distanza|prima di chiunque|come altri distinguono i colori}",
    "sa come {far parlare|far dormire|far dimenticare|togliere il dolore a} chiunque usando {le erbe giuste|la dose giusta|quello che cresce ai bordi delle strade}",
    "ha {mani ferme|occhi attenti|un istinto|una pazienza} che {salvano vite|fanno la differenza|altri invidiano} quando c'e {sangue|dolore|panico|poco tempo}",
    "tratta {ferite|bruciature|fratture|avvelenamenti} con {quello che trova|mezzi improvvisati|tecniche apprese in guerra|calma assoluta}",

    // Magia e soprannaturale
    "ha imparato {la magia|l'arcano|arti proibite|rituali antichi} {senza maestri|da chi non doveva|a caro prezzo|in segreto}",
    "legge {le stelle|i segni|le carte|le ossa|i sogni} e {a volte dicono la verita|chi ascolta paga|qualcosa risponde}",
    "scaccia {demoni|fantasmi|spiriti|creature|maledizioni} {per chi paga|dove altri non osano|senza fare domande}",
    "parla con {i morti|gli spiriti|cose che non dovrebbero rispondere|chi non c'e piu}",
    "sente {bugie|paura|magia|il pericolo} come {altri sentono il vento|un istinto|una maledizione}",
    "traccia {simboli|cerchi|rune|sigilli} che {tengono lontano qualcosa|aprono passaggi|bruciano chi li tocca|pochi sanno leggere}",
    "ha {un occhio|una mano|una cicatrice|un segno} che {brilla al buio|reagisce alla magia|brucia vicino al pericolo|non appartiene a questo mondo}",
    "invoca {nomi|parole|formule|suoni} che {non dovrebbero essere pronunciati|cambiano la temperatura|fanno tremare le fiamme|attirano attenzione}",
    "percepisce {la morte|il male|la magia|l'inganno} prima che {arrivi|si manifesti|altri lo notino|sia troppo tardi}",

    // Animali e natura
    "doma {cavalli|lupi|falchi|bestie|creature} che {altri temono|nessuno vuole avvicinare|mordono chi non conoscono}",
    "vive {nei boschi|nelle paludi|nelle montagne|ovunque} meglio che {in citta|tra la gente|al chiuso}",
    "caccia {per sopravvivere|su commissione|cose che cacciano gli altri|cio che non dovrebbe esistere}",
    "segue tracce {vecchie di giorni|invisibili ad altri|attraverso qualsiasi terreno|come se brillassero}",
    "sa {quali piante|quali funghi|quali bacche|quali radici} {nutrono|avvelenano|guariscono|fanno dormire} e {non sbaglia mai|lo insegna a pochi|lo tiene per se}",
    "legge {il vento|le nuvole|il terreno|il comportamento degli animali} come {altri leggono un libro|un istinto|chi e cresciuto all'aperto|nessun altro}",
    "sopravvive {senza fuoco|senza acqua|senza riparo|senza cibo} per {giorni|settimane|quanto serve|piu di chiunque}",
    "comunica con {gli animali|i cavalli|i cani|i corvi} in un modo che {nessuno capisce|sembra innaturale|ottiene risultati|inquieta chi osserva}",

    // Trasporto e navigazione
    "porta {merci|messaggi|persone|segreti} dove {altri non osano|nessuno chiede|il prezzo e alto|non dovrebbero arrivare}",
    "conosce {ogni strada|le vie segrete|i passaggi|i confini} meglio di {chi li ha costruiti|qualsiasi mappa|chi ci e nato}",
    "naviga {in tempesta|di notte|senza stelle|verso luoghi che non esistono sulle mappe}",
    "guida {carovane|fuggiaschi|merci|eserciti} attraverso {territori ostili|confini chiusi|zone di guerra}",
    "sa {quando partire|quale strada prendere|dove nascondersi|come evitare i posti di blocco} meglio di {qualsiasi guida|chi e nato qui|una mappa aggiornata}",
    "trasporta {carichi|persone|messaggi|oggetti} che {nessuno deve vedere|pesano piu di quanto sembrino|valgono una fortuna|scottano}",
    "attraversa {confini|fiumi|montagne|deserti} come {chi lo ha fatto mille volte|se non esistessero|se avesse una mappa nella testa}",
    "conosce {ogni porto|ogni locanda|ogni rifugio|ogni scorciatoia} da qui a {Thornwall|Porto Grigio|Karveth|dove serve}",

    // Intrattenimento e influenza
    "canta {storie|ballate|canzoni} che {fanno piangere i soldati|nessuno vuole sentire|raccontano troppo|aprono porte}",
    "convince {chiunque|nobili|guardie|mercanti} a fare {quasi tutto|cio che serve|errori|eccezioni}",
    "racconta {storie|bugie|verita} che {sembrano vere|cambiano idea alla gente|nessuno dimentica}",
    "disegna {mappe|ritratti|simboli|piani} di {luoghi dimenticati|chi paga|vie segrete|fortezze}",
    "sa {calmare una rissa|accendere una folla|placare un tumulto|creare una distrazione} con {poche parole|un gesto|una canzone|il momento giusto}",
    "legge {i volti|le intenzioni|le paure|i desideri} di chi ha davanti {come un libro aperto|prima che parlino|meglio di quanto vorrebbero}",
    "gioca a {dadi|carte|scacchi|inganni} {meglio di chiunque|barando sempre|senza perdere mai|per denaro o informazioni}",
    "negozia {prezzi|patti|tregue|rilasci} con {una calma che spaventa|un sorriso|parole scelte|la pazienza di chi ha tempo}",

    // Mestieri specifici
    "sa {pilotare|manovrare|riparare|costruire} {barche|zattere|carri|slitte} con {materiali di recupero|quello che trova|le mani nude|una rapidita impressionante}",
    "scrive {lettere|contratti|testamenti|confessioni} per {chi non sa farlo|chi paga|chi ne ha bisogno|chiunque lo chieda}",
    "conta {monete|scorte|teste|uscite} piu in fretta di {chiunque|un banchiere|chi lo osserva|quanto sembri possibile}",
    "sa {accendere un fuoco|montare un campo|allestire una trappola|improvvisare un riparo} in {qualsiasi condizione|meno di un minuto|piena oscurita|silenzio totale}",
    "tira con {l'arco|la fionda|il coltello|la balestra} colpendo {bersagli|obiettivi|punti} che {altri non vedono|sembrano impossibili|richiedono mano ferma}",
  ],

  // =============================================
  // REPUTATION SOURCES (~42 entries)
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
    "C'e chi giura che",
    "I piu vecchi ricordano che",
    "In certe taverne si racconta che",
    "Chi ha bevuto abbastanza dice che",
    "Qualcuno sostiene che",
    "I piu informati sanno che",
    "Chi lo ha incrociato dice che",
    "Tra i mercanti si mormora che",
    "Le guardie sospettano che",
    "I bambini raccontano che",
    "Chi e sopravvissuto giura che",
    "Nei bassifondi si mormora che",
    "I marinai raccontano che",
    "Chi frequenta le arene sa che",
    "Dalle prigioni arrivano voci che",
    "I becchini dicono che",
    "Tra i contrabbandieri si sa che",
    "Chi lavora ai moli racconta che",
    "Le spie confermano che",
    "I soldati veterani giurano che",
    "Tra i guaritori circola la voce che",
    "Chi conosce le strade dice che",
    "I debitori sanno bene che",
    "Le prostitute sussurrano che",
    "Chi bazzica i mercati neri sa che",
    "I carcerieri raccontano che",
    "Chi viaggia di notte sa che",
    "I fabbri del quartiere dicono che",
    "Tra gli esiliati si mormora che",
    "Le vedove del porto raccontano che",
    "Chi ha provato a seguirlo dice che",
    "I mendicanti giurano che",
    "In certi circoli si sa che",
  ],

  // =============================================
  // REPUTATION CLAIMS (~65 entries)
  // Contenuto delle dicerie - cose SPECIFICHE e memorabili
  // =============================================

  reputationClaims: [
    // Imprese
    "abbia {sconfitto|ingannato|derubato} un {drago|demone|re|arcimago} {senza aiuto|per una scommessa|in circostanze impossibili}",
    "abbia {rubato|distrutto|nascosto} {la corona|un artefatto|il tesoro|i segreti} di {un re|una gilda|un tempio|un impero}",
    "abbia attraversato {il deserto|le montagne|il mare|l'abisso} {senza acqua|da solo|in tre giorni|e sia tornato}",
    "sia {l'unica persona|il primo|l'ultimo} a essere {uscito|tornato|sopravvissuto|scappato} da {quella prigione|quella tomba|quel luogo|quella battaglia}",
    "abbia {saccheggiato|svuotato|distrutto|dato fuoco a} {un arsenale|una banca|un tempio|una caserma|un magazzino reale} in una sola notte",
    "abbia {vinto|perso|truccato|interrotto} {un torneo|un duello|una gara|una scommessa} che {nessuno dimentica|ha cambiato le regole|costa ancora vite}",
    "abbia {liberato|catturato|scortato|salvato} {un prigioniero|un nobile|un mago|un condannato} da {una fortezza|una torre|una nave|un'esecuzione}",
    "abbia camminato per {tre giorni|una settimana|un mese} con {una freccia nel fianco|un braccio rotto|una ferita aperta|le mani legate} senza {fermarsi|lamentarsi|cadere}",

    // Identita nascoste
    "abbia sangue {nobile|maledetto|demoniaco|reale|fatato} nelle vene",
    "sia in realta {un nobile|un assassino|una spia|un esiliato|qualcun altro} sotto falso nome",
    "nasconda {un altro volto|un'altra identita|un passato|cicatrici} che {nessuno sospetta|valgono una fortuna|potrebbero ucciderlo}",
    "sia {l'erede|il bastardo|il carnefice|il traditore} di {una casata|un regno|una profezia|una leggenda}",
    "abbia {almeno tre|cinque|piu di dieci} {nomi|identita|vite precedenti|tombe vuote} in {altrettante citta|regni diversi|registri ufficiali}",
    "sia {la stessa persona|il fantasma|il successore|il complice} di {un criminale famoso|un eroe caduto|una leggenda|qualcuno che dovrebbe essere morto}",
    "porti {un sigillo|un tatuaggio|un marchio|una cicatrice} che lo collega a {una casata estinta|un ordine segreto|un culto|qualcosa di antico}",
    "abbia {rubato|comprato|ereditato|falsificato} {un titolo|un nome|un lignaggio|un'identita} che non gli appartiene",

    // Poteri e maledizioni
    "non {dorma|mangi|sanguini|invecchi|senta dolore} {mai davvero|come gli altri|da anni|piu}",
    "possa {parlare con i morti|vedere il futuro|sentire le bugie|camminare nei sogni|sparire nell'ombra}",
    "porti {sfortuna|morte|rovina|cambiamento|guerra} a chi {gli sta vicino|si fida|lo tradisce|lo assume}",
    "abbia fatto un patto con {un demone|qualcosa di antico|la morte|chi non si nomina|forze che non comprende}",
    "sia {immune|legato|condannato|promesso} a {veleni|ferro freddo|una profezia|qualcosa di peggio}",
    "abbia {un'ombra|un riflesso|un battito|un respiro} che {non si comporta normalmente|segue regole proprie|appare diverso|manca del tutto}",
    "sia {gia morto|nato due volte|tornato da qualche parte|non del tutto vivo} e {non lo sappia|lo nasconda|ne porti i segni}",
    "abbia {un occhio|una mano|un orecchio|una cicatrice} che {vede cose|sente cose|sa cose|reagisce} che {il resto del corpo non dovrebbe|non appartengono a questo mondo}",
    "attiri {fantasmi|guai|animali|temporali|silenzio} ovunque {vada|si fermi|dorma|resti troppo a lungo}",

    // Crimini e nemici
    "abbia un prezzo sulla testa in {tre regni|piu citta di quante ammetta|luoghi che non visitera mai|tutto il continente}",
    "abbia tradito {la propria gilda|un giuramento sacro|chi si fidava|un patto di sangue} e sia ancora vivo",
    "sia {in debito|in guerra|in affari} con {la gilda dei ladri|un culto|la corona|qualcuno di pericoloso}",
    "abbia {derubato|umiliato|tradito} {la persona sbagliata|un potente|chi non doveva|troppa gente}",
    "conosca {il vero nome|la posizione|il punto debole|i segreti} di {un demone|chi governa|qualcosa di antico|chi lo cerca}",
    "abbia {avvelenato|ricattato|ingannato|sfidato} {un nobile|un giudice|un generale|un sacerdote} e {sia ancora in piedi|la faccia franca|nessuno possa provarlo}",
    "abbia lasciato {cadaveri|debiti|nemici|rovine} in ogni {citta|porto|regno|taverna} dove {ha messo piede|ha lavorato|ha dormito}",
    "sia {ricercato|bandito|condannato|maledetto} in {almeno tre|cinque|piu di dieci} {regni|citta|gilde|templi} per {crimini diversi|lo stesso crimine|motivi che nessuno capisce}",
    "abbia {fregato|derubato|ingannato|umiliato} la {gilda dei ladri|gilda dei mercanti|guardia reale|chiesa} e {sia ancora vivo|non lo trovino|rida ancora}",

    // Possedimenti
    "custodisca {una mappa|una chiave|un sigillo|un segreto} per {un tesoro perduto|qualcosa di pericoloso|chi sa cosa|un luogo che non esiste}",
    "possieda {un'arma|un artefatto|un libro|un anello} che {non dovrebbe esistere|altri cercano|ha una volonta propria|uccide chi lo tocca}",
    "abbia {nascosto|sepolto|perso|venduto} una fortuna in {oro|gemme|segreti|artefatti} da qualche parte",
    "porti sempre {un pugnale|un anello|un amuleto|una fiala} che {non mostra a nessuno|non toglie mai|brilla al buio|ha una storia}",
    "abbia {una stanza|una cassa|un nascondiglio|un deposito} pieno di {armi|veleni|documenti|oro|ossa} che {nessuno ha mai visto|protegge con la vita|un giorno aprira}",
    "possieda {una mappa|un diario|un codice|una lettera} che {porta alla rovina|vale una fortuna|qualcuno ha ucciso per avere|non sa ancora leggere}",

    // Eventi soprannaturali
    "sia {cambiato|rinato|scomparso e tornato} {una volta|due volte|durante un'eclissi|in circostanze impossibili}",
    "abbia visto {il futuro|la propria morte|l'altra parte|troppo} e {non ne parli|lo tormenti|aspetti}",
    "sia {stato toccato|marchiato|scelto|maledetto} da {un dio|un demone|qualcosa|la morte stessa}",
    "abbia {parlato|camminato|bevuto|dormito} con {la morte|un dio|un drago|qualcosa che non ha nome} e {sia tornato|ne porti il segno|non sia piu lo stesso}",
    "abbia visto {cose|luoghi|creature|eventi} che {non dovrebbero esistere|la mente rifiuta|hanno fatto impazzire altri|non racconta}",
    "sia {tornato|sopravvissuto|scappato} da {un luogo|una dimensione|un incubo|una morte} che {non ha uscita|nessun altro ha visto|non dovrebbe essere possibile}",

    // Abilita impossibili
    "non abbia mai {perso una scommessa|sbagliato un colpo|detto la verita|mostrato paura}",
    "abbia {contato|visitato|mappato|derubato} ogni {taverna|prigione|tomba|bordello} {del regno|del continente|conosciuto}",
    "conosca {il nome|la storia|il prezzo|il segreto} di {ogni veleno|ogni lama|ogni bugia|chiunque incontri}",
    "sia capace di {sparire|entrare|uscire} da {qualsiasi luogo|qualsiasi situazione|qualsiasi prigione} senza che nessuno se ne accorga",
    "possa sopportare {qualsiasi veleno|qualsiasi dolore|qualsiasi tortura|qualsiasi freddo} senza {effetti|lamentarsi|morire|cedere}",
    "non abbia mai {dormito|pianto|sorriso|chiesto aiuto|perso un braccio di ferro} da quando {lo conoscono|e arrivato|e successo|ha fatto quel patto}",
    "sappia {il nome|il prezzo|il punto debole|l'ubicazione} di {ogni assassino|ogni guardia corrotta|ogni uscita segreta|ogni cadavere} in {questa citta|questo regno|queste terre}",
    "abbia {mangiato|bevuto|dormito|combattuto} con {un drago|un demone|la morte|un dio} e {ne parli come se fosse normale|sia ancora qui|non lo racconti a nessuno}",

    // Relazioni e debiti
    "abbia {salvato|tradito|venduto|sposato} {la figlia|il figlio|un parente|un emissario} di {un re|un signore della guerra|un capogilda|qualcuno che non perdona}",
    "abbia {giurato fedelta|rotto un patto|stretto un'alleanza|dichiarato guerra} a {un ordine|un culto|una casata|una forza} che {non dimentica|non perdona|lo cerca ancora|aspetta}",
    "sia {l'unica persona|il primo|l'ultimo} a cui {un drago|un demone|un dio|un re} abbia mai {parlato|chiesto aiuto|concesso un favore|risparmiato la vita}",
    "abbia {una taglia|una condanna|un mandato|un contratto} emesso da {tre gilde|la corona|un tempio|ogni citta dove ha messo piede} e {nessuno lo sappia|non gli importi|se ne vanti}",
    "abbia {piantato|seminato|sparso|nascosto} {trappole|veleni|segreti|informazioni false} in {mezza citta|tre regni|ogni porto|ogni taverna che frequenta}",
    "abbia vinto {una partita|un duello|una scommessa|una causa} contro {la morte|il diavolo|un dio minore|qualcosa che non dovrebbe perdere} e {ne porti il segno|lo tormenti ancora|non lo racconti}",
    "conosca {l'entrata|la parola d'ordine|il passaggio|la combinazione} di {ogni prigione|ogni camera blindata|ogni passaggio segreto|luoghi che non dovrebbero avere porte}",
  ],

  // =============================================
  // CURRENT STATES (~65 entries)
  // Cosa fa/cerca/vuole ADESSO il personaggio
  // Motivazioni concrete
  // =============================================

  currentStates: [
    // Vendetta e giustizia
    "cerca {vendetta|chi l'ha tradito|chi ha ucciso|chi deve pagare}",
    "sta dando la caccia a {un traditore|un assassino|chi gli ha preso tutto|qualcuno che non sa di essere cercato}",
    "aspetta {il momento giusto|che il bersaglio si mostri|l'occasione|la debolezza del nemico}",
    "raccoglie {prove|alleati|forze|informazioni} per {colpire|vendicarsi|rovesciare qualcuno|un piano}",
    "sta cercando {un volto|un nome|una voce|una cicatrice} che {riconoscerebbe tra mille|non riesce a dimenticare|ha visto solo una volta}",
    "conta i giorni che {mancano|servono|restano} prima di {colpire|tornare|chiudere il cerchio|mantenere la promessa}",
    "segue {una pista|un indizio|un nome|una traccia} che {si raffredda|porta lontano|altri hanno abbandonato|potrebbe essere una trappola}",
    "tiene {una lista|un conto|un registro|un diario} di {nomi|debiti|torti|morti} che {si accorcia|si allunga|non finisce mai}",

    // Redenzione e fuga
    "cerca {redenzione|pace|perdono|un modo per rimediare}",
    "scappa da {il proprio passato|chi lo cerca|qualcosa che si avvicina|una condanna}",
    "vuole solo {sparire|essere dimenticato|ricominciare|che lo lascino in pace}",
    "sta cercando di {dimenticare|cambiare|espiare|lasciarsi tutto alle spalle}",
    "cerca un posto dove {nessuno faccia domande|il passato non arrivi|ricominciare|morire in pace}",
    "evita {le citta grandi|i luoghi affollati|chi fa domande|chiunque lo riconosca}",
    "ha cambiato {nome|citta|aspetto|abitudini} {tre volte|di recente|da poco|ancora una volta} per {sfuggire|ricominciare|nascondersi|dimenticare}",
    "porta {un peso|un senso di colpa|un ricordo|un debito} che {non si alleggerisce|cresce ogni giorno|lo rallenta|non lo lascia dormire}",

    // Ricerca
    "cerca {risposte|qualcuno che ha perso|un luogo leggendario|una cura}",
    "sta cercando {un artefatto|un libro|una persona|una via} che {potrebbe non esistere|altri cercano|non si trova piu}",
    "segue {una pista|una mappa|una voce|un sogno} verso {qualcosa|un luogo|qualcuno} che forse non esiste",
    "vuole trovare {la verita|chi gli deve qualcosa|un modo per tornare|cosa e successo davvero}",
    "cerca {un ingrediente|un materiale|una formula|un testo} per {completare qualcosa|una cura|un'arma|un rituale}",
    "insegue {una leggenda|un mito|una voce|un racconto} che {potrebbe essere vera|altri hanno abbandonato|ha sentito da un morente}",
    "sta mettendo insieme {i pezzi|gli indizi|la storia|la mappa} di {un mistero|un crimine|una sparizione|qualcosa di antico}",
    "cerca {una porta|un passaggio|una chiave|un accesso} per {un luogo|una cripta|una torre|qualcosa} che {dovrebbe essere chiuso|nessuno ha trovato|non compare sulle mappe}",

    // Sopravvivenza e lavoro
    "cerca solo {oro|il prossimo lavoro|abbastanza per andarsene|un modo per sopravvivere}",
    "lavora per {chi paga|sopravvivere|nessun padrone|qualcosa di piu grande}",
    "prende {qualsiasi lavoro|solo certi incarichi|cio che capita|quello che altri rifiutano}",
    "vive {un giorno alla volta|come se non ci fosse domani|nascondendosi|ai margini}",
    "mette da parte {denaro|provviste|contatti|favori} per {quando servira|la fuga|un progetto|l'inverno}",
    "fa {il necessario|quello che serve|cio che altri non farebbero|il lavoro sporco} per {mangiare|pagare un debito|non morire|chi paga}",
    "accetta {incarichi|lavori|missioni|compiti} che {nessuno vuole|pagano bene|sono pericolosi|non richiedono domande}",
    "sopravvive {vendendo informazioni|facendo favori|rubando il necessario|con mestieri che cambiano ogni settimana}",

    // Protezione e segreti
    "protegge {un segreto|qualcuno|un luogo|qualcosa} che non puo spiegare",
    "custodisce {una promessa|un oggetto|un'informazione|una persona} con la propria vita",
    "tiene {nascosto|al sicuro|segreto|lontano} qualcosa che altri {vogliono|cercano|pagherebbero|ucciderebbero per avere}",
    "aspetta {che qualcuno torni|un segnale|il momento giusto|istruzioni}",
    "sorveglia {un luogo|una persona|un passaggio|un oggetto} senza {sapere perche|poterlo spiegare|che nessuno glielo abbia chiesto}",
    "porta con se {un carico|un messaggio|un oggetto|una chiave} che {deve consegnare|non puo aprire|brucia|qualcuno vuole}",
    "veglia su {un bambino|un segreto|una tomba|un prigioniero} che {non puo abbandonare|potrebbe essere la chiave|nessun altro proteggerebbe}",
    "nasconde {un passato|un talento|un oggetto|un'identita} per {sicurezza|abitudine|paura|un giuramento}",

    // Pianificazione
    "sta pianificando {qualcosa di grosso|una partenza|un colpo|un ritorno}",
    "raccoglie {favori|alleati|risorse|debiti} per {quando serviranno|qualcosa di grosso|non restare senza}",
    "sta mettendo insieme {una squadra|un piano|i pezzi|le risorse} per {un lavoro|un'impresa|vendetta|fuggire}",
    "prepara {una trappola|un tradimento|una fuga|qualcosa} da {mesi|anni|quando ha cominciato}",
    "studia {un bersaglio|una fortezza|un nemico|una rotta} con {pazienza|ossessione|metodo|attenzione maniacale}",
    "aspetta {il momento giusto|la luna giusta|che le guardie cambino|che qualcuno faccia un errore} per {colpire|entrare|fuggire|agire}",
    "sta costruendo {una rete|un'organizzazione|un deposito|un rifugio} per {il futuro|quando servira|proteggersi|qualcosa che non spiega}",
    "muove {pedine|persone|denaro|informazioni} come in {una partita a scacchi|un gioco che solo lui vede|preparazione|attesa}",

    // Esistenziale
    "non sa piu {cosa cercare|chi e|perche continua|da che parte stare}",
    "si tiene {occupato|in movimento|lontano dai guai|sveglio} per non pensare",
    "aspetta {la morte|una risposta|qualcosa|senza sapere cosa}",
    "ha smesso di {cercare|sperare|fidarsi|correre} e vede cosa succede",
    "beve {per dimenticare|per dormire|troppo|ogni sera} e {non lo ammette|lo sa bene|non gli importa|e l'unica cosa che funziona}",
    "cammina {senza meta|verso est|fino a stancarsi|perche fermarsi e peggio}",
    "parla {con se stesso|con i morti|con nessuno|troppo poco} e {non se ne accorge|lo sa|non gli importa|preoccupa chi lo vede}",
    "ha smesso di {fare piani|avere paura|sentire qualcosa|contare i giorni} e {va avanti|aspetta|sopravvive|si trascina}",

    // Debiti e obblighi
    "deve {un favore|la vita|denaro|una risposta} a qualcuno che {prima o poi verra a riscuotere|non dimentica|e pericoloso}",
    "sta ripagando {un debito|una promessa|un torto|una vita} che non finira mai",
    "porta a termine {un ultimo lavoro|un ultimo incarico|un'ultima consegna|una promessa} prima di {sparire|ritirarsi|andarsene|chiudere tutto}",
    "mantiene {una promessa|un patto|un obbligo|un servizio} che {non ha scelto|pesa ogni giorno|non puo rompere|lo lega a qualcuno di pericoloso}",
  ],

  // =============================================
  // CURRENT CONNECTORS (~28 entries)
  // Parole che collegano la storia precedente allo stato attuale
  // =============================================

  currentConnectors: [
    "Ora", "Oggi", "Da allora", "Dopo tutto questo",
    "Nonostante tutto", "Per questo", "E cosi", "Adesso",
    "Nel frattempo", "Questi giorni", "Ultimamente",
    "Da quel giorno", "Dopo quella notte", "Da quando e successo",
    "Ormai", "Da allora in poi", "Ancora oggi",
    "A distanza di anni", "Senza piu nulla da perdere",
    "Con quello che resta", "Dopo tutto",
    "Da quella volta", "Con il tempo",
    "Alla fine", "Col passare degli anni",
    "Da quando tutto e cambiato", "Dopo aver perso tutto",
    "Senza guardarsi indietro"
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
