// Random Utilities
import { FANTASY_PALETTES } from '../config.js';

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function generateRandomPalette() {
    // 70% chance to use preset palette, 30% chance for random
    if (Math.random() < 0.7) {
        // Use a fantasy palette
        const paletteIndex = Math.floor(Math.random() * FANTASY_PALETTES.length);
        return [...FANTASY_PALETTES[paletteIndex]]; // Return a copy
    } else {
        // Generate random palette
        const numColors = randomInt(3, 5);
        const palette = [];
        for (let i = 0; i < numColors; i++) {
            palette.push({
                r: randomInt(50, 255),
                g: randomInt(50, 255),
                b: randomInt(50, 255)
            });
        }
        return palette;
    }
}
