// === MONSTER BACKSTORY GENERATOR - ENGLISH DATASET ===
// Version: 1.0
//
// GUIDELINES:
// - Concrete actions and objects
// - Specific descriptions, not vague ones
// - Use {a|b|c} for internal variants
// - Dark fantasy / horror tone
// - No meta-narration
//
// PREPOSITION NOTE:
// Place names include articles (the Pit, the Abyss, the Well...).
// Origin phrases use "near", "inside", "in the depths of", "through"
// to avoid preposition clashes.

export const monsterBackstoryData = {

    // =============================================
    // PLACES (~90 entries)
    // Dark, monstrous, forgotten locations
    // All with articles for horror consistency
    // =============================================
    places: [
        // Underground and abyssal
        "the Pit of the Damned", "the Black Abyss", "the Screaming Caverns", "the Bottomless Well",
        "the Cursed Mines", "the Forgotten Crypt", "the Underbelly of Karnath",
        "the Infinite Catacombs", "the Labyrinth of Flesh", "the Gorge of Bones",
        "the Whispering Chasm", "the Glass Void", "the Caves of Lament",
        "the Tunnel of Echoes", "the Mass Grave of Aldrath", "the Putrid Galleries",
        "the Well of Madness", "the Tomb of the Nameless", "the Cisterns of Blood",
        "the Dead Root Burrow",

        // Corrupted natural places
        "the Silent Swamp", "the Forest of Shadows", "the Ash Desert",
        "the Lake of Blood", "the Howling Tundra", "the Poison Jungle",
        "the Black Mountains", "the Valley of Worms", "the Dead Wood",
        "the Plain of Skulls", "the Living Glacier", "the Spore Moor",
        "the Phosphorescent Bog", "the Savanna of Cinders", "the Crawling Dunes",
        "the Tar River", "the Carnivorous Thicket", "the Canyon of Screams",
        "the Bleached Wasteland", "the Pass of Dead Ravens",

        // Ruins and artificial places
        "the Ruins of Xar", "the Sorcerer's Tower", "Morken's Laboratory",
        "the Desecrated Temple", "the Sunken City", "the Abandoned Fort",
        "the Dark Foundries", "the Forbidden Library", "the Fallen Castle",
        "the Arena of Sacrifices", "the Eternal Prison", "the Inverted Sanctuary",
        "the Bone Forges", "the Buried Cathedral", "the Wandering Mausoleum",
        "the Blind Observatory", "the Fortress of Black Glass", "Ghrendal's Slaughterhouse",
        "the Imperial Cisterns", "the Broken Dam",

        // Extraplanar and unnatural places
        "the Chaos Dimension", "the Shadow Plane", "the Void Between Worlds",
        "the Wound in the Sky", "the Blind Spot", "the Dimensional Scar",
        "the Crooked Reflection", "the Threshold of Non-Being", "the Infinite Corridor",
        "the Temporal Pocket", "the Planar Knot", "the Fold in Reality",
        "the Limbo of the Uncreated", "the Bubble of Eternal Silence",

        // Specific locations
        "the Dragon Graveyard", "the Isle of the Dead", "the Dormant Volcano",
        "the Capital's Sewer", "the Impact Crater", "the Ghost Ship",
        "the Wishing Well", "the Cavern of Black Crystal",
        "the Wreck of the Royal Vessel", "the Red Salt Mine",
        "the Dead Lighthouse of Calthera", "the Underground Market of Outcasts"
    ],

    placeDescriptors: [
        "the depths", "the shadows", "the toxic fumes", "the ruins",
        "the tunnels", "the dark waters", "the will-o'-wisps", "the bones",
        "the pulsing crystals", "the ancient machines", "the rituals",
        "the screams", "the silence", "the darkness", "the green flames",
        "the corpses", "the rusted chains", "the carved runes",
        "the dried blood", "the twisted roots",
        "the glowing spores", "the breathing walls", "the acid mist",
        "the stalactites of flesh", "the floor of bone", "the constant whispers",
        "the black pools", "the scratched symbols", "the living mould",
        "the freezing currents", "the wrong reflections", "the steel cobwebs",
        "the boiling mud", "the mirror fragments", "the bleeding carvings",
        "the weeping statues", "the pulsing fungi", "the sick light",
        "the damp walls", "the moving ground", "the deformed echoes",
        "the rusted conduits"
    ],

    // =============================================
    // ORIGIN PHRASES (~60 entries)
    // How the monster was born/created/summoned
    // NOTE: use "near", "inside", "in the depths of", "through"
    // to avoid preposition clashes with place names
    // =============================================
    originPhrases: [
        // Magical evocation and creation
        (name, place) => `${name} was summoned {by a sorcerer|during a ritual|by accident|by a cult} near ${place}`,
        (name, place) => `${name} was created in a laboratory inside ${place} {as a weapon|for revenge|out of curiosity|in a failed experiment}`,
        (name, place) => `${name} is the result of {a spell|an experiment|a pact|a fusion} that went {terribly|horribly|catastrophically} wrong near ${place}`,
        (name, place) => `The energies permeating ${place} {corrupted|mutated|awakened|merged} {an animal|a man|a beast|something} creating ${name}`,
        (name, place) => `${name} was born from {a curse|a blood ritual|an opened portal|a sacrifice} near ${place}`,
        (name, place) => `${name} was shaped by {wild magic|despair|rage} that saturated ${place}`,
        (name, place) => `${name} was invoked inside ${place} {with virgin blood|by sacrificing thirteen souls|using a forbidden tome|on the orders of the mad king}`,
        (name, place) => `${name} was conceived when a ritual near ${place} {drew something from outside|broke the barrier|opened a rift|overloaded the seals}`,

        // Awakening and emergence
        (name, place) => `${name} emerged from the depths beneath ${place} {after centuries|during an eclipse|when the seals broke|starving}`,
        (name, place) => `${name} awoke inside ${place} after {millennia|a long sleep|the end of the war|everyone forgot it}`,
        (name, place) => `${name} rose from the depths beneath ${place} {following the smell of blood|drawn by voices|called by dreams|driven by hunger}`,
        (name, place) => `${name} was freed when {an adventurer|an earthquake|a storm|curiosity} opened {the door|the seal|the cage|the tomb} inside ${place}`,
        (name, place) => `${name} broke through the walls inside ${place} {in a fit of fury|after aeons of captivity|when the moon turned red|without warning}`,
        (name, place) => `${name} crawled out from beneath ${place} {leaving a trail of slime|shattering the foundations|dissolving stone|in the dead of night}`,

        // Transformation
        (name, place) => `A curse near ${place} transformed {a king|a mage|a warrior|an entire family} into ${name}`,
        (name, place) => `${name} was {a man|a woman|a child|a priest} before ${place} {consumed|mutated|corrupted|broke} them`,
        (name, place) => `${name} is what remains of {a hero|a dragon|an angel|a city} after ${place} {digested|absorbed|transformed} it`,
        (name, place) => `${name} was born from the flesh of {a traitor|a martyr|a madman|a virgin} sacrificed near ${place}`,
        (name, place) => `The very earth beneath ${place} {birthed|vomited up|generated|expelled} ${name} {during a full moon|on a starless night|when the last guardian died}`,

        // Extraplanar origin
        (name, place) => `${name} fell {from the stars|from the sky|from another world|from a dying dimension} and landed near ${place}`,
        (name, place) => `${name} broke through into reality through ${place} when {the planes aligned|someone opened a portal|the barrier weakened}`,
        (name, place) => `${name} was {exiled|banished|expelled|hurled} from their world and imprisoned inside ${place}`,
        (name, place) => `${name} slipped through the folds of reality near ${place} when {the fabric thinned|a spell tore the veil|the dimension collapsed}`,
        (name, place) => `${name} comes from {a plane of pure darkness|a dimension of flesh|the cosmic void|a dream that became real} and materialised near ${place}`,

        // Survivor and last creature
        (name, place) => `${name} is the last {survivor|guardian|keeper|inhabitant} left near ${place} {forgotten by all|still faithful|that remembers}`,
        (name, place) => `${name} is what remains after ${place} {fell|burned|sank|was devoured}`,
        (name, place) => `${name} is the only witness of what happened inside ${place} {and bears the scars|and will no longer speak|and was warped by it}`,

        // Monstrous birth
        (name, place) => `${name} was born in the depths beneath ${place} {from a black egg|from a pool of blood|from the bowels of the earth|from a magical explosion}`,
        (name, place) => `${name} grew inside ${place} {feeding on|devouring|absorbing} {corpses|dark energy|residual magic|fear}`,
        (name, place) => `${name} formed near ${place} when {too much blood|too many souls|too much magic|too much pain} accumulated`,
        (name, place) => `${name} sprouted {like a mushroom|like a tumour|like a plague|like a root} in the bowels beneath ${place}`,
        (name, place) => `${name} coalesced {from dust and bones|from organic remains|from condensed magic|from maddened shadows} inside ${place}`,

        // Construction and assembly
        (name, place) => `${name} was {assembled|sewn together|forged|carved} from {corpse parts|dragon bones|living metal|solidified shadows} near ${place}`,
        (name, place) => `${name} was built inside ${place} as {a sentinel|a punishment|an experiment|a work of art} by {someone|something} long forgotten`,
        (name, place) => `${name} was {inscribed|carved|moulded} into living stone inside ${place} and then {the stone opened its eyes|blood began to flow|it started to move}`,
        (name, place) => `A mad craftsman forged ${name} inside ${place} using {living organs|cursed metal|crystals of pain|wood that bleeds}`,

        // Escape and destruction
        (name, place) => `${name} fled from the depths beneath ${place} {destroying everything|killing its creators|burning the cells|breaking the chains}`,
        (name, place) => `${name} was released from the bowels beneath ${place} as {a last resort|a final weapon|a punishment|revenge} against {the invaders|the world|themselves}`,
        (name, place) => `${name} broke {the seals|the chains|the walls|the cage} inside ${place} {by sheer force|thanks to an earthquake|when the guardian died|after centuries of trying}`,

        // Possession
        (name, place) => `${name} is {a demon|a spirit|an entity|a parasite} that possessed {a statue|a corpse|an animal|a relic} near ${place}`,
        (name, place) => `Something inside ${place} took control of {a beast|a golem|a guardian|a body} creating ${name}`,
        (name, place) => `${name} is the very will that animates ${place}, which became {flesh|shadow|fury|an entity} in order to {defend itself|take revenge|expand|devour}`,

        // Duplication and fragmentation
        (name, place) => `${name} is a fragment of {something greater|a dead god|an ancient creature|a collective nightmare} that broke off near ${place}`,
        (name, place) => `${name} is a {defective|maddened|mutated|evolved} copy of something created inside ${place} {long ago|as a cruel joke|by accident}`,
        (name, place) => `${name} was born from the {division|splitting|fragmentation|fission} of a larger entity inside ${place}`,

        // Corruption and contagion
        (name, place) => `${name} was {a guardian|a sentinel|a keeper|an ordinary creature} protecting ${place} before {a plague|a curse|an outside influence|madness} corrupted them`,
        (name, place) => `${name} is the first infected born inside ${place}, {patient zero|the spark|the root} that started {a plague|an epidemic|a mutation|a horror} still spreading`,
        (name, place) => `${name} was contaminated {by black waters|by ancient spores|by an artefact|by infected blood} inside ${place}`,

        // Accumulation and coalescence
        (name, place) => `${name} is the sum of {every creature that died|every trapped soul|every forgotten echo|every nightmare dreamed} inside ${place}`,
        (name, place) => `${name} condensed from the {suffering|rage|fear|despair} that had saturated ${place} for {centuries|millennia|time immemorial}`,

        // Accident and catastrophe
        (name, place) => `${name} was born from {an arcane explosion|a dimensional collapse|a magical earthquake|a critical experiment} that devastated ${place}`,
        (name, place) => `${name} emerged from the crater left when ${place} was {destroyed|razed|annihilated|devastated}, {made of animated rubble|forged from catastrophe|fuelled by residue}`,

        // Pact and debt
        (name, place) => `${name} was called near ${place} {to settle a debt|in exchange for power|as the price of a pact|to fulfil a wish} and never left`,
        (name, place) => `Someone inside ${place} struck a bargain {with the abyss|with the Void|with death itself|with something nameless} and ${name} is the result`,

        // Spontaneous evolution
        (name, place) => `${name} evolved {from the fauna|from the flora|from the parasites|from the fungi} that infest ${place} into {something terrible|a perfect predator|an abomination|an impossible life form}`,
        (name, place) => `${name} is what happens when life inside ${place} {is left alone too long|mutates unchecked|finds a new balance|turns against itself}`,
    ],

    // =============================================
    // FORMATION PHRASES (~65 entries)
    // Events that formed/transformed the monster
    // =============================================
    formationPhrases: [
        // Violence and cannibalism
        "devoured {its creator|an entire village|its own kind|one hundred and three souls|an army} {out of insatiable hunger|in a fit of rage|while they slept|slowly}",
        "massacred {a caravan|a royal family|an entire temple|those who cared for it} with {its fangs|claws|raw magic|a smile}",
        "tore {the heart|the eyes|the wings|the voice} from {an angel|a demon|its own maker|whoever had created it}",
        "drank {the blood|the tears|the life force|the essence} of {a thousand victims|a dragon|a minor god|a volcano}",
        "swallowed {an entire colony|forty soldiers|a wolf pack|the temple guard} in {one bite|a single night|less than an hour}",
        "skinned {a legendary hero|an entire order of knights|three sorcerers|its own offspring} and {wore their skin|decorated its lair|made trophies of them}",
        "crushed {an outpost|a drawbridge|a watchtower|an armoured cart} with {its own weight|a single blow|its jaws|indifference}",

        // Modifications and torture
        "was {tortured|modified|enhanced|vivisected} for {years|decades|centuries} by {mad sorcerers|cultists|a hive mind|itself}",
        "was infused with {dragon blood|pure venom|Void energy|tormented souls|living crystals} until it {exploded|mutated|transcended|imploded}",
        "underwent {seventeen rituals|a hundred grafts|countless spells|fusion with metal} that {broke it|reforged it|enlightened it|destroyed and rebuilt it}",
        "was sewn together using {fresh corpses|beast parts|dimensional fragments|materialised shadows}",
        "was {immersed|boiled|preserved|marinated} in {alchemical acid|amniotic fluid|demon blood|Void water} for {months|years|an incalculable time}",
        "was {drilled|carved|branded|pierced} with {living runes|containment seals|burning glyphs|bone needles} over every inch of its body",
        "underwent {the grafting|the fusion|the implanting|the insertion} of {a sentient parasite|a secondary heart|an alien organ|crystal spines} that {enhanced|deformed|destabilised|drove it mad}",

        // Mental losses and transformations
        "lost {its reason|its original form|control over its body|all memories|its sense of self} due to {an incomplete ritual|an inherited curse|too much pain|eternal isolation}",
        "forgot {its own name|how to die|its original form|why it exists} after {too many centuries|seeing the abyss|dying three times}",
        "went mad when it saw {the truth|infinity|everyone die|its own reflection|what lies beyond}",
        "lost {the ability to speak|short-term memory|any concept of mercy|the distinction between itself and its prey} after {yet another mutation|an unspeakable trauma|passing through the Void}",
        "lost {all emotion|the perception of time|the difference between dream and reality|its own face} and {no longer seeks it|misses it|doesn't notice}",

        // Absorption and accumulation
        "absorbed {tormented souls|negative energy|nightmare dreams|magical radiation|life itself} until it {couldn't stop|became what it is now|lost its form|glowed with darkness}",
        "incorporated {parts of every victim|fragments of reality|others' fears|echoes of battles} into its body",
        "ate {a spellbook|a cursed artefact|a lich's heart|forbidden texts|saints' ashes} and was {changed|enlightened|corrupted|enhanced} by them",
        "accumulated {toxins|residual magic|soul fragments|stolen memories} in its body until it {became venomous|radiated darkness|lost solidity|could no longer be touched}",
        "consumed {an entire ecosystem|a network of sentient fungi|a colony of parasites|the magical reserves of a tower} and {was transformed by it|inherited their properties|became like them}",

        // Imprisonment
        "was chained for {three centuries|millennia|lost ages|as long as it took} in {a dimensional prison|eternal ice|a living rune|an endless nightmare}",
        "was buried alive beneath {a mountain|a thousand tonnes of salt|divine seals|the foundations of a city} until {the chains rusted|it was forgotten|it found the strength|someone freed it}",
        "remained motionless for {centuries|aeons|beyond time} waiting {for the right moment|for the seals to fail|for revenge|for something that will never come}",
        "was locked inside {a crystal|a glass sphere|a painting|a cursed coin} and {watched the world pass by|accumulated resentment|slowly eroded its prison|went silently mad}",
        "was confined within {a salt circle|a maze with no exit|a pocket dimension|a host body} for {an eternity|too short a time|until it was forgotten}",

        // Combat
        "fought against {an entire legion|seven heroes|a minor god|itself in another dimension} and {won|lost half its body|gained scars that glow|still bears the marks}",
        "killed {its own creator|those who cared for it|the guardian|the last obstacle} with {a single blow|methodical slowness|evident joy|regret}",
        "fed on the {hearts|memories|bones|names} of {the fallen|the forgotten|the damned} in {a battle|a massacre|a ritual} that lasted {three days|a year|an eternity}",
        "survived {an execution|an extermination|a cataclysm|an attempt at purification} that {should have destroyed it|killed everyone else|made it stronger|shattered it into fragments}",
        "defeated {every hunter sent after it|an entire order of paladins|three adult dragons|an army of undead} and {made trophies of them|absorbed their strength|added them to its body}",

        // Cosmic experiences
        "witnessed {the end of the world|the birth of stars|the death of gods|the abyss between atoms|things with no name} and {laughed|wept blood|went mad|fell silent}",
        "touched {the edge of reality|a sleeping god|the source of magic|the heart of the Void} and came back {changed|broken|enlightened|empty}",
        "heard {the voice of creation|the song of entropy|whispers from beyond|its own future death} and {can no longer sleep|answered|keeps laughing|keeps repeating the words}",
        "looked {through time|into the fabric of reality|into the eyes of nothingness|beyond the event horizon} and {something looked back|was marked by it|lost its sight forever|never truly returned}",

        // Failed experiments
        "was the {first|last|only successful attempt|hundredth attempt} to {create life|achieve immortality|surpass all limits|open a portal}",
        "is the result of {a forgotten experiment|a magical war|a forbidden love|boundless ambition} that {nobody wanted|nobody could stop|destroyed those who started it}",
        "was {a prototype|a discarded model|a draft|the wrong version} of something {that shouldn't have existed|worse|later perfected|that failed anyway}",
        "was designed to {obey|protect|destroy|serve} but {the programming became corrupted|developed its own will|misunderstood the orders|decided otherwise}",

        // Fusions and assimilations
        "was fused with {a beast|a machine|an elemental|something from outside} during {a ritual|an accident|a battle|the apocalypse}",
        "assimilated {its own siblings|its own species|the guardians|its victims} until {it became a swarm|it lost individuality|it was everywhere}",
        "{merged|fused|combined|amalgamated} with {the ground|the structure|another monster|the environment} until {it could not be separated|it lost its boundaries|it became part of the place}",
        "absorbed {weapons embedded in its body|armour from fallen enemies|fragments of buildings|roots and minerals} that now {protrude from its flesh|are part of it|serve as protection}",

        // Punishments and curses
        "was cursed by {a vengeful god|those it betrayed|its last victim|itself} to {never be able to die|feel nothing but pain|remember everything|exist this way}",
        "bears the weight of {a thousand souls|an unforgivable sin|a broken prophecy|a shattered promise} that {consumes|transforms|guides|torments} it",
        "was condemned to {relive its own death|seek without finding|protect what it destroyed|devour without ever being satisfied} for {eternity|divine punishment|a cruel joke of fate}",
        "was {branded|marked|stamped|carved} with {the seal of shame|a rune of perpetual pain|the name of its sin|a glyph that burns without stopping}",

        // Death and rebirth
        "{died and rose again|was destroyed and re-formed|imploded and re-exploded|collapsed in on itself} {seven times|more times than is countable|each time differently|always more wrong}",
        "came back {from death|from the Void|from oblivion|from a nameless place} but {something was missing|it had changed|it had brought something with it|it was no longer the same}",

        // Unnatural growth
        "grew {too fast|without control|in impossible ways|far beyond all limits} until {it filled the cavern|it no longer recognised itself|it became too large to move|it collapsed and re-formed}",
        "{evolved|adapted|mutated|transformed} {every time it was wounded|with each generation|after every meal|with each new prey} until reaching {this form|predatory perfection|complete aberration}",

        // Betrayal
        "betrayed {whoever had created it|whoever was protecting it|its own pack|its only ally} {to survive|to gain power|out of hunger|out of instinct|for no comprehensible reason}",
        "was betrayed by {whoever should have protected it|its own master|an ally|its own mind} and {swore revenge|was broken|stopped trusting|devoured the traitor}",

        // Contamination
        "{infected|contaminated|corrupted|poisoned} {the earth beneath it|the water for miles around|the surrounding air|everything it touched} transforming it into {an extension of itself|hostile territory|a living nightmare}",
        "spread {spores|eggs|larvae|fragments of itself} into {every crack|the foundations|the water supply|the roots of the trees} creating {a network|an infestation|a domain|a distributed organism}",

        // Sacrifice and self-mutilation
        "{tore off|cut off|amputated|gouged out} {a limb|an eye|its heart|half its body} to {gain power|perform a ritual|escape a trap|feed its offspring}",
        "sacrificed {its own voice|its memories|its ability to feel pain|its humanoid form} in exchange for {strength|speed|immortality|a specific power}",

        // Migration and conquest
        "{emptied|exterminated|conquered|corrupted} {an entire level of caverns|a millennial forest|a tunnel network|an underground river system} making it {its domain|a desert|a graveyard|a nest}",
        "migrated through {three continents|thousands of kilometres of underground|parallel dimensions|different ages} leaving {destruction|a bloodline|legends|scars in the earth} everywhere",
    ],

    // =============================================
    // SKILL PHRASES (~72 entries)
    // What the monster CAN DO - concrete abilities
    // =============================================
    skillPhrases: [
        // Elemental attacks
        "spits {black acid|blue flame|boiling ice|necrotic vapours|lightning} that {dissolves stone|burns the soul|freezes time|devours light}",
        "emanates {lethal cold|infernal heat|radiation|an aura of despair} that {kills plants|evaporates blood|corrupts flesh|extinguishes flames}",
        "breathes {toxic mist|paralysing spores|clouds of insects|air so pure it burns} on {anyone who approaches|whoever dares look at it|the battlefield}",
        "generates {electrical discharges|heat waves|sonic pulses|black light explosions} that {shatter matter|cook flesh|silence every sound|nullify magic}",
        "projects {bone spines|crystal shards|jets of boiling blood|fragments of its own body} at {its prey|anything that moves|everything that lives}",

        // Movement and stealth
        "moves {in shadow|through walls|faster than sound|without touching the ground|between reflections} to {strike from behind|escape|follow|confuse}",
        "can {burrow|swim|fly|glide|teleport} through {solid rock|lava|the void|dimensions} as if it were {air|water|nothing}",
        "vanishes {when you look directly at it|into fog|around a corner|between one heartbeat and the next} and reappears {behind you|where you least expect|in your nightmares}",
        "hunts {in absolute silence|by emitting ultrasound|following the smell of fear|sensing heartbeats} {from miles away|through walls|in total darkness|without ever resting}",
        "crawls on {walls|ceilings|vertical surfaces|liquids} without effort and {without making a sound|leaving a viscous trail|at unnatural speed}",
        "moves through {shadows|reflections|cracks in walls|mirrors} as if they were {doors|corridors|shortcuts} reaching {any dark place|its victim wherever they are|impossible locations}",

        // Mental manipulation
        "can {read minds|control dreams|bend wills|steal memories|insert thoughts} in {anyone who looks at it|those who are alone|its prey|sleeping victims}",
        "whispers {promises|truths|lies|secrets} directly into the mind until {reason breaks|it gains obedience|it drives them mad|it convinces}",
        "shows {visions|nightmares|desires|the future|the forgotten past} to whoever {touches it|hears its voice|enters its territory}",
        "erases {memories|the sense of self|willpower|fear} in its victims {with a touch|with a look|with a sound|slowly} leaving them {empty|obedient|catatonic|smiling}",
        "projects {its own suffering|pure terror|death memories|madness} into the mind of whoever {gets close|wounds it|looks into its eyes|speaks its name}",

        // Regeneration and adaptation
        "regenerates {wounds|lost limbs|skin|organs|even its head} in {seconds|the blink of an eye|an unnatural and painful way to watch}",
        "cannot be killed by {normal weapons|fire|drowning|decapitation|anything that has been tried so far}",
        "adapts to {the environment|the weapons used against it|pain|magic} becoming {immune|stronger|faster|resistant}",
        "heals by feeding on {living flesh|fear|others' pain|moonlight|spilled blood}",
        "rebuilds {its own body|tissues|bones|structure} using {surrounding material|its victims|debris|any organic matter} when damaged",
        "every wound inflicted {closes in seconds|generates a new limb|makes it larger|releases a corrosive liquid} making {fighting it pointless|every attack counterproductive|the situation worse}",

        // Sounds and vibrations
        "emits {a scream|a hum|a deep note|absolute silence} that {paralyses|kills|confuses|petrifies} anyone within {a hundred paces|earshot|the valley}",
        "shakes the ground with {its heartbeat|its every breath|its weight|its mere presence} {unsettling the earth|breaking bones|disintegrating stone}",
        "sings with {a thousand voices|the voices of the dead|a hypnotic melody|impossible frequencies} that {attract|kill|send to sleep|drive mad}",
        "produces {a constant hum|a crackle of bones|a metallic hiss|white noise} that {makes it impossible to think|causes nausea|makes ears bleed|drowns out every other sound}",

        // Metamorphosis
        "changes {form|colour|size|consistency|number of limbs} to {deceive|hide|adapt|terrify|survive}",
        "can appear as {anyone it has devoured|the victim's desires|the most loved person|the worst nightmare}",
        "reshapes {its own flesh|bones|internal organs} into {weapons|armour|wings|tentacles} at will",
        "{liquefies|solidifies|vaporises|compresses} to {pass through cracks|avoid blows|trap prey|escape}",
        "replicates {the appearance|the voice|the movements|the smell} of {those it has killed|whoever is in front of it|larger creatures|something familiar} to {set traps|get closer to its prey|sow chaos}",

        // Control and command
        "commands {the dead|insects|shadows|beasts|parasites} with {a gesture|a thought|a whistle|its will|its smell}",
        "controls {corpses|flesh puppets|living shadows|swarms} as extensions of its own body",
        "awakens {buried dead|sleeping spirits|ancient guardians|forgotten horrors} wherever it passes",
        "attracts {worms|insects|parasites|small predators|nocturnal creatures} that {surround|protect|feed|transport} it like a living army",
        "can {possess|control|pilot|inhabit} {other bodies|fresh corpses|constructs|animals} temporarily abandoning {its own body|its current form}",

        // Poisons and diseases
        "its {bite|touch|blood|breath|gaze} injects {necrotic venom|permanent paralysis|hallucinations|a disease with no cure}",
        "produces {toxins|acids|spores|parasite eggs} that {devour from within|reproduce|transform|spread the contagion}",
        "carries {a pestilence|a forgotten disease|a magical plague|accelerated decomposition} wherever it goes",
        "secretes {paralysing mucus|corrosive liquid|terror pheromones|a substance that dissolves willpower} from {every pore|its jaws|its wounds|pulsing glands}",
        "its {blood|sweat|saliva|breath} is {highly toxic|infectious|mutagenic|explosive on contact with air} making {wounding it dangerous|approaching impossible|every contact lethal}",

        // Physical manipulation
        "seizes victims with {tentacles|living chains|roots|solid shadows|countless appendages}",
        "crushes {bones|armour|walls|everything} with {terrible force|its jaws|body coils|a grip}",
        "can {absorb|incorporate|merge|devour} {flesh|metal|magic|souls} into its own body",
        "manipulates {gravity|air density|temperature|pressure} around itself {crushing|lifting|freezing|superheating} everything nearby",
        "extends {roots|filaments|pseudopods|flesh harpoons} from its body to {hook|trap|pierce|drag} its prey",

        // Supernatural senses
        "sees {in absolute darkness|through illusions|the immediate future|fear|life auras}",
        "senses {every heartbeat|lies|magic|souls|movement} within {its lair|miles around|its territory}",
        "perceives {life|imminent death|spilled blood|used magic|hostile intentions} as {a smell|a taste|vibrations|pain}",
        "scents {fear|blood|magic|lies|weakness} even through {walls|dimensions|time|distance}",
        "is aware of {every creature|every movement|every sound|every thought} within {a mile|a hundred paces|the whole region|however far it can extend its influence}",

        // Traps and deception
        "builds {elaborate traps|webs of flesh|spike-lined pits|nests of bone} to {catch prey|defend its territory|play|collect}",
        "imitates {human voices|the crying of a child|calls for help|familiar sounds} to {lure prey|confuse hunters|approach unnoticed}",
        "creates {illusions|mirages|copies of itself|false refuges} to {trap|disorient|exhaust|terrorise} those who seek it",
        "leaves {false trails|misleading tracks|chemical traps|living bait} that {lead to dead ends|attract other predators|drain energy|poison those who follow}",

        // Dimensional and temporal powers
        "bends {space|time|reality|dimensions} around itself creating {impossible labyrinths|time loops|distortion zones|gravitational traps}",
        "exists {in multiple dimensions simultaneously|slightly out of phase in time|between reality and shadow|only partially on this plane}",
        "can {slow|accelerate|stop|reverse} time in {a small area|a radius of a few metres|its field of vision} for {an instant|a few seconds|as long as needed}",

        // Parasitism
        "attaches itself to {victims|hosts|bodies|minds} like {a parasite|a leech|a climbing plant|a shadow} and {drains their life|controls them|transforms them|uses them as armour}",
        "lays {eggs|larvae|spores|seeds} {in the bodies of victims|in the ground|in wounds|in the water} that {grow slowly|take control|devour from within|create new copies}",
        "infests {dreams|memories|the subconscious|fears} of victims {feeding on their anguish|growing in their mind|corrupting their personality|until it replaces them}",

        // Resistance and durability
        "has {impenetrable skin|a shell hard as diamond|a membrane in constant regeneration|a surface covered in spines} that {deflects blades|absorbs magic|reflects projectiles|burns whoever touches it}",
        "survives {without oxygen|in vacuum|in magma|under immense pressure|in environments that melt metal} without {slowing down|weakening|any visible effect}",

        // Environmental manipulation
        "corrupts {the earth|the water|the air|the vegetation} within {a hundred paces|a mile|as far as it can see} transforming it into {an extension of its body|a toxic environment|a hunting ground|a nightmare}",
        "alters {the local climate|temperature|light|gravity} with {its mere presence|a gesture|its breath|its will} creating {storms|total darkness|acid rain|zones of silence}",
    ],

    // =============================================
    // REPUTATION SOURCES (~30 entries)
    // =============================================
    reputationSources: [
        "Legends tell that",
        "The peasants whisper that",
        "Ancient texts warn that",
        "Survivors swear that",
        "It is feared that",
        "Some say that",
        "In the taverns they tell that",
        "The learned have written that",
        "Mothers frighten their children saying that",
        "Hunters maintain that",
        "The shamans warn that",
        "Those who have seen it swear that",
        "The mad prophesy that",
        "Visions reveal that",
        "Ancient prophecies say that",
        "The soldiers recount that",
        "Monks have recorded that",
        "Border guards report that",
        "Passing merchants warn that",
        "Prisoners confess that",
        "Children sing that",
        "The imperial chronicles state that",
        "Necromancers confirm that",
        "Every map of the region notes that",
        "Weeping refugees tell that",
        "The forest druids fear that",
        "Explorers who came back alive swear that",
        "The underground dungeon keepers know that",
        "The inscriptions on the ruins say that",
        "Even the dead seem to whisper that",
    ],

    // =============================================
    // REPUTATION CLAIMS (~62 entries)
    // What is said about the monster
    // =============================================
    reputationClaims: [
        // Immortality and invulnerability
        "it is {immortal|invulnerable|a fallen god|older than death itself}",
        "it cannot be killed by {mortal weapons|fire|blessed steel|anything that has been tried}",
        "it comes back {stronger|larger|hungrier|changed} every time it is killed",
        "it is {impossible to trap|resistant to every known magic|immune to pain|incapable of truly dying}",

        // Purposes and desires
        "it seeks {a way to die|its lost heart|revenge against the gods|to extinguish the sun|the one who created it}",
        "it is gathering {souls|bones|names|memories|parts of itself} for {a ritual|its own completion|reconstruction|an army}",
        "it is waiting for {an eclipse|the alignment|the awakening of something|the end of the world|the right moment}",
        "it is {building|digging|preparing|cultivating} something in the depths that {nobody dares investigate|will change everything|is almost ready|still needs victims}",
        "it seeks {a specific host|a lost relic|the place of its own birth|someone who remembers its name}",

        // Past destruction
        "it destroyed {seven kingdoms|an entire civilisation|the ancient moon|its own creators|its own species}",
        "it is the cause of {a forgotten plague|the fall of Xarenth|the Great Fire|the Eternal Winter}",
        "it devoured {a minor god|a thousand heroes|an entire forest|a volcano|the dreams of a kingdom}",
        "it emptied {a sea|a mountain range|three cities|an entire region} leaving only {ash|silence|bones|nothing}",
        "it is responsible for the disappearance of {an entire race|twelve expeditions|every explorer of the region|all those who sought it}",

        // Hidden secrets
        "it hides {a cursed treasure|its only weakness|a door to hell|the soul of the world|seven true names} {in its body|in its lair|in another dimension}",
        "it guards {an ancient egg|a dimensional key|the last seed|a god fragment} that {everyone seeks|no one must find|will grant absolute power}",
        "it is made of {compressed souls|stellar matter|dragon flesh|solidified shadows|pure pain}",
        "it contains {a prison|a portal|a beating heart|a miniature universe} within its body",
        "it conceals {a message|a map|a prophecy|a warning} {in its own skin|in its song|in the pattern of its scars|in the rhythm of its footsteps}",

        // Specific weaknesses
        "it can only be killed by {a blade forged in its blood|a sincere kiss|someone who feels no fear|an innocent's tear|someone who loves it}",
        "it fears {blessed silver|sunlight|its own name spoken aloud|mirrors|running water|silence}",
        "it is vulnerable during {the new moon|sleep|the hours of dawn|weeping} and only {in those moments|if struck through the heart|if called by name}",
        "it loses {its powers|its solidity|its strength|consciousness} when {it hears bells|it sees its own reflection|someone laughs|it rains}",

        // Prophecies and destiny
        "it is the herald of {a new age|the end of times|a dark god|a cosmic pestilence|the return of the ancients}",
        "it was {born|raised|created|destined} to {destroy the world|judge humanity|open a portal|awaken something}",
        "it fulfils {a prophecy|an ancient curse|a forgotten pact|the will of something beyond}",
        "it is {the first sign|the last warning|the cause|the catalyst} of {an imminent catastrophe|an age of darkness|the end of balance|a mass awakening}",

        // Unique characteristics
        "it weeps {black blood|acid|liquid diamonds|cold flame|light} when {it kills|it sleeps|it looks at the moon|it feeds|it is alone}",
        "it has no {shadow|reflection|smell|sound of footsteps|heartbeat}",
        "it is in reality {many creatures|a hive|fragments of a god|someone's nightmare|a living paradox}",
        "it emanates {a smell of rotting flowers|an unnatural warmth|a cold that burns|absolute silence|a light that does not illuminate}",
        "it leaves {footprints that burn|an echo that lasts for days|frost traces|marks that bleed|a smell that won't go away} wherever it passes",

        // Relations and origins
        "it was once {human|an angel|a legendary hero|the king of Karnath|loved by all}",
        "it is {the child|the creation|the revenge|the regret} of {a mad god|a repentant sorcerer|something forgotten}",
        "it {devoured|absorbed|replaced|fused with} {the previous guardian|its creators|everything it used to be}",
        "it is {a twin|a shadow|a distorted reflection|the dark counterpart} of {a living hero|a deity|a legendary creature|someone who doesn't know}",
        "it was once {the greatest healer|a protector of children|a bridge builder|a friend to all} before {the fall|the corruption|the transformation|the curse}",

        // Numbers and specific details
        "it has {a thousand eyes|seven hearts|nineteen mouths|wings without feathers|too many limbs to count}",
        "it is {thirty metres long|the size of three houses|large enough to encircle the village} and {twice as wide|half as wide}",
        "it exists {in three places simultaneously|between dimensions|outside of time|only when observed}",
        "it has {ninety-nine teeth|eleven tails|three heads that argue|one enormous eye|a variable number of legs}",
        "it weighs {as much as a mountain|nothing|more than the ground can bear|differently depending on the moment}",

        // Unsettling behaviours
        "it collects {teeth|eyes|left hands|names|memories|shadows} from its victims",
        "it repeats {always the same phrase|the names of the dead|an endless count|the last words of those it kills}",
        "it smiles {always|only before killing|with a mouth that shouldn't be there|in a way that is worse than a snarl}",
        "it {scratches|rubs|bites|tears at} {its own skin|its scabs|its limbs|its parasites} {constantly|when nervous|creating new wounds|with methodical obsession}",

        // Intelligence and knowledge
        "it is {more intelligent than it appears|sentient|capable of speech|able to reason} but {chooses not to|has stopped|only does it to deceive}",
        "it knows {the name of every person it meets|the secrets of kings|the near future|the weaknesses of each one} without {anyone knowing how|ever having asked|needing to speak}",
        "it remembers {every pain inflicted|every face seen|every promise made|its own past life} and {suffers for it|uses it as a weapon|can't forget}",
        "it understands {every language|the language of animals|ancient runes|words that no longer exist} but {cannot speak|chooses silence|communicates only through violence}",

        // Existential horror
        "it is not {truly alive|completely dead|real in the traditional sense|made of normal matter}",
        "it is {a hole in reality|an error of creation|something that should never have existed|a dream become substance}",
        "its very existence {weakens reality|causes nightmares in sensitives|disturbs prophecies|confuses seers}",

        // Effects on the surroundings
        "the earth {dies|rots|is poisoned|splits} wherever it {walks|rests|breathes|looks for too long}",
        "the {seasons|tides|stars|compasses|clocks} go haywire in its {presence|vicinity|shadow|wake}",
        "animals {flee|die|go mad|freeze} when {it approaches|it is nearby|the wind carries its scent}",

        // Disturbing connections
        "it is connected to {every shadow|every mirror|everyone's dreams|fear itself} and {can emerge from any of them|uses them as doorways|is part of them}",
        "it has {a pact|a bond|a symbiosis|a connection} with {the moon|the underground|storms|death itself} that {feeds|protects|makes it cyclical|guides} it",

        // Disturbing abilities
        "it can {feel|taste|perceive|smell} {fear|lies|despair|innocence} like {a sweet smell|a vibration|a metallic taste|music}",
        "it is capable of {speaking with the dead|predicting deaths|remembering lives not its own|knowing how you will die} and {does so often|cannot stop|uses it to hunt}",
        "it changes {size|weight|number of limbs|consistency} based on {the lunar phase|the amount of blood spilled|the surrounding fear|the number of recent victims}",
        "it can {enter dreams|walk between reflections|move through shadows|travel through pain} to {reach its victims|escape|hunt|return to its lair}",
    ],

    // =============================================
    // CURRENT STATES (~52 entries)
    // What the monster is doing NOW
    // =============================================
    currentStates: [
        // Waiting and sleep
        "it {sleeps|waits|hides|prepares} {in the depths|beneath the mountain|in a parallel dimension} waiting for {its awakening|the right moment|the seals to give way|someone brave enough}",
        "it rests in {a cocoon of flesh|a sarcophagus of ice|a pool of blood|a sealed crypt} {regenerating|dreaming of revenge|accumulating strength}",
        "it waits {motionless|hidden|camouflaged} for {a prey to pass|someone to open the door|its master to arrive|the ritual to end}",
        "it lies {dormant|motionless|semi-conscious|suspended} {beneath layers of earth|in a stone egg|at the heart of a glacier|at the bottom of a black lake} and {the ground above trembles|the area is dead|no one ventures there|you can hear the heartbeat}",
        "it is {crouched|coiled|compressed|folded} in a space {too small|impossible|hidden|forgotten} waiting {with infinite patience|without hurry|for longer than anyone remembers}",

        // Wandering
        "it wanders through {the desolate lands|the underground world|dreams|forgotten ruins} seeking {food|impossible peace|an end|whoever made it|company}",
        "it crosses {villages|forests|mountains|dimensions} leaving {only death|a trail of madness|burned earth|unnatural silence}",
        "it follows {the smell of blood|voices only it can hear|an ancient instinct|the call of something|fragmented memories}",
        "it roams without purpose through {the plains|the underground|the coastlines|the borders of the known world} {destroying without intention|searching for something it cannot name|repeating a circular path|moving away from civilisation}",
        "it migrates {northward|deeper|following the seasons|without apparent pattern} dragging with it {an aura of death|its own offspring|the remains of its victims|a trail of corruption}",

        // Building and accumulating
        "it builds {a nest of bones|a throne of corpses|a dark temple|a living tower} using {its victims|cursed stones|solidified shadows}",
        "it accumulates {stolen treasures|magical artefacts|body parts|souls in bottles|specific objects} for {a forgotten reason|company|a ritual|a collector's hunger}",
        "it modifies {its own body|its lair|the surrounding environment|its victims} {constantly|slowly|painfully|artistically}",
        "it is {digging|enlarging|decorating|expanding} {its lair|a tunnel system|a network of caverns|a labyrinth} with {bone and flesh|stolen material|the bodies of the fallen|hardened secretions}",
        "it arranges {bones|skulls|collected weapons|trophies} in {precise rows|concentric circles|geometric structures|patterns only it understands}",

        // Protection
        "it protects {a pulsing egg|a closed portal|a crystal flower|the last memory} {to the death|ferociously|from anyone who approaches|without knowing why}",
        "it guards {a tomb|a relic|a secret|a place} that {no one must find|everyone seeks|it no longer remembers why}",
        "it defends {its territory|its lair|its young|something buried} with {brutal efficiency|extreme violence|cruel cunning}",
        "it keeps watch over {a passage|an artefact|a prison|a border} {tirelessly|with obsession|since before anyone can remember|as if programmed}",

        // Hunting
        "it hunts {every night|during storms|when the moon is full|without pause} {out of insatiable hunger|on instinct|as cruel sport|out of necessity}",
        "it feeds on {fear|living flesh|young blood|residual magic|fresh souls|dreams} every {night|moon|week}",
        "it kills {everything that breathes|only those who disturb it|methodically|following a pattern}",
        "it lays ambushes {along the roads|at the fords|in abandoned buildings|where people feel safe} {with calculated patience|for sport|without hurry|like a spider}",
        "it is {learning|honing|perfecting|changing} its own {hunting techniques|strategies|preferred prey|hunting grounds} becoming {more efficient|more unpredictable|harder to avoid}",

        // Search and desire
        "it desperately seeks {to remember who it was|to become human again|a way to die|its own creator} but {can't stop|keeps killing|is losing its form}",
        "it tries to {communicate|understand|reconstruct|imitate} {humanity|its own origin|what it has lost} but {only horror comes out|it frightens everyone|it can't manage}",
        "it wants to {find one like itself|not be alone|be understood|go back to sleep} but {is the last|nobody survives long enough|everyone flees}",
        "it is searching for {a specific artefact|a forgotten place|a person|an answer} {for centuries|with growing desperation|destroying everything in the process|not knowing what it will find}",

        // Service and control
        "it serves {a dark master|a blind instinct|an ancient prophecy|the Void} {faithfully|without question|against its own will}",
        "it obeys {forgotten commands|a broken programme|voices in its head|an ancient pact} that {it cannot ignore|torment it|slowly destroy it}",
        "it carries out {orders|rituals|tasks|missions} that {it never received|it barely remembers|were imprinted on it|it no longer understands} with {blind devotion|growing confusion|brutal precision}",

        // Reproduction and spreading
        "it is {laying eggs|creating copies|infecting|transforming} {everything it touches|its victims|the environment|slowly the world}",
        "it is {multiplying|dividing|evolving|spreading} in {unnatural ways|secret|underground|through dreams}",
        "it is {contaminating|corrupting|altering|poisoning} {the groundwater|the soil|the local fauna|the ecosystem} {slowly|without anyone noticing|over an ever-wider area}",
        "its {fragments|children|spores|echoes} are {appearing|emerging|maturing|awakening} in {distant places|hidden corners of the continent|wells and cisterns|people's dreams}",

        // Decline and agony
        "it is {dying slowly|losing its form|decomposing|returning to nothing} but {can't finish|keeps living|refuses to yield}",
        "it suffers {constantly|endlessly|in incomprehensible ways} and {just wants it to end|seeks revenge|drags everyone down with it|doesn't know what to do}",
        "it is {losing pieces|dissolving|shrinking|forgetting} but {every lost fragment becomes dangerous|the core remains lethal|the substance spreads|it becomes more concentrated}",

        // Growth and transformation
        "it is {growing|mutating|changing|evolving} {out of control|in never-before-seen ways|at an alarming rate|toward a final form}",
        "it is {absorbing|incorporating|merging with|engulfing} {the surrounding terrain|nearby creatures|the vegetation|the water} expanding {its own mass|the limits of its body|the territory it controls}",

        // Ritual and preparation
        "it is {completing a ritual|preparing an invocation|accumulating power|gathering ingredients} that {needs time|no one must interrupt|is almost complete|will change everything}",
        "it is arranging {bones|symbols|bodies|stones} in {circles|spirals|geometric patterns|impossible configurations} for {an imminent ritual|an unknown reason|a dark purpose|its own completion}",

        // Inner conflict
        "it struggles {against its own nature|to maintain control|with the voices in its head|between its hunger and the memory of who it was}",
        "it alternates between moments of {lucidity and fury|calm and violence|silence and screams|stillness and destruction} {without warning|without logic|without pattern|with no way of predicting it}",

        // Observation and active waiting
        "it observes {the nearby villages|the caravans|the travellers|civilisation} from {afar|the shadows|underground|borrowed eyes} {studying|planning|waiting|learning}",
        "it is {mapping|memorising|cataloguing|studying} {the territory|the defences|the habits|the weaknesses} of {those living nearby|the nearest city|the kingdom|whoever is hunting it}",

        // Imitation and infiltration
        "it is {imitating|copying|studying|observing} {human behaviour|local rituals|language|social structures} to {infiltrate|get closer to|understand|exploit} {civilisation|a community|a settlement|its defences}",
        "it has {taken on the appearance of|assumed the identity of|replaced|substituted} {a traveller|a merchant|a guard|a hermit} and nobody {has noticed|suspects|knows yet|survived long enough to find out}",

        // Forced stasis
        "it is {stuck|trapped|caught|frozen} between {two states|life and death|two dimensions|one form and another} and {is suffering|is struggling|is waiting|is slowly freeing itself}",
        "it is {sealed|contained|suppressed|slowed} by {ancient spells|runic chains|constant prayers|an artefact} that are {weakening|being consumed|breaking|eroding}",

        // Communication
        "it is {trying to communicate|sending signals|leaving messages|screaming} {through dreams|with blood symbols|by altering the landscape|through vibrations} but {no one understands|everyone misinterprets|the message arrives distorted|it just looks like violence}",
        "it emits {a call|a song|a signal|vibrations} that {attracts others of its kind|crosses dimensions|disturbs dreams|makes bones vibrate} and has been doing so for {weeks|months|since it arrived|longer than anyone remembers}",
    ],

    // =============================================
    // CURRENT CONNECTORS (~22 entries)
    // =============================================
    currentConnectors: [
        "Now", "At this point", "Today", "Right now", "Since then",
        "On moonless nights", "When the wind howls", "In the darkness",
        "Beneath the mountain", "Beyond the border", "In the underground",
        "During storms", "At the fall of dusk", "Before dawn",
        "On foggy days", "Among the ruins", "In the silence of the night",
        "Every full moon", "When no one is watching", "In the darkest hours",
        "While the world sleeps", "Ever since that day"
    ],

    patternConnectors: {
        patternD_intro: (place, name) => `Near ${place}, ${name}`,
        patternD_mid: 'Then it',
        patternE_mid: 'Meanwhile,',
        patternE_name_insert: false,
        patternF_intro: (place) => `Near ${place}, it`,
        formationSubject: 'It'
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
