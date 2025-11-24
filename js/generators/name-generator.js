import { humanNameData } from '../data/human-names-data.js';

export class NameGenerator {
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

    generateUniqueFilename(baseName) {
        // Add random ID for file uniqueness
        const randomID = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        // Remove spaces and special characters for filename safety
        const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, '_');
        return `${safeName}_${randomID}`;
    }
}

export const nameGenerator = new NameGenerator();
