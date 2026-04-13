// === BACKSTORY GENERATOR - ENGLISH DATASET ===
// Version: 1.0
//
// GUIDELINES:
// - Gender-neutral language (use "they/their" for subject-less phrases)
// - Concrete actions, not labels
// - Specific objects, not vague ones
// - Places without articles (avoids "at the" constructions)
// - No meta-narration
//
// GRAMMAR NOTE:
// reputationSources end with "that" so that reputationClaims
// (which start with "they") produce: "[source] that they [verb]..."
// e.g. "They say that" + "they defeated a dragon" → "They say that they defeated a dragon"

export const data = {

  // =============================================
  // PLACES (~110 entries)
  // Mix of sounds: nordic, mediterranean, eastern, generic fantasy
  // NO articles (avoids "at the" constructions)
  // =============================================

  places: [
    // Nordic / Germanic
    "Thornwall", "Grimhold", "Frostmere", "Ashford", "Ironvale",
    "Blackmoor", "Stormwatch", "Ravenscar", "Winterfell", "Greystone",
    "Dunharrow", "Whitecliff", "Shadowfen", "Coldwater", "Highgarden",
    "Wolfreach", "Duskholm", "Nordhaven", "Stonemark", "Barrowfield",
    "Gallowmere", "Farholt", "Kingsfall", "Moorgate", "Wyrmthorn",
    "Brindlewick", "Dreadmarsh", "Helm's Breach", "Nighthollow", "Ironbend",

    // Mediterranean / Latin
    "Valdoria", "Grey Harbour", "Solmara", "Longstone", "Blackwater",
    "Darkrock", "Old Bridge", "Highkeep", "Falconfield", "Coldwood",
    "Browncoast", "Clearham", "Thornspire", "Deepvale", "High Shore",
    "Redridge", "Dark Cove", "Oldground", "Deadfield", "Brownvale",
    "Hollow Stone", "Long Borough", "Salt Coast", "Ashpeak", "Blackditch",
    "Crookedshore", "Narrowpass", "Grey Tower", "Ancient Port", "Bitter Wood",

    // Eastern / Exotic
    "Karveth", "Zar'khan", "Vornheim", "Ashkar", "Myr'then",
    "Khalindra", "Vor'nash", "Thal'mera", "Sandoral", "Oasis Prime",
    "Zul'kara", "Nhar'zuul", "Tal Vashir", "Qar'moth", "Shen'dai",
    "Ash'valen", "Drak'mora", "Kor'thane", "Sul'ravesh", "Mir'kazan",

    // Generic / Descriptive
    "a nameless village", "a port town", "a forgotten outpost",
    "a ruined monastery", "an abandoned fortress", "a notorious crossroads",
    "a smuggler's port", "an exhausted mine", "a refugee camp",
    "an isolated watchtower", "a travelling market", "an underground shelter",
    "a frontier outpost", "a prison colony", "a nomad encampment",
    "a beached wreck", "a coaching inn", "a burned village",
    "a desecrated temple", "a roadside tavern at the edge of nowhere"
  ],

  // =============================================
  // PLACE DESCRIPTORS (~55 entries)
  // =============================================

  placeDescriptors: [
    "the alleys", "the dusty roads", "the shadows", "the markets",
    "the fog", "the taverns", "the slums", "the towers",
    "the abandoned temples", "the mines", "the fields", "the docks",
    "the sewers", "the rooftops", "the cellars", "the warehouses", "the ruins",
    "the walls", "the brothels", "the prisons", "the graveyards", "the arenas",
    "the shipyards", "the forges", "the poor quarters",
    "the granaries", "the squares", "the tunnels", "the shops", "the ditches",
    "the barracks", "the bridges", "the cisterns", "the courtyards", "the chapels",
    "the storerooms", "the staircases", "the archways", "the vaults", "the wells",
    "the stables", "the ramparts", "the wharves", "the ovens", "the tanneries",
    "the slaughterhouses", "the workshops", "the depots", "the shacks",
    "the dormitories", "the sheds", "the covered passages", "the dumps",
    "the canals", "the palisades"
  ],

  // =============================================
  // ORIGIN PHRASES (~55 entries)
  // Functions taking (name, place) and returning a string
  // Use {a|b|c} for internal variants
  // =============================================

  originPhrases: [
    // Simple
    (name, place) => `${name} comes from ${place}`,
    (name, place) => `${name} spent their childhood at ${place}`,
    (name, place) => `${name} left ${place} {years ago|long ago|when they were young}`,
    (name, place) => `${name} lived at ${place} {for years|long enough|too long}`,

    // With time detail
    (name, place) => `${name} spent {their childhood|their early years|too much time|half their life} at ${place}`,
    (name, place) => `${name} reached ${place} {with nothing|on the run|seeking shelter|by chance|following a rumour}`,
    (name, place) => `${name} {abandoned|left} ${place} {years ago|one night|without looking back|leaving everything behind}`,
    (name, place) => `${name} left ${place} {at a run|in silence|carrying only a blade|with a promise to keep}`,

    // With environment
    (name, place) => `The {streets|shadows|nights|rains|wars} of ${place} {forged|marked|hardened|changed} ${name}`,
    (name, place) => `${name} found {shelter|work|trouble|enemies|friends} at ${place}`,
    (name, place) => `${name} remembers {little|too much|only the worst|only the blood|every detail} of ${place}`,
    (name, place) => `The {cold|mud|smoke|silence|noise} of ${place} {marked|followed|haunted} ${name} for years`,
    (name, place) => `${name} spent the {worst|best|hardest|most important} years of their life at ${place}`,

    // With mystery
    (name, place) => `Nobody knows {how long|why|how|when} ${name} has {lived at|been at|worked at|hidden at} ${place}`,
    (name, place) => `${name} never speaks of ${place}, but {came from there|something ties them to it|left something behind|still carries the scars}`,
    (name, place) => `At ${place}, ${name} was {nobody|someone else|already in trouble|known by another name}`,
    (name, place) => `${name} has {unfinished business|an open account|an untold story|something buried} at ${place}`,
    (name, place) => `Anyone who knew ${name} at ${place} {wouldn't recognise them now|tells different stories|prefers not to talk about it}`,

    // With action
    (name, place) => `${name} {burned their bridges|buried the past|changed their name} when they left ${place}`,
    (name, place) => `Before arriving at ${place}, ${name} was {nobody|a ghost|on the run|presumed dead}`,
    (name, place) => `${name} {inherited|stole|bought|won} a place at ${place}`,
    (name, place) => `${name} reached ${place} after {weeks of walking|a shipwreck|a flight|losing everything}`,
    (name, place) => `${name} set foot at ${place} {penniless|armed with a blade|under a false name|looking for someone}`,

    // With consequence
    (name, place) => `${place} {drove out|welcomed|betrayed|forgot} ${name}`,
    (name, place) => `${name} swore never to return to ${place}`,
    (name, place) => `${name} still dreams of {the streets|the faces|the flames|the blood} of ${place}`,
    (name, place) => `${name} carries {a scar|a memory|a debt|a grudge} from ${place}`,
    (name, place) => `${place} gave ${name} {a lesson|a scar|an enemy|a reason to leave}`,

    // Specific
    (name, place) => `${name} came into the world {in a prison|in a brothel|in a caravan|on a battlefield} near ${place}`,
    (name, place) => `${name} lost {their family|everything|their memory|an arm} at ${place}`,
    (name, place) => `${name} owes their life to someone from ${place}`,
    (name, place) => `${name} has {a debt|an enemy|a grave|a secret} at ${place}`,
    (name, place) => `${name} {bought|earned|stole} their freedom at ${place}`,
    (name, place) => `${name} suffered {a betrayal|a sentence|a wrong|a loss} at ${place}`,

    // Relational
    (name, place) => `${name} followed {a teacher|a promise|a voice|a debt} all the way to ${place}`,
    (name, place) => `${name} lost someone at ${place} and {won't leave|can't forget|is still waiting}`,
    (name, place) => `At ${place}, ${name} {learned to lie|stopped trusting|understood how the world works|found a reason}`,
    (name, place) => `${name} worked {the fields|the docks|the mines|the kitchens} of ${place} for {years|too long|to pay a debt}`,

    // With context
    (name, place) => `${name} knows ${place} better than {whoever runs it|any map|those who live there}`,
    (name, place) => `${name} watched ${place} {burn|fall|change|rise from the ashes} and {can't forget|carries the scars|wants to go back}`,
    (name, place) => `${place} {doesn't want|won't accept|has no room for} ${name}, but ${name} {won't leave|keeps coming back|has no choice}`,
    (name, place) => `${name} {built|lost|abandoned} a life at ${place}`,
    (name, place) => `${name} was {respected|feared|ignored|despised} at ${place}, before {leaving|disappearing|losing everything}`,

    // Dramatic
    (name, place) => `The last time ${name} saw ${place}, {there were flames|blood was in the air|someone was dying|everything was crumbling}`,
    (name, place) => `${name} paid {a heavy price|suffered greatly|risked their life} to leave ${place}`,
    (name, place) => `When ${name} left ${place}, {nobody asked why|there was nothing left to save|it was already too late}`,
    (name, place) => `${name} carries the {mark|memory|weight|taste} of ${place} wherever they go`,
    (name, place) => `${name} {swore|promised|decided} that ${place} would not have the last word`,

    // Ambiguous
    (name, place) => `${name} claims to be from ${place}, but {nobody checks|no one believes it|the details don't add up}`,
    (name, place) => `Someone at ${place} is still waiting for ${name} to {return|pay up|keep a promise|show themselves}`,
    (name, place) => `${name} left {a name|a reputation|debts|enemies} at ${place} that {they don't want back|follow them still|will catch up one day}`,
    (name, place) => `${name} {slept|fought|suffered|stole} enough at ${place} to {know every corner|never want to go back|know when to leave}`,
    (name, place) => `Every time someone mentions ${place}, ${name} {changes the subject|clenches their fists|goes quiet|touches an old scar}`,
  ],

  // =============================================
  // FORMATION PHRASES (~75 entries)
  // Events that shaped the character
  // These are predicates without a subject — used as: "[Name] [formation]"
  // =============================================

  formationPhrases: [
    // Concrete losses
    "lost {their family|a brother|a child|a teacher|their only friend} in {one night|a fire|a war|a plague|a betrayal}",
    "watched {their own teacher|the one who raised them|the only person they trusted|an innocent} die in front of their eyes",
    "lost {an eye|a hand|three fingers|hearing in one ear|their voice for a year} to {a blade|a spell|a bite|protecting someone}",
    "buried {a child|a companion|a lover|their own past} and never speak of it",
    "watched {a house|a ship|a tower|a temple} {burn|crumble|sink|fall} with {someone|a loved one|everything|their whole life} inside",
    "lost {sight in one eye|use of one hand|feeling in one arm|two fingers of the left hand} in {a brawl|a collapse|a torture|an accident}",
    "witnessed the death of {an entire village|a company|a crew|everyone they knew} and could do nothing",
    "held {a friend|a companion|a teacher|a child} in their arms as {they died|they bled out|they called for help|they stopped breathing}",

    // Betrayals and deceptions
    "watched {a sacred oath|their own guild|a blood pact|someone who didn't deserve it} being betrayed",
    "suffered a betrayal from {a relative|a friend|a lover|someone who should have protected them} for {gold|power|fear|revenge}",
    "discovered that {their own mentor|an old friend|the one who raised them} {had been lying all along|was the enemy|was using them}",
    "betrayed {an oath|a guild|a friend|a lord} {to survive|to protect someone|for gold|out of fear}",
    "found out that {their own family|the guild|their lord|whoever was paying} {was on the wrong side|had been lying|was using everyone}",
    "believed {a promise|an ally|a pact|a letter} and paid for it {dearly|with blood|with years of freedom|with everything}",
    "handed {a friend|a companion|an innocent|someone who trusted them} over to {an enemy|the law|a certain death} for {orders|blackmail|fear|money}",
    "discovered too late that {the job|the task|the mission|the deal} was {a trap|a deception|a death sentence|a betrayal}",

    // Pacts and secrets
    "struck {a blood pact|a deal with a demon|a bargain with a witch|something they can't break} that they never speak of",
    "uncovered a secret that {costs lives|others have paid dearly for|is worth a fortune|should have stayed buried}",
    "made a promise to {a dying person|a ghost|an enemy|themselves} that they intend to keep",
    "knew {the truth|the location|the real name|the weakness} of something many were searching for",
    "signed {a contract|a pact|an agreement|an oath} {in their own blood|in black ink|with a handshake|with words that can't be taken back}",
    "carried {a message|a map|a formula|a name} that {was worth more than gold|could topple a kingdom|someone wanted destroyed|they didn't fully understand}",
    "swore {silence|loyalty|revenge|obedience} to {an order|a cause|a dying person|someone they've never met}",
    "bore {a seal|a brand|a tattoo|a scar} that {opened doors|closed conversations|meant something they refused to explain}",

    // Crimes and violence
    "{killed|spared} {for the first time|without hesitation|to protect someone|by accident} and have never forgotten it",
    "stole {an ancient artefact|a forbidden tome|a royal seal|a cursed blade} from {a temple|a tomb|a noble|a mage}",
    "{burned|destroyed|razed} {a village|a ship|a harvest|a library} {on orders|for revenge|for money|by mistake}",
    "{freed|captured|eliminated} someone who {shouldn't have been|deserved worse|was innocent|still haunts them}",
    "drove {a dagger|a knife|a blade|a stiletto} into the back of {an ally|a friend|a master|someone who trusted them} and {doesn't regret it|thinks about it every night|would do it again|carries the weight}",
    "{looted|emptied|set fire to} {a caravan|a warehouse|a tomb|a chapel} out of {hunger|orders|greed|desperation}",
    "{forged|stole|destroyed} {a document|a will|a letter|a contract} that {ruined|saved|condemned} someone",
    "struck {a noble|a guard|a priest|someone they shouldn't have} and since then {have a price on their head|can't sleep soundly|move from town to town|watch their back}",

    // Survival
    "learned to survive by {stealing|fighting|lying|hiding|selling information}",
    "spent {a year|three winters|too long} in {a prison|a mine|chains|exile}",
    "survived {a shipwreck|a plague|a massacre|a failed ritual|a death sentence}",
    "walked for {weeks|months} through {a desert|a swamp|mountains|cursed lands} not knowing if they'd make it",
    "ate {rats|insects|roots|boiled leather} for {weeks|months|an entire winter|to stay alive}",
    "slept {on the ground|under bridges|in the sewers|in the open} for {years|too long|their whole childhood|because they had no choice}",
    "worked {a mine|a galley|an arena|a tannery} until {they collapsed|they earned their freedom|they escaped|they couldn't feel their hands}",
    "drank water from {puddles|muddy rivers|rusty cisterns|poisoned springs} just to {survive|keep going|not stop}",

    // Learning
    "learned {to fight|to read|a trade|magic} from {an exile|a prisoner|an enemy|a dying person}",
    "found {a teacher|a guide|a purpose|a family} among {mercenaries|thieves|monks|strangers}",
    "studied {in secret|for years|under a false name|forbidden texts} — something they shouldn't have",
    "discovered they had {a talent|a gift|a curse|a connection} they don't understand",
    "learned {to read the stars|sailor's knots|sign language|the tongue of the dead} from {an old person|a prisoner|a castaway|someone no longer here}",
    "stole {a book|a manual|scrolls|secret notes} and taught themselves {alone|in secret|through mistakes|at great cost}",
    "spent {years|their entire youth|too much time|every night} {watching|copying|practising|studying} without anyone knowing",
    "received {a lesson|a warning|a technique|a gift of knowledge} from {a condemned prisoner|an exile|a madman|someone nobody listened to}",

    // Hard choices
    "had to choose between {loyalty and survival|two people they loved|the truth and their life|honour and family}",
    "sacrificed {everything they had|their own reputation|a friend|years of work} for {a stranger|a principle|nothing}",
    "refused {a title|a fortune|a marriage|an order} and are still paying for it",
    "accepted {a job|a pact|a mission|a curse} they now regret",
    "chose {silence|flight|betrayal|obedience} when they should have {spoken up|fought back|stayed|refused}",
    "let {a companion|an innocent|a friend|someone} die because {there was no choice|it was an order|they were afraid|there was no time}",
    "gave up {a normal life|a love|a name|a future} for {an oath|a revenge|to protect someone|a debt}",
    "surrendered {their word|a ring|a promise|a child} in exchange for {freedom|protection|information|time}",

    // Transformations
    "changed {their name|their face|their allegiance|their faith} at least {once|three times|more than they admit}",
    "abandoned {a faith|an oath|a life|everything} {to start over|to seek revenge|to pursue a love|out of fear}",
    "lost {their faith|their hope|their trust|their fear} after {that night|that day|the last winter}",
    "{built|lost|rebuilt} everything {more than once|from nothing|without help}",
    "stopped {believing|praying|hoping|feeling} after {the war|the loss|the betrayal|that night}",
    "cut {their hair|a hand|ties|every connection} as {a promise|a penance|a beginning|an ending}",
    "burned {every letter|their own diary|the evidence|their clothes} from {a previous life|a love|a crime|another identity}",
    "walked away from {an altar|a battle|a crown|a funeral} and never looked back",

    // Relationships
    "loved {only once|the wrong person|without being loved back|and lost}",
    "raised {an orphan|an animal|a pupil} who {can no longer be found|is no longer here|hates them now|is all they have}",
    "owe their life to {an enemy|a stranger|someone no longer here|the last person they expected}",
    "forgave {someone who didn't deserve it|a betrayal|an unforgivable wrong|too easily} and regret it",
    "sent away {the only person|a child|a companion|a friend} {to protect them|out of pride|out of fear|to keep a secret}",
    "promised {a dying person|a child|a friend|themselves} something that {they can't keep|costs more than expected|keeps them awake}",
    "found {a companion|a dog|a horse|a crow} who is now {their only company|worth more than any person|never leaves their side|bears the same name as someone they lost}",
  ],

  // =============================================
  // SKILL PHRASES (~85 entries)
  // What the character CAN DO
  // These are predicates: used as "[Name] [skill]"
  // =============================================

  skillPhrases: [
    // Combat
    "fights {without hesitation|as if they have nothing to lose|for whoever pays well|only when necessary|better than they look}",
    "uses {a sword|a dagger|a bow|bare hands} like {an extension of their body|few people can|someone who spent their life at war}",
    "knows how to strike {where it hurts most|without being seen|before the other one realises|the vital points}",
    "has {defeated|faced|survived} {more opponents than they admit|stronger enemies|things that shouldn't exist}",
    "keeps {a dagger|a blade|a nail|a shard of glass} where {nobody would think to look|their hand reaches first|it can't be seen|it's needed}",
    "reacts {before thinking|faster than most|like a cornered animal|without hesitation} when {attacked|threatened|backed into a corner}",
    "prefers to {strike first|finish it quickly|leave no witnesses|fight dirty} rather than {risk it|wait|be honourable|lose}",
    "can use {anything|a stick|a chain|a stool} as a weapon if {necessary|there's no choice|the situation calls for it}",

    // Theft and deception
    "steals {without getting caught|only from those who can afford it|like breathing|things others don't even notice}",
    "lies {better than they speak|as easily as they breathe|only when needed|to everyone but themselves}",
    "opens {any lock|doors that should stay closed|paths others can't see} given enough time",
    "disappears {when needed|better than anyone|leaving only debts|before the bill comes due}",
    "moves {without making a sound|in shadow|where they shouldn't|as if invisible}",
    "enters and exits {any room|guarded buildings|towers|prisons} without {anyone noticing|an alarm going off|leaving a trace}",
    "changes {accent|bearing|name|appearance} depending on {who they're facing|where they are|what's needed|who's paying}",
    "knows when {someone is lying|a guard gets distracted|a door is weak|it's time to leave}",
    "creates {false identities|documents|alibis|distractions} with {minimal materials|ease|unsettling precision}",

    // Knowledge and information
    "knows things {only found in forbidden books|others pay to know|they shouldn't know|that could get them killed}",
    "can find {anyone|anything|answers|a way out}, given enough {time|gold|motivation}",
    "collects {information|rumours|secrets|debts} for {whoever pays|when they'll be needed|out of habit|to survive}",
    "knows {the secrets|the routes|the weaknesses|the prices} of {this city|too many people|those in power|every tavern}",
    "sells {secrets|information|lies|dangerous truths} {to the highest bidder|at the right price|at the right moment}",
    "listens to {conversations|confessions|arguments|deals} that {aren't meant for them|others don't notice|will come in useful one day}",
    "remembers {every face|every name|every debt|every lie} they have {crossed paths with|been told|overheard|witnessed}",
    "knows {who really runs things|where the money goes|who owes what to whom|which doors open with gold} in {any city|any port|any guild|any court}",
    "reads {contracts|maps|symbols|languages} that {few people know|shouldn't exist|are written in code|others can't decipher}",

    // Craft and trade
    "forges {weapons|armour|tools|jewellery} {that never break|of rare quality|that sell at a high price|for select clients}",
    "cooks {dishes|concoctions|remedies|poisons} that {nobody forgets|have interesting effects|heal or kill}",
    "trades in {favours|debts|rare objects|forbidden goods} that {are worth more than gold|others won't touch|will come in useful}",
    "builds {traps|devices|prosthetics|tools} that {always work|surprise people|nobody else knows how to make}",
    "forges {any document|seals|identities|coins|works of art} {better than the originals|without leaving a trace}",
    "repairs {weapons|armour|devices|mechanisms} that {others would throw away|seem lost|nobody else will touch|have seen too much use}",
    "carves {bone|wood|stone|ivory} into {amulets|tools|weapons|objects that someone will pay for}",
    "tans {hides|leather|furs|materials} using {ancient methods|techniques few know|infinite patience|results that last generations}",
    "weaves {nets|fabric|deceptions|traps} with {their own hands|fine threads|impossible materials|unsettling precision}",

    // Healing and poisons
    "heals {whoever can pay|whoever needs it|using unorthodox methods|wounds others won't touch}",
    "knows {poisons|herbs|substances|remedies} that {can save or kill|can't be found in books|others fear}",
    "can {extract arrows|stitch wounds|reattach fingers|stop bleeding} {without tools|better than a surgeon|in silence}",
    "prepares {antidotes|potions|ointments|tinctures} for {whoever pays|whoever needs them|themselves}",
    "can identify {a poison|an herb|a substance|a mushroom} by smell {at a distance|faster than anyone|the way others identify colours}",
    "knows how to {make someone talk|make someone sleep|make someone forget|take someone's pain away} using {the right herbs|the right dose|what grows at the side of the road}",
    "has {steady hands|sharp eyes|an instinct|a patience} that {saves lives|makes a difference|others envy} when there is {blood|pain|panic|little time}",
    "treats {wounds|burns|fractures|poisonings} with {whatever they can find|improvised means|techniques learned in war|absolute calm}",

    // Magic and supernatural
    "learned {magic|the arcane|forbidden arts|ancient rituals} {without any teacher|from someone they shouldn't have|at great cost|in secret}",
    "reads {the stars|signs|cards|bones|dreams} and {sometimes they tell the truth|whoever listens pays|something answers back}",
    "drives out {demons|ghosts|spirits|creatures|curses} {for whoever pays|where others don't dare|without asking questions}",
    "speaks with {the dead|spirits|things that shouldn't answer|those no longer here}",
    "senses {lies|fear|magic|danger} like {others feel the wind|an instinct|a curse}",
    "traces {symbols|circles|runes|seals} that {keep something away|open passages|burn whoever touches them|few can read}",
    "has {an eye|a hand|a scar|a mark} that {glows in the dark|reacts to magic|burns near danger|doesn't belong to this world}",
    "invokes {names|words|formulas|sounds} that {shouldn't be spoken|change the temperature|make flames tremble|attract attention}",
    "perceives {death|evil|magic|deception} before it {arrives|manifests|others notice it|it's too late}",

    // Animals and nature
    "tames {horses|wolves|hawks|beasts|creatures} that {others fear|nobody wants to approach|bite those they don't know}",
    "lives {in the woods|in the swamps|in the mountains|anywhere} better than {in a city|among people|indoors}",
    "hunts {to survive|on commission|things that hunt others|what shouldn't exist}",
    "tracks {signs days old|invisible to others|across any terrain|as if they glowed}",
    "knows {which plants|which mushrooms|which berries|which roots} {nourish|poison|heal|send you to sleep} and {never gets it wrong|teaches it to few|keeps it to themselves}",
    "reads {the wind|the clouds|the ground|animal behaviour} like {others read a book|an instinct|someone who grew up outdoors|nobody else}",
    "survives {without fire|without water|without shelter|without food} for {days|weeks|as long as it takes|longer than anyone}",
    "communicates with {animals|horses|dogs|crows} in a way that {nobody understands|seems unnatural|gets results|unsettles those watching}",

    // Transport and navigation
    "carries {goods|messages|people|secrets} where {others don't dare|nobody asks questions|the price is high|they shouldn't be going}",
    "knows {every road|the secret paths|the passages|the borders} better than {whoever built them|any map|those born there}",
    "navigates {in a storm|at night|without stars|toward places that don't appear on any map}",
    "guides {caravans|fugitives|goods|armies} through {hostile territory|closed borders|war zones}",
    "knows {when to leave|which road to take|where to hide|how to avoid checkpoints} better than {any guide|someone born here|an up-to-date map}",
    "transports {cargo|people|messages|objects} that {nobody should see|weigh more than they look|are worth a fortune|are dangerous to carry}",
    "crosses {borders|rivers|mountains|deserts} like {someone who's done it a thousand times|they don't exist|they had a map in their head}",
    "knows {every port|every inn|every hideout|every shortcut} from here to {Thornwall|Grey Harbour|Karveth|wherever needed}",

    // Entertainment and influence
    "sings {stories|ballads|songs} that {make soldiers weep|nobody wants to hear|tell too much|open doors}",
    "convinces {anyone|nobles|guards|merchants} to do {almost anything|whatever is needed|things they regret|things they'd rather not}",
    "tells {stories|lies|truths} that {seem real|change people's minds|nobody forgets}",
    "draws {maps|portraits|symbols|plans} of {forgotten places|for whoever pays|secret routes|fortresses}",
    "knows how to {calm a brawl|rouse a crowd|pacify a riot|create a distraction} with {a few words|a gesture|a song|the right timing}",
    "reads {faces|intentions|fears|desires} in whoever stands before them {like an open book|before they speak|better than they'd like}",
    "plays {dice|cards|chess|deception} {better than anyone|always cheating|never losing|for money or information}",
    "negotiates {prices|pacts|truces|releases} with {a calm that frightens|a smile|well-chosen words|the patience of someone with time to spare}",

    // Specific trades
    "can {pilot|manoeuvre|repair|build} {boats|rafts|carts|sleds} with {salvaged materials|whatever they find|bare hands|impressive speed}",
    "writes {letters|contracts|wills|confessions} for {those who can't|whoever pays|whoever needs it|anyone who asks}",
    "counts {coins|supplies|heads|exits} faster than {anyone|a banker|whoever is watching|seems possible}",
    "can {light a fire|set up camp|lay a trap|improvise a shelter} in {any conditions|under a minute|total darkness|complete silence}",
    "shoots {a bow|a sling|a knife|a crossbow} hitting {targets|objectives|points} that {others can't see|seem impossible|require a steady hand}",
  ],

  // =============================================
  // REPUTATION SOURCES (~42 entries)
  // Must end with "that" to work with claims starting with "they"
  // Result: "[source] that they [verb]"
  // =============================================

  reputationSources: [
    "The legend says that",
    "Word has it that",
    "Some people think that",
    "Those who know them say that",
    "The stories tell that",
    "Everyone knows that",
    "Some suspect that",
    "Someone once said that",
    "Rumours are going around that",
    "There are those who swear that",
    "The oldest ones remember that",
    "In certain taverns they say that",
    "Anyone who's had enough to drink will tell you that",
    "Some maintain that",
    "Those in the know say that",
    "Anyone who's crossed their path says that",
    "Among the merchants it's whispered that",
    "The guards suspect that",
    "Children tell that",
    "Those who survived swear that",
    "In the slums they whisper that",
    "The sailors say that",
    "Anyone who frequents the arenas knows that",
    "Word from the prisons is that",
    "The gravediggers say that",
    "Among the smugglers it's known that",
    "Those who work the docks tell that",
    "The spies confirm that",
    "The veteran soldiers swear that",
    "Among the healers the word is that",
    "Anyone who knows the roads says that",
    "Those in debt know full well that",
    "The brothel workers whisper that",
    "Those who frequent the black markets know that",
    "The jailers say that",
    "Those who travel by night know that",
    "The smiths in the quarter say that",
    "Among the exiles it's whispered that",
    "The widows of the port say that",
    "Anyone who's tried to follow them says that",
    "The beggars swear that",
    "In certain circles it's known that",
  ],

  // =============================================
  // REPUTATION CLAIMS (~65 entries)
  // Must start with "they" + past tense verb
  // so that "[source] that they [verb]" reads correctly
  // =============================================

  reputationClaims: [
    // Feats
    "they {defeated|tricked|robbed} a {dragon|demon|king|archmage} {without help|for a bet|in impossible circumstances}",
    "they {stole|destroyed|hid} {the crown|an artefact|a treasure|the secrets} of {a king|a guild|a temple|an empire}",
    "they crossed {the desert|the mountains|the sea|the abyss} {without water|alone|in three days|and came back}",
    "they are {the only person|the first|the last} to have {got out of|returned from|survived|escaped from} {that prison|that tomb|that place|that battle}",
    "they {looted|emptied|destroyed|set fire to} {an armoury|a bank|a temple|a barracks|a royal storehouse} in a single night",
    "they {won|lost|rigged|interrupted} {a tournament|a duel|a race|a wager} that {nobody forgets|changed the rules|still costs lives}",
    "they {freed|captured|escorted|saved} {a prisoner|a noble|a mage|a condemned person} from {a fortress|a tower|a ship|an execution}",
    "they walked for {three days|a week|a month} with {an arrow in their side|a broken arm|an open wound|their hands tied} without {stopping|complaining|falling}",

    // Hidden identities
    "they have {noble|cursed|demonic|royal|fae} blood in their veins",
    "they are really {a noble|an assassin|a spy|an exile|someone else} under a false name",
    "they hide {another face|another identity|a past|scars} that {nobody suspects|are worth a fortune|could get them killed}",
    "they are {the heir|the bastard|the executioner|the traitor} of {a great house|a kingdom|a prophecy|a legend}",
    "they have {at least three|five|more than ten} {names|identities|past lives|empty graves} in {as many cities|different kingdoms|official records}",
    "they are {the same person|the ghost|the successor|the accomplice} of {a famous criminal|a fallen hero|a legend|someone who should be dead}",
    "they carry {a seal|a tattoo|a brand|a scar} that links them to {an extinct house|a secret order|a cult|something ancient}",
    "they {stole|bought|inherited|forged} {a title|a name|a lineage|an identity} that doesn't belong to them",

    // Powers and curses
    "they don't {sleep|eat|bleed|age|feel pain} {normally|the way others do|any more|in the usual way}",
    "they can {speak with the dead|see the future|sense lies|walk in dreams|vanish into shadows}",
    "they bring {misfortune|death|ruin|change|war} to whoever {stays close|trusts them|betrays them|hires them}",
    "they made a pact with {a demon|something ancient|death|what shall not be named|forces they don't understand}",
    "they are {immune|bound|condemned|promised} to {poisons|cold iron|a prophecy|something worse}",
    "they have {a shadow|a reflection|a heartbeat|a breath} that {doesn't behave normally|follows its own rules|appears different|is missing entirely}",
    "they are {already dead|born twice|returned from somewhere|not entirely alive} and {don't know it|hide it|bear the signs}",
    "they have {an eye|a hand|an ear|a scar} that {sees things|hears things|knows things|reacts to things} that {the rest of the body shouldn't|don't belong to this world}",
    "they attract {ghosts|trouble|animals|storms|silence} wherever {they go|they stop|they sleep|they stay too long}",

    // Crimes and enemies
    "they have a price on their head in {three kingdoms|more cities than they admit|places they'll never visit|the whole continent}",
    "they betrayed {their own guild|a sacred oath|someone who trusted them|a blood pact} and are still alive",
    "they are {in debt|at war|in business} with {the thieves' guild|a cult|the crown|someone dangerous}",
    "they {robbed|humiliated|betrayed} {the wrong person|someone powerful|someone they shouldn't have|too many people}",
    "they know {the true name|the location|the weakness|the secrets} of {a demon|whoever is in power|something ancient|whoever is hunting them}",
    "they {poisoned|blackmailed|deceived|challenged} {a noble|a judge|a general|a priest} and {are still standing|got away with it|nobody can prove it}",
    "they left {corpses|debts|enemies|ruins} in every {city|port|kingdom|tavern} where {they set foot|they worked|they slept}",
    "they are {wanted|banished|condemned|cursed} in {at least three|five|more than ten} {kingdoms|cities|guilds|temples} for {different crimes|the same crime|reasons nobody understands}",
    "they {cheated|robbed|deceived|humiliated} the {thieves' guild|merchants' guild|royal guard|church} and {are still alive|can't be found|are still laughing about it}",

    // Possessions
    "they guard {a map|a key|a seal|a secret} to {a lost treasure|something dangerous|no one knows what|a place that doesn't exist}",
    "they own {a weapon|an artefact|a book|a ring} that {shouldn't exist|others are searching for|has a will of its own|kills whoever touches it}",
    "they {hid|buried|lost|sold} a fortune in {gold|gems|secrets|artefacts} somewhere",
    "they always carry {a dagger|a ring|an amulet|a vial} that {they show to nobody|they never take off|glows in the dark|has a history}",
    "they have {a room|a chest|a hiding place|a depot} full of {weapons|poisons|documents|gold|bones} that {nobody has ever seen|they protect with their life|they'll open one day}",
    "they own {a map|a diary|a code|a letter} that {leads to ruin|is worth a fortune|someone has killed to get|they can't yet read}",

    // Supernatural events
    "they {changed|were reborn|disappeared and came back} {once|twice|during an eclipse|in impossible circumstances}",
    "they saw {the future|their own death|the other side|too much} and {won't speak of it|it torments them|they're waiting}",
    "they were {touched|branded|chosen|cursed} by {a god|a demon|something|death itself}",
    "they {spoke|walked|drank|slept} with {death|a god|a dragon|something with no name} and {came back|bear the mark|are not the same}",
    "they have seen {things|places|creatures|events} that {shouldn't exist|the mind rejects|drove others mad|they won't recount}",
    "they {returned|survived|escaped} from {a place|a dimension|a nightmare|a death} that {has no exit|no one else has seen|shouldn't be possible}",

    // Impossible abilities
    "they have never {lost a wager|missed a shot|told the truth|shown fear}",
    "they {counted|visited|mapped|robbed} every {tavern|prison|tomb|brothel} {in the kingdom|on the continent|known to exist}",
    "they know {the name|the history|the price|the secret} of {every poison|every blade|every lie|anyone they meet}",
    "they can {vanish from|enter|exit} {any place|any situation|any prison} without anyone noticing",
    "they can endure {any poison|any pain|any torture|any cold} without {effect|complaint|dying|yielding}",
    "they haven't {slept|wept|smiled|asked for help|lost an arm-wrestle} since {as long as people have known them|they arrived|it happened|they made that pact}",
    "they know {the name|the price|the weakness|the location} of {every hired killer|every corrupt guard|every secret exit|every corpse} in {this city|this kingdom|these lands}",
    "they {ate|drank|slept|fought} with {a dragon|a demon|death|a god} and {speak of it as if it were normal|are still here|tell nobody about it}",

    // Relationships and debts
    "they {saved|betrayed|sold|married} the {daughter|son|relative|emissary} of {a king|a warlord|a guild master|someone who doesn't forgive}",
    "they {swore loyalty to|broke a pact with|formed an alliance with|declared war on} {an order|a cult|a great house|a force} that {never forgets|never forgives|is still looking for them|is waiting}",
    "they are {the only person|the first|the last} to whom {a dragon|a demon|a god|a king} ever {spoke|asked for help|granted a favour|spared their life}",
    "they have {a bounty|a sentence|a warrant|a contract} issued by {three guilds|the crown|a temple|every city where they set foot} and {nobody knows it|they don't care|they brag about it}",
    "they have {planted|sown|scattered|hidden} {traps|poisons|secrets|false information} in {half the city|three kingdoms|every port|every tavern they frequent}",
    "they won {a game|a duel|a wager|a bet} against {death|the devil|a minor god|something that shouldn't lose} and {bear the mark|it still haunts them|won't speak of it}",
    "they know {the entrance|the password|the passage|the combination} to {every prison|every vault|every secret passage|places that shouldn't have doors}",
  ],

  // =============================================
  // CURRENT STATES (~65 entries)
  // What the character does/seeks/wants NOW
  // Full clause with subject "they" — used as "[connector], [state]"
  // =============================================

  currentStates: [
    // Revenge and justice
    "they seek {revenge|whoever betrayed them|whoever killed|whoever must pay}",
    "they are hunting {a traitor|a killer|whoever took everything|someone who doesn't know they're being hunted}",
    "they are waiting for {the right moment|the target to show themselves|the opportunity|the enemy's weakness}",
    "they are gathering {evidence|allies|strength|information} to {strike|take revenge|bring someone down|execute a plan}",
    "they are searching for {a face|a name|a voice|a scar} that {they would know among a thousand|they can't forget|they saw only once}",
    "they are counting the days {remaining|needed|left} before {striking|returning|closing the circle|keeping the promise}",
    "they are following {a lead|a clue|a name|a trail} that {is going cold|leads far away|others have abandoned|could be a trap}",
    "they keep {a list|a tally|a register|a diary} of {names|debts|wrongs|deaths} that {is getting shorter|is getting longer|never ends}",

    // Redemption and escape
    "they seek {redemption|peace|forgiveness|a way to make amends}",
    "they are running from {their own past|whoever is searching for them|something that is closing in|a sentence}",
    "they want only to {disappear|be forgotten|start over|be left in peace}",
    "they are trying to {forget|change|atone|leave everything behind}",
    "they are looking for a place where {nobody asks questions|the past can't reach|they can start again|they can die in peace}",
    "they avoid {large cities|crowded places|those who ask questions|anyone who might recognise them}",
    "they have changed {their name|their city|their appearance|their habits} {three times|recently|lately|once again} to {escape|start over|hide|forget}",
    "they carry {a weight|a sense of guilt|a memory|a debt} that {doesn't lighten|grows every day|slows them down|won't let them sleep}",

    // Search
    "they seek {answers|someone they've lost|a legendary place|a cure}",
    "they are searching for {an artefact|a book|a person|a path} that {might not exist|others are searching for|can no longer be found}",
    "they follow {a lead|a map|a voice|a dream} toward {something|a place|someone} that perhaps doesn't exist",
    "they want to find {the truth|whoever owes them something|a way back|what really happened}",
    "they seek {an ingredient|a material|a formula|a text} {to complete something|for a cure|for a weapon|for a ritual}",
    "they chase {a legend|a myth|a rumour|a tale} that {could be true|others have abandoned|they heard from a dying person}",
    "they are piecing together {the fragments|the clues|the story|the map} of {a mystery|a crime|a disappearance|something ancient}",
    "they seek {a door|a passage|a key|a way in} to {a place|a crypt|a tower|something} that {should be closed|no one has found|doesn't appear on any map}",

    // Survival and work
    "they seek only {gold|the next job|enough to move on|a way to survive}",
    "they work for {whoever pays|to survive|no master|something greater}",
    "they take {any job|only certain commissions|whatever comes along|what others refuse}",
    "they live {one day at a time|as if there's no tomorrow|in hiding|on the margins}",
    "they are setting aside {money|supplies|contacts|favours} for {when it'll be needed|the escape|a plan|winter}",
    "they do {what's necessary|what needs doing|what others wouldn't|the dirty work} to {eat|pay a debt|not die|whoever pays}",
    "they accept {assignments|jobs|missions|tasks} that {nobody wants|pay well|are dangerous|require no questions}",
    "they survive by {selling information|doing favours|stealing what's needed|with trades that change every week}",

    // Protection and secrets
    "they protect {a secret|someone|a place|something} that they can't explain",
    "they guard {a promise|an object|a piece of information|a person} with their life",
    "they keep {hidden|safe|secret|at a distance} something that others {want|are looking for|would pay for|would kill to have}",
    "they wait for {someone to return|a signal|the right moment|instructions}",
    "they watch over {a place|a person|a passage|an object} without {knowing why|being able to explain|anyone having asked them}",
    "they carry {a load|a message|an object|a key} that {they must deliver|they can't open|weighs on them|someone wants}",
    "they keep watch over {a child|a secret|a grave|a prisoner} that {they can't abandon|could be the key|nobody else would protect}",
    "they hide {a past|a talent|an object|an identity} out of {safety|habit|fear|an oath}",

    // Planning
    "they are planning {something big|a departure|a heist|a return}",
    "they are gathering {favours|allies|resources|debts} for {when they'll be needed|something big|not being left with nothing}",
    "they are putting together {a team|a plan|the pieces|the resources} for {a job|an enterprise|revenge|escape}",
    "they have been preparing {a trap|a betrayal|an escape|something} for {months|years|since it all began}",
    "they are studying {a target|a fortress|an enemy|a route} with {patience|obsession|method|maniacal attention}",
    "they are waiting for {the right moment|the right phase of the moon|a shift change|someone to make a mistake} to {strike|enter|escape|act}",
    "they are building {a network|an organisation|a supply cache|a refuge} for {the future|when it'll be needed|protection|something they don't explain}",
    "they are moving {pawns|people|money|information} like pieces in {a game of chess|a game only they can see|a plan|a waiting game}",

    // Existential
    "they no longer know {what to look for|who they are|why they keep going|which side to be on}",
    "they keep {busy|moving|away from trouble|awake} to avoid thinking",
    "they wait for {death|an answer|something|without knowing what}",
    "they have stopped {searching|hoping|trusting|running} and are seeing what happens",
    "they drink {to forget|to sleep|too much|every evening} and {won't admit it|know it|don't care|it's the only thing that works}",
    "they walk {with no aim|toward the east|until exhausted|because stopping is worse}",
    "they talk {to themselves|to the dead|to nobody|too little} and {don't notice|know it|don't care|it worries those who see}",
    "they have stopped {making plans|being afraid|feeling anything|counting the days} and {keep going|wait|survive|drag on}",

    // Debts and obligations
    "they owe {a favour|a life|money|an answer} to someone who {will come to collect sooner or later|never forgets|is dangerous}",
    "they are paying back {a debt|a promise|a wrong|a life} that will never fully be settled",
    "they are finishing {one last job|one last task|one last delivery|a promise} before {disappearing|retiring|leaving it all behind|closing the book}",
    "they keep {a promise|a pact|an obligation|a service} that {they didn't choose|weighs on them every day|they can't walk away from|ties them to someone dangerous}",
  ],

  // =============================================
  // CURRENT CONNECTORS (~28 entries)
  // =============================================

  currentConnectors: [
    "Now", "These days", "Since then", "After all of this",
    "Despite everything", "Because of this", "And so", "At this point",
    "In the meantime", "Lately", "More recently",
    "Since that day", "After that night", "Since it all happened",
    "By now", "Ever since", "Still today",
    "Years later", "With nothing left to lose",
    "With what's left", "After everything",
    "Since that time", "With time",
    "In the end", "As the years have passed",
    "Since everything changed", "After losing it all",
    "Without looking back"
  ],

  patternConnectors: {
    patternD: (place, name) => `At ${place}, ${name}`,
    patternD_mid: 'Shortly after, they',
    patternE_intro: (name) => `Little is known of ${name}.`,
    patternF_mid: (place) => `At ${place}, they`,
    formationSubject: 'They'
  }
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
