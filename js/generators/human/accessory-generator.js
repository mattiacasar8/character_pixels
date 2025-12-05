
export class AccessoryGenerator {
    constructor() { }

    generateAccessories(rng) {
        const hasNecklace = rng.next() < 0.3; // 30% chance
        let necklace = null;
        if (hasNecklace) {
            necklace = {
                color: rng.next() < 0.5 ? { r: 255, g: 215, b: 0 } : { r: 192, g: 192, b: 192 }, // Gold or Silver
                length: rng.next() < 0.5 ? 'short' : 'long',
                pendant: ['circle', 'diamond', 'square', 'cross', 'gem'][rng.int(0, 4)]
            };
            if (necklace.pendant === 'gem') {
                necklace.pendantColor = { r: 231, g: 76, b: 60 }; // Ruby default
                if (rng.next() < 0.33) necklace.pendantColor = { r: 46, g: 204, b: 113 }; // Emerald
                else if (rng.next() < 0.66) necklace.pendantColor = { r: 52, g: 152, b: 219 }; // Sapphire
            }
        }
        return { necklace };
    }

    drawAccessories(pixels, accessories, centerX, minY, canvasSize) {
        if (accessories.necklace) {
            this.drawNecklace(pixels, accessories.necklace, centerX, minY, canvasSize);
        }
        this.drawBelt(pixels, centerX, canvasSize);
    }

    drawNecklace(pixels, necklace, centerX, minY, canvasSize) {
        const neckY = minY + 3; // Approx neck base
        const chainColor = necklace.color;

        // Draw Chain
        const chainLength = necklace.length === 'long' ? 10 : 6;
        for (let i = 0; i <= chainLength; i++) {
            const dy = i;
            const dx = Math.floor(i * 0.7);

            // Left side
            if (pixels[neckY + dy] && pixels[neckY + dy][centerX - dx])
                pixels[neckY + dy][centerX - dx] = chainColor;

            // Right side
            if (pixels[neckY + dy] && pixels[neckY + dy][centerX + dx])
                pixels[neckY + dy][centerX + dx] = chainColor;
        }

        // Draw Pendant
        const pendantY = neckY + chainLength;
        const pendantX = centerX;
        const pColor = necklace.pendant === 'gem' ? necklace.pendantColor : chainColor;

        if (pixels[pendantY] && pixels[pendantY][pendantX]) {
            pixels[pendantY][pendantX] = pColor;
            // Simple shapes
            if (necklace.pendant === 'diamond' || necklace.pendant === 'gem') {
                if (pixels[pendantY - 1]) pixels[pendantY - 1][pendantX] = pColor;
                if (pixels[pendantY + 1]) pixels[pendantY + 1][pendantX] = pColor;
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
            } else if (necklace.pendant === 'square') {
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
                if (pixels[pendantY + 1]) {
                    pixels[pendantY + 1][pendantX] = pColor;
                    pixels[pendantY + 1][pendantX - 1] = pColor;
                    pixels[pendantY + 1][pendantX + 1] = pColor;
                }
            } else if (necklace.pendant === 'cross') {
                if (pixels[pendantY + 1]) pixels[pendantY + 1][pendantX] = pColor;
                if (pixels[pendantY + 2]) pixels[pendantY + 2][pendantX] = pColor;
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
            }
        }
    }

    drawBelt(pixels, centerX, canvasSize, colors) {
        for (let y = 1; y < canvasSize - 1; y++) {
            for (let x = 0; x < canvasSize; x++) {
                if (pixels[y][x] && pixels[y + 1][x]) {
                    // Detect shirt-to-pants transition
                    const c1 = pixels[y][x];
                    const c2 = pixels[y + 1][x];
                    // We must check if colors roughly match original shirt/pants 
                    // OR if we want to be strict like original code:
                    // Original: if (c1 === colors.shirt && c2 === colors.pants)
                    // This was very strict.

                    // We'll trust the user wants to keep behavior, but I suspect this was flaky.
                    // Let's use value comparison to be safe against object identity issues if meaningful,
                    // but the original code relied on object identity (likely).
                    // However, since we are moving code, we might lose identity if we cross boundaries (e.g. copying objects).
                    // Let's assume we pass the EXACT same color objects.

                    if (colors && c1 === colors.shirt && c2 === colors.pants) {
                        pixels[y][x] = { r: 50, g: 30, b: 20 }; // Belt color
                    }
                }
            }
        }
    }
}

