import { monsterBackstoryData, poolNames } from '../../data/monster-backstory-data.js';
import { SeededRandom } from '../../utils/random.js';

export class MonsterBackstoryGenerator {
    constructor() {
        this.data = monsterBackstoryData;
        this.shuffledPools = new Map();
        // Use a random seed for internal shuffling if needed, 
        // but typically we want randomness per generation call.
    }

    generate(name) {
        // Pick a random pattern
        const patterns = [
            this.patternA.bind(this),
            this.patternB.bind(this),
            this.patternC.bind(this),
            this.patternD.bind(this),
            this.patternE.bind(this),
            this.patternF.bind(this)
        ];

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        return pattern(name);
    }

    // --- Patterns ---

    // Origin + Formation + Current
    patternA(name) {
        const place = this.pick(this.data.places, poolNames.PLACES);
        const originFunc = this.pick(this.data.originPhrases, poolNames.ORIGINS);
        const origin = this.resolve(originFunc(name, place));

        const formation = this.resolve(this.pick(this.data.formationPhrases, poolNames.FORMATIONS));
        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, poolNames.CURRENTS));

        return `${origin}. ${this.capitalize(formation)}. ${connector} ${current}.`;
    }

    // Origin + Skill + Reputation
    patternB(name) {
        const place = this.pick(this.data.places, poolNames.PLACES);
        const originFunc = this.pick(this.data.originPhrases, poolNames.ORIGINS);
        const origin = this.resolve(originFunc(name, place));

        const skill = this.resolve(this.pick(this.data.skillPhrases, poolNames.SKILLS));

        const repSource = this.pick(this.data.reputationSources, poolNames.REP_SOURCES);
        const repClaim = this.resolve(this.pick(this.data.reputationClaims, poolNames.REP_CLAIMS));

        return `${origin}. ${name} ${skill}. ${repSource} ${repClaim}.`;
    }

    // Skill + Mystery + Current
    patternC(name) {
        const skill = this.resolve(this.pick(this.data.skillPhrases, poolNames.SKILLS));

        const repSource = this.pick(this.data.reputationSources, poolNames.REP_SOURCES);
        const repClaim = this.resolve(this.pick(this.data.reputationClaims, poolNames.REP_CLAIMS));

        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, poolNames.CURRENTS));

        return `${name} ${skill}. ${repSource} ${repClaim}. ${connector} ${current}.`;
    }

    // Double Formation (dramatic)
    patternD(name) {
        const place = this.pick(this.data.places, poolNames.PLACES);
        // Custom start for this pattern
        const start = `A ${place}, ${name}`;

        const formation1 = this.resolve(this.pick(this.data.formationPhrases, poolNames.FORMATIONS));
        const formation2 = this.resolve(this.pick(this.data.formationPhrases, poolNames.FORMATIONS));

        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, poolNames.CURRENTS));

        return `${start} ${formation1}. Poi ${formation2}. ${connector} ${current}.`;
    }

    // Reputation-heavy
    patternE(name) {
        const repSource1 = this.pick(this.data.reputationSources, poolNames.REP_SOURCES);
        const repClaim1 = this.resolve(this.pick(this.data.reputationClaims, poolNames.REP_CLAIMS));

        const repSource2 = this.pick(this.data.reputationSources, poolNames.REP_SOURCES);
        const repClaim2 = this.resolve(this.pick(this.data.reputationClaims, poolNames.REP_CLAIMS));

        const current = this.resolve(this.pick(this.data.currentStates, poolNames.CURRENTS));

        return `${repSource1} ${name} ${repClaim1}. ${repSource2} ${repClaim2}. Intanto, ${current}.`;
    }

    // Skill + Formation
    patternF(name) {
        const skill = this.resolve(this.pick(this.data.skillPhrases, poolNames.SKILLS));
        const place = this.pick(this.data.places, poolNames.PLACES);
        const formation = this.resolve(this.pick(this.data.formationPhrases, poolNames.FORMATIONS));
        const current = this.resolve(this.pick(this.data.currentStates, poolNames.CURRENTS));

        return `${name} ${skill}. A ${place}, ${formation}. ${this.capitalize(current)}.`;
    }

    // --- Helpers ---

    resolve(template) {
        let result = template;
        let safety = 10;

        while (result.includes('{') && safety > 0) {
            result = result.replace(/\{([^{}]+)\}/g, (match, content) => {
                const options = content.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
            safety--;
        }
        return result;
    }

    pick(array, poolName = null) {
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

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    resetPools() {
        this.shuffledPools.clear();
    }
}
