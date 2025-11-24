// Random Utilities

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function generateRandomPalette() {
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
