import { monsterNameData } from '../../data/monster-names-data.js';

export class MonsterNameGenerator {
    constructor() {
        this.prefixes = monsterNameData.prefixes;
        this.suffixes = monsterNameData.suffixes;
        this.titles = monsterNameData.titles;
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
