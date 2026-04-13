/**
 * Human Name Generator
 * Generates fantasy human names using prefix + suffix system with optional titles.
 */
import { humanNameData as ita } from '../../data/human-names-data_ita.js';
import { humanNameData as eng } from '../../data/human-names-data_eng.js';

const DATA_BY_LANG = { ita, eng };

export class HumanNameGenerator {
    constructor(lang = 'ita') {
        const d = DATA_BY_LANG[lang] || DATA_BY_LANG.ita;
        this.prefixes = d.prefixes;
        this.suffixes = d.suffixes;
        this.titles = d.titles;
    }

    generate(rng = null) {
        const rand = rng ? () => rng.next() : Math.random;
        const randInt = (len) => Math.floor(rand() * len);

        const prefix = this.prefixes[randInt(this.prefixes.length)];
        const suffix = this.suffixes[randInt(this.suffixes.length)];
        const name = prefix + suffix;

        // 30% chance to add a title
        if (rand() < 0.3) {
            const title = this.titles[randInt(this.titles.length)];
            return `${name} ${title}`;
        }

        return name;
    }
}
