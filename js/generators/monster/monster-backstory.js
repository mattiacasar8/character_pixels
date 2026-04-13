/**
 * Monster Backstory Generator
 * Generates procedural dark fantasy backstories for monster characters.
 * Extends BackstoryGenerator for shared utilities.
 */
import { BackstoryGenerator } from '../backstory-generator.js';
import { monsterBackstoryData as ita, poolNames as pn_ita } from '../../data/monster-backstory-data_ita.js';
import { monsterBackstoryData as eng, poolNames as pn_eng } from '../../data/monster-backstory-data_eng.js';

const DATA_BY_LANG = { ita, eng };
const POOL_BY_LANG = { ita: pn_ita, eng: pn_eng };

export class MonsterBackstoryGenerator extends BackstoryGenerator {
    constructor(lang = 'ita') {
        super();
        this.data = DATA_BY_LANG[lang] || DATA_BY_LANG.ita;
        this.poolNames = POOL_BY_LANG[lang] || POOL_BY_LANG.ita;
    }

    // --- PATTERNS ---

    generate(name, patternKey = null) {
        const patterns = {
            patternA: this.patternA.bind(this),
            patternB: this.patternB.bind(this),
            patternC: this.patternC.bind(this),
            patternD: this.patternD.bind(this),
            patternE: this.patternE.bind(this),
            patternF: this.patternF.bind(this)
        };

        let selectedPattern;
        if (patternKey && patterns[patternKey]) {
            selectedPattern = patterns[patternKey];
        } else {
            const keys = Object.keys(patterns);
            const random = this._rng ? () => this._rng.next() : Math.random;
            const randomKey = keys[Math.floor(random() * keys.length)];
            selectedPattern = patterns[randomKey];
        }

        return selectedPattern(name);
    }

    // Origin + Formation + Current
    patternA(name) {
        const conn = this.data.patternConnectors;
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const originFunc = this.pick(this.data.originPhrases, this.poolNames.ORIGINS);
        const origin = this.resolve(originFunc(name, place));

        const formation = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        const formationSentence = conn.formationSubject
            ? `${conn.formationSubject} ${formation}`
            : this.capitalize(formation);

        return `${origin}. ${formationSentence}. ${connector} ${current}.`;
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
        const conn = this.data.patternConnectors;
        const place = this.pick(this.data.places, this.poolNames.PLACES);

        const formation1 = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const formation2 = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));

        const connector = this.pick(this.data.currentConnectors);
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${conn.patternD_intro(place, name)} ${formation1}. ${conn.patternD_mid} ${formation2}. ${connector} ${current}.`;
    }

    // Reputation-heavy
    patternE(name) {
        const conn = this.data.patternConnectors;
        const repSource1 = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim1 = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        const repSource2 = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const repClaim2 = this.resolve(this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS));

        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        const rep1 = conn.patternE_name_insert
            ? `${repSource1} ${name} ${repClaim1}`
            : `${repSource1} ${repClaim1}`;

        return `${rep1}. ${repSource2} ${repClaim2}. ${conn.patternE_mid} ${current}.`;
    }

    // Skill + Formation
    patternF(name) {
        const conn = this.data.patternConnectors;
        const skill = this.resolve(this.pick(this.data.skillPhrases, this.poolNames.SKILLS));
        const place = this.pick(this.data.places, this.poolNames.PLACES);
        const formation = this.resolve(this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS));
        const current = this.resolve(this.pick(this.data.currentStates, this.poolNames.CURRENTS));

        return `${name} ${skill}. ${conn.patternF_intro(place)} ${formation}. ${this.capitalize(current)}.`;
    }
}
