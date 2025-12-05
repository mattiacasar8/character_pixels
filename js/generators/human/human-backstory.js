/**
 * Human Backstory Generator
 * Generates procedural fantasy backstories for human characters.
 * Extends BackstoryGenerator for shared utilities.
 */
import { BackstoryGenerator } from '../backstory-generator.js';
import { data, poolNames } from '../../data/human-backstory-data.js';

export class HumanBackstoryGenerator extends BackstoryGenerator {
    constructor() {
        super();
        this.data = data;
        this.poolNames = poolNames;
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
                const place = this.getPlace();
                const origin = this.getOrigin(cleanName, place);
                const formation = this.getFormation();
                const current = this.getCurrentState();
                return `${origin}. ${this.capitalize(formation)}. ${current}.`;
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
                const place = this.getPlace();
                const formation1 = this.getFormation();
                const formation2 = this.getFormation();
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
                const formation = this.getFormation();
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
