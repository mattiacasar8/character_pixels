/**
 * Base Backstory Generator
 * Provides shared utilities for generating procedural backstories.
 * Human and Monster generators extend this class with their own data and patterns.
 */

export class BackstoryGenerator {
    constructor() {
        this.shuffledPools = new Map();
        this.data = null; // Subclasses must set this
    }

    // --- CORE UTILITIES ---

    /**
     * Resolves nested templates like {a|b|c}
     * Randomly picks one option from each set of alternatives.
     * @param {string} template - Template string with {option1|option2|...} syntax
     * @returns {string} Resolved string with random choices made
     */
    resolve(template) {
        let result = template;
        let safety = 10; // Prevent infinite loops

        while (result.includes('{') && safety > 0) {
            result = result.replace(/\{([^{}]+)\}/g, (match, content) => {
                const options = content.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
            safety--;
        }

        return result;
    }

    /**
     * Fisher-Yates shuffle
     * @param {Array} array - Array to shuffle
     * @returns {Array} New shuffled array (original unchanged)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Picks an element from a pool using shuffle logic to avoid repetitions.
     * If poolName is provided, maintains a shuffled pool to ensure variety.
     * @param {Array} array - Source array to pick from
     * @param {string|null} poolName - Pool identifier for shuffle tracking
     * @returns {*} Randomly selected element
     */
    pick(array, poolName = null) {
        if (!array || array.length === 0) return "???";

        if (!poolName) {
            return array[Math.floor(Math.random() * array.length)];
        }

        let pool = this.shuffledPools.get(poolName);
        if (!pool || pool.length === 0) {
            pool = this.shuffleArray(array);
            this.shuffledPools.set(poolName, pool);
        }

        return pool.pop();
    }

    /**
     * Capitalizes the first letter of a string
     * @param {string} str - Input string
     * @returns {string} String with first letter capitalized
     */
    capitalize(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Resets all shuffled pools - call between batches for fresh variety
     */
    resetPools() {
        this.shuffledPools.clear();
    }

    // --- ABSTRACT METHODS ---
    // Subclasses should implement generate(name, patternKey)

    generate(name, patternKey = null) {
        throw new Error('Subclasses must implement generate()');
    }
}
