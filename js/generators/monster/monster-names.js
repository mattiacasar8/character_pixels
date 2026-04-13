import { monsterNameData as ita } from '../../data/monster-names-data_ita.js';
import { monsterNameData as eng } from '../../data/monster-names-data_eng.js';

const DATA_BY_LANG = { ita, eng };

export class MonsterNameGenerator {
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

        let name = prefix + suffix;

        // Chance for a title
        if (rand() < 0.3) {
            const title = this.titles[randInt(this.titles.length)];
            name += ` ${title}`;
        }

        return name;
    }
}
