
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
                const gemRoll = rng.next();
                if (gemRoll < 0.33) necklace.pendantColor = { r: 46, g: 204, b: 113 }; // Emerald
                else if (gemRoll < 0.66) necklace.pendantColor = { r: 52, g: 152, b: 219 }; // Sapphire
                else necklace.pendantColor = { r: 231, g: 76, b: 60 }; // Ruby
            }
        }
        return { necklace };
    }

    drawAccessories(pixels, accessories, centerX, minY, canvasSize) {
        if (accessories.necklace) {
            this.drawNecklace(pixels, accessories.necklace, centerX, minY, canvasSize);
        }
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

    /**
     * Helper: compare two {r,g,b} colors by value
     */
    _colorsMatch(a, b) {
        return a && b && a.r === b.r && a.g === b.g && a.b === b.b;
    }

    drawBelt(pixels, centerX, canvasSize, colors) {
        if (!colors) return;

        // Scan only the vertical band where shirt/pants transition occurs (center ± 30%)
        const scanStart = Math.max(1, Math.floor(canvasSize * 0.3));
        const scanEnd = Math.min(canvasSize - 1, Math.ceil(canvasSize * 0.7));
        const xStart = Math.max(0, Math.floor(centerX - canvasSize * 0.25));
        const xEnd = Math.min(canvasSize, Math.ceil(centerX + canvasSize * 0.25));

        for (let y = scanStart; y < scanEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                if (pixels[y][x] && pixels[y + 1] && pixels[y + 1][x]) {
                    const c1 = pixels[y][x];
                    const c2 = pixels[y + 1][x];
                    if (this._colorsMatch(c1, colors.shirt) && this._colorsMatch(c2, colors.pants)) {
                        pixels[y][x] = { r: 50, g: 30, b: 20 };
                    }
                }
            }
        }
    }
}

