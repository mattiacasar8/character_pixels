// === MONSTER BACKSTORY GENERATOR - DATASET ===
// Version: 2.0 (Italian)

export const monsterBackstoryData = {

    // =============================================
    // PLACES (Luoghi mostruosi)
    // =============================================
    places: [
        "Abisso Nero", "Fossa dei Dannati", "Palude Silente", "Vulcano Spento", "Città Sommersa",
        "Foresta delle Ombre", "Laboratorio Proibito", "Dimensione del Caos", "Cimitero dei Draghi",
        "Gola dei Lamenti", "Torre dello Stregone", "Caverna di Cristallo", "Rovine di Xar",
        "Deserto di Cenere", "Isola dei Morti", "Tempio Sconsacrato", "Fogna della Capitale"
    ],

    placeDescriptors: [
        "le profondità", "le ombre", "i vapori tossici", "le rovine", "i tunnel",
        "le acque scure", "i fuochi fatui", "le ossa", "i cristalli pulsanti",
        "le macchine antiche", "i rituali", "le urla", "il silenzio", "il buio"
    ],

    // =============================================
    // ORIGIN PHRASES
    // =============================================
    originPhrases: [
        (name, place) => `${name} è emerso da ${place}`,
        (name, place) => `${name} è stato evocato a ${place}`,
        (name, place) => `${name} è nato nelle profondità di ${place}`,
        (name, place) => `${name} è stato creato in un laboratorio a ${place}`,
        (name, place) => `${name} si è risvegliato a ${place} dopo un lungo sonno`,
        (name, place) => `Le energie di ${place} hanno dato vita a ${name}`,
        (name, place) => `${name} è fuggito da ${place} distruggendo tutto`,
        (name, place) => `Una maledizione a ${place} ha trasformato un uomo in ${name}`,
        (name, place) => `${name} è caduto dalle stelle, atterrando a ${place}`,
        (name, place) => `${name} è l'ultimo sopravvissuto di ${place}`
    ],

    // =============================================
    // FORMATION PHRASES (Eventi mostruosi)
    // =============================================
    formationPhrases: [
        "ha divorato {il suo creatore|un intero villaggio|la sua stessa specie|un esercito} per {fame|rabbia|potere|gioco}",
        "è stato {torturato|modificato|potenziato|maledetto} da {stregoni|scienziati|demoni|antichi dei}",
        "ha perso {la ragione|la sua forma originale|il controllo|la memoria} a causa di {un rituale|un esperimento|una magia|un dolore}",
        "ha assorbito {anime|energia oscura|veleno|luce} fino a {esplodere|mutare|diventare ciò che è|impazzire}",
        "è stato incatenato per {secoli|millenni|ere|anni} in {una prigione|un blocco di ghiaccio|una runa|un incubo}",
        "ha combattuto contro {eroi|draghi|divinità|se stesso} e ha {vinto|perso un occhio|guadagnato cicatrici|imparato l'odio}",
        "ha visto {la fine del mondo|nascere le stelle|morire gli dei|cose indicibili} e {ha riso|ha pianto|è impazzito}"
    ],

    // =============================================
    // SKILL PHRASES (Abilità mostruose)
    // =============================================
    skillPhrases: [
        "sputa {acido|fuoco|veleno|ghiaccio} che {scioglie la roccia|brucia l'anima|congela il sangue|non lascia scampo}",
        "si muove {nell'ombra|attraverso i muri|più veloce del vento|senza fare rumore} per {colpire|fuggire|cacciare}",
        "può {leggere le menti|controllare i sogni|piegare la volontà|vedere il futuro} delle sue prede",
        "rigenera {le ferite|gli arti perduti|la pelle|le ossa} in {pochi secondi|un batter d'occhio|modo innaturale}",
        "emette {un urlo|un ronzio|una luce|un odore} che {paralizza|uccide|confonde|attira} chiunque sia vicino",
        "muta {forma|colore|dimensione|consistenza} per {ingannare|nascondersi|adattarsi|spaventare}",
        "comanda {i morti|gli insetti|le ombre|le bestie} con {il pensiero|un gesto|un suono|la paura}"
    ],

    // =============================================
    // REPUTATION SOURCES
    // =============================================
    reputationSources: [
        "Le leggende dicono che",
        "I contadini sussurrano che",
        "Gli antichi testi narrano che",
        "I sopravvissuti giurano che",
        "Si teme che",
        "C'è chi dice che",
        "Nelle taverne si racconta che",
        "I saggi avvertono che",
        "Le madri spaventano i figli dicendo che"
    ],

    // =============================================
    // REPUTATION CLAIMS
    // =============================================
    reputationClaims: [
        "sia {immortale|invulnerabile|un dio caduto|il male puro}",
        "cerchi {un modo per morire|il suo cuore perduto|vendetta|di spegnere il sole}",
        "abbia distrutto {interi regni|civiltà perdute|l'antica luna|i suoi stessi figli}",
        "nasconda {un tesoro|un segreto|una porta per l'inferno|l'anima del mondo} nel suo corpo",
        "possa essere ucciso solo da {una lama d'argento|un bacio|una lacrima|chi non ha paura}",
        "sia l'araldo di {una nuova era|la fine dei tempi|un dio oscuro|una pestilenza}",
        "pianga {sangue|acido|diamanti|fiamme} quando {uccide|dorme|guarda la luna}"
    ],

    // =============================================
    // CURRENT STATES
    // =============================================
    currentStates: [
        "ora {dorme|attende|si nasconde|cresce} in attesa del risveglio",
        "vaga per {le terre desolate|il mondo|i sogni|le rovine} in cerca di {cibo|pace|una fine|compagnia}",
        "costruisce {un nido|un esercito|un impero|un monumento} con {ossa|anime|pietre|rifiuti}",
        "protegge {un uovo|un portale|un fiore|un ricordo} da chiunque si avvicini",
        "caccia {senza sosta|per sport|per fame|per noia} tutto ciò che respira",
        "cerca di {ricordare chi era|tornare umano|capire il mondo|trovare un simile}",
        "serve {un padrone oscuro|un istinto cieco|una profezia|il caos} senza fare domande"
    ],

    // =============================================
    // CURRENT CONNECTORS
    // =============================================
    currentConnectors: [
        "Adesso", "Oggi", "Da allora", "In questo momento",
        "Nelle notti senza luna", "Sotto la montagna", "Nel buio"
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
