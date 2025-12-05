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

    generate() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const name = prefix + suffix;

        // 30% chance to add a title
        if (Math.random() < 0.3) {
            const title = this.titles[Math.floor(Math.random() * this.titles.length)];
            return `${name} ${title}`;
        }

        return name;
    }
}
