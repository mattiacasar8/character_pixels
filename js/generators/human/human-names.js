/**
 * Human Name Generator
 * Generates fantasy human names using prefix + suffix system with optional titles.
 */
import { humanNameData } from '../../data/human-names-data.js';

export class HumanNameGenerator {
    constructor() {
        this.prefixes = humanNameData.prefixes;
        this.suffixes = humanNameData.suffixes;
        this.titles = humanNameData.titles;
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
