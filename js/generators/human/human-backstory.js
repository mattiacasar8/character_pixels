import { data, poolNames } from '../../data/human-backstory-data.js';

export class HumanBackstoryGenerator {
    constructor() {
        this.shuffledPools = new Map();
    }

    // --- CORE UTILITIES ---

    /**
     * Resolves nested templates like {a|b|c}
     */
    resolve(template) {
        let result = template;
        let safety = 10; // Prevent infinite loops

        while (result.includes('{') && safety > 0) {
            result = result.replace(/\{([^{}]+)\}/g, (match, content) => {
                const options = content.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
            safety--;
        }

        return result;
    }

    /**
     * Fisher-Yates shuffle
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Picks an element from a pool using shuffle logic to avoid repetitions
     */
    pick(array, poolName = null) {
        if (!array || array.length === 0) return "???";

        if (!poolName) {
            return array[Math.floor(Math.random() * array.length)];
        }

        let pool = this.shuffledPools.get(poolName);
        if (!pool || pool.length === 0) {
            pool = this.shuffleArray(array);
            this.shuffledPools.set(poolName, pool);
        }

        return pool.pop();
    }

    /**
     * Resets all shuffled pools
     */
    resetPools() {
        this.shuffledPools.clear();
    }

    // --- GENERATORS ---

    getPlace() {
        return this.pick(data.places, poolNames.PLACES);
    }

    getOrigin(name, place) {
        const phraseFn = this.pick(data.originPhrases, poolNames.ORIGINS);
        return this.resolve(phraseFn(name, place));
    }

    getFormation() {
        const phrase = this.pick(data.formationPhrases, poolNames.FORMATIONS);
        return this.resolve(phrase);
    }

    getSkill() {
        const phrase = this.pick(data.skillPhrases, poolNames.SKILLS);
        return this.resolve(phrase);
    }

    getReputation() {
        const source = this.pick(data.reputationSources, poolNames.REP_SOURCES);
        const claim = this.pick(data.reputationClaims, poolNames.REP_CLAIMS);
        return `${source} ${this.resolve(claim)}`;
    }

    getCurrentState() {
        const connector = this.pick(data.currentConnectors); // No pool needed for connectors usually, or use random
        const state = this.pick(data.currentStates, poolNames.CURRENTS);
        return `${connector}, ${this.resolve(state)}`;
    }

    // --- PATTERNS ---

    generate(name, patternKey = null) {
        // Capitalize name just in case
        const cleanName = name.charAt(0).toUpperCase() + name.slice(1);

        const patterns = {
            patternA: () => {
                // Origin + Formation + Current
                const place = this.getPlace();
                const origin = this.getOrigin(cleanName, place);
                const formation = this.getFormation();
                const current = this.getCurrentState();
                return `${origin}. ${formation}. ${current}.`;
            },
            patternB: () => {
                // Origin + Skill + Reputation
                const place = this.getPlace();
                const origin = this.getOrigin(cleanName, place);
                const skill = this.getSkill();
                const reputation = this.getReputation();
                return `${origin}. ${skill}. ${reputation}.`;
            },
            patternC: () => {
                // Skill + Mystery + Current
                const skill = this.getSkill();
                const reputation = this.getReputation(); // Mystery often comes from reputation
                const current = this.getCurrentState();
                return `${cleanName} ${skill}. ${reputation}. ${current}.`;
            },
            patternD: () => {
                // Double Formation (Dramatic)
                const place = this.getPlace();
                const formation1 = this.getFormation();
                const formation2 = this.getFormation(); // Shuffle ensures different one
                return `A ${place}, ${cleanName} ${formation1}. Poco dopo, ${formation2}.`;
            },
            patternE: () => {
                // Reputation-heavy
                const rep1 = this.getReputation();
                const rep2 = this.getReputation();
                const current = this.getCurrentState();
                return `Di ${cleanName} si sa poco. ${rep1}. ${rep2}. ${current}.`;
            },
            patternF: () => {
                // Skill + Formation
                const skill = this.getSkill();
                const place = this.getPlace();
                const formation = this.getFormation(); // Often implies origin of skill
                return `${cleanName} ${skill}. A ${place}, ${formation}.`;
            }
        };

        let selectedPattern;
        if (patternKey && patterns[patternKey]) {
            selectedPattern = patterns[patternKey];
        } else {
            const keys = Object.keys(patterns);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            selectedPattern = patterns[randomKey];
        }

        return selectedPattern();
    }
}
