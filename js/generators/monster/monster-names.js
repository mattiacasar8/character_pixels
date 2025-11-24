import { randomInt } from '../../utils/random.js';
import { monsterNameData } from '../../data/monster-names-data.js';

export class MonsterNameGenerator {
    constructor() {
        this.prefixes = monsterNameData.prefixes;
        this.suffixes = monsterNameData.suffixes;
        this.titles = monsterNameData.titles;
    }

    generate() {
        const prefix = this.prefixes[randomInt(0, this.prefixes.length - 1)];
        const suffix = this.suffixes[randomInt(0, this.suffixes.length - 1)];

        let name = prefix + suffix;

        // Chance for a title
        if (Math.random() < 0.3) {
            const title = this.titles[randomInt(0, this.titles.length - 1)];
            name += ` ${title}`;
        }

        return name;
    }
}
