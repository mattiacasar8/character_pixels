/**
 * Monster Backstory Generator
 * Generates procedural dark fantasy backstories for monster characters.
 * Extends BackstoryGenerator for shared utilities.
 */
import { BackstoryGenerator } from '../backstory-generator.js';
import { monsterBackstoryData, poolNames } from '../../data/monster-backstory-data.js';

export class MonsterBackstoryGenerator extends BackstoryGenerator {
    constructor() {
        super();
        this.data = monsterBackstoryData;
        this.poolNames = poolNames;
    }

    // --- PATTERNS ---

    generate(name) {
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

    // Origin + Formation + Current
    patternA(name) {
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const originFunc = this.pick(this.data.originPhrases, this.poolNames.ORIGINS);
        const origin = this.resolve(originFunc(name, place));

        const formation = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${origin}. ${this.capitalize(formation)}. ${connector} ${current}.`;
    }

    // Origin + Skill + Reputation
    patternB(name) {
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const originFunc = this.pick(this.data.originPhrases, this.poolNames.ORIGINS);
        const origin = this.resolve(originFunc(name, place));

        const skill = this.resolve(this.pick(this.data.skillPhrases, this.poolNames.SKILLS));

        const repSource = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        return `${origin}. ${name} ${skill}. ${repSource} ${repClaim}.`;
    }

    // Skill + Mystery + Current
    patternC(name) {
        const skill = this.resolve(this.pick(this.data.skillPhrases, this.poolNames.SKILLS));

        const repSource = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${name} ${skill}. ${repSource} ${repClaim}. ${connector} ${current}.`;
    }

    // Double Formation (dramatic)
    patternD(name) {
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const start = `A ${place}, ${name}`;

        const formation1 = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const formation2 = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));

        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${start} ${formation1}. Poi ${formation2}. ${connector} ${current}.`;
    }

    // Reputation-heavy
    patternE(name) {
        const repSource1 = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim1 = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        const repSource2 = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim2 = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${repSource1} ${name} ${repClaim1}. ${repSource2} ${repClaim2}. Intanto, ${current}.`;
    }

    // Skill + Formation
    patternF(name) {
        const skill = this.resolve(this.pick(this.data.skillPhrases, this.poolNames.SKILLS));
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const formation = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${name} ${skill}. A ${place}, ${formation}. ${this.capitalize(current)}.`;
    }
}
