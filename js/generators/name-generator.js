/**
 * Unified Name Generator
 * Provides a single interface for generating names for any character type.
 * Delegates to type-specific generators (human, monster).
 */
import { HumanNameGenerator } from './human/human-names.js';
import { MonsterNameGenerator } from './monster/monster-names.js';

class NameGeneratorManager {
    constructor() {
        this.humanGenerator = new HumanNameGenerator();
        this.monsterGenerator = new MonsterNameGenerator();
    }

    /**
     * Generate a name for the specified type.
     * @param {string} type - 'human' or 'monster'
     * @returns {string} Generated name
     */
    generate(type = 'human') {
        switch (type) {
            case 'monster':
                return this.monsterGenerator.generate();
            case 'human':
            default:
                return this.humanGenerator.generate();
        }
    }

    /**
     * Generate a unique filename from a character name.
     * @param {string} baseName - The character's name
     * @returns {string} Safe filename with unique ID
     */
    generateUniqueFilename(baseName) {
        const randomID = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, '_');
        return `${safeName}_${randomID}`;
    }
}

// Export singleton instance for convenience
export const nameGenerator = new NameGeneratorManager();

// Also export the class and type-specific generators for direct use
export { NameGeneratorManager, HumanNameGenerator, MonsterNameGenerator };
