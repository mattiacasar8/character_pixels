/**
 * Human Backstory Generator
 * Generates procedural fantasy backstories for human characters.
 * Extends BackstoryGenerator for shared utilities.
 */
import { BackstoryGenerator } from '../backstory-generator.js';
import { data as ita, poolNames as pn_ita } from '../../data/human-backstory-data_ita.js';
import { data as eng, poolNames as pn_eng } from '../../data/human-backstory-data_eng.js';

const DATA_BY_LANG = { ita, eng };
const POOL_BY_LANG = { ita: pn_ita, eng: pn_eng };

export class HumanBackstoryGenerator extends BackstoryGenerator {
    constructor(lang = 'ita') {
        super();
        this.data = DATA_BY_LANG[lang] || DATA_BY_LANG.ita;
        this.poolNames = POOL_BY_LANG[lang] || POOL_BY_LANG.ita;
    }

    // --- DATA GETTERS ---

    getPlace() {
        return this.pick(this.data.places, this.poolNames.PLACES);
    }

    getOrigin(name, place) {
        const phraseFn = this.pick(this.data.originPhrases, this.poolNames.ORIGINS);
        return this.resolve(phraseFn(name, place));
    }

    getFormation() {
        const phrase = this.pick(this.data.formationPhrases, this.poolNames.FORMATIONS);
        return this.resolve(phrase);
    }

    getSkill() {
        const phrase = this.pick(this.data.skillPhrases, this.poolNames.SKILLS);
        return this.resolve(phrase);
    }

    getReputation() {
        const source = this.pick(this.data.reputationSources, this.poolNames.REP_SOURCES);
        const claim = this.pick(this.data.reputationClaims, this.poolNames.REP_CLAIMS);
        return `${source} ${this.resolve(claim)}`;
    }

    getCurrentState() {
        const connector = this.pick(this.data.currentConnectors);
        const state = this.pick(this.data.currentStates, this.poolNames.CURRENTS);
        return `${connector}, ${this.resolve(state)}`;
    }

    // --- PATTERNS ---

    generate(name, patternKey = null) {
        const cleanName = this.capitalize(name);

        const patterns = {
            patternA: () => {
                // Origin + Formation + Current
                const conn = this.data.patternConnectors;
                const place = this.getPlace();
                const origin = this.getOrigin(cleanName, place);
                const formation = this.getFormation();
                const current = this.getCurrentState();
                const formationSentence = conn.formationSubject
                    ? `${conn.formationSubject} ${formation}`
                    : this.capitalize(formation);
                return `${origin}. ${formationSentence}. ${current}.`;
            },
            patternB: () => {
                // Origin + Skill + Reputation
                const place = this.getPlace();
                const origin = this.getOrigin(cleanName, place);
                const skill = this.getSkill();
                const reputation = this.getReputation();
                return `${origin}. ${this.capitalize(skill)}. ${reputation}.`;
            },
            patternC: () => {
                // Skill + Mystery + Current
                const skill = this.getSkill();
                const reputation = this.getReputation();
                const current = this.getCurrentState();
                return `${cleanName} ${skill}. ${reputation}. ${current}.`;
            },
            patternD: () => {
                // Double Formation (Dramatic)
                const conn = this.data.patternConnectors;
                const place = this.getPlace();
                const formation1 = this.getFormation();
                const formation2 = this.getFormation();
                return `${conn.patternD(place, cleanName)} ${formation1}. ${conn.patternD_mid} ${formation2}.`;
            },
            patternE: () => {
                // Reputation-heavy
                const conn = this.data.patternConnectors;
                const rep1 = this.getReputation();
                const rep2 = this.getReputation();
                const current = this.getCurrentState();
                return `${conn.patternE_intro(cleanName)} ${rep1}. ${rep2}. ${current}.`;
            },
            patternF: () => {
                // Skill + Formation
                const conn = this.data.patternConnectors;
                const skill = this.getSkill();
                const place = this.getPlace();
                const formation = this.getFormation();
                return `${cleanName} ${skill}. ${conn.patternF_mid(place)} ${formation}.`;
            }
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

        return selectedPattern();
    }
}
