/**
 * Smoothing Processor
 * Fills empty pixels that are surrounded by filled neighbors (cellular automata).
 * Creates a smoother, less noisy character appearance.
 */

export class SmoothingProcessor {
    static id = 'smoothing';
    static name = 'Smoothing';
    static defaultEnabled = true;

    /**
     * Apply smoothing to the pixel grid
     * @param {Array<Array>} pixels - 2D pixel array
     * @param {Object} params - Effect parameters
     * @param {number} canvasSize - Size of the canvas
     * @returns {Array<Array>} Modified pixel array
     */
    static apply(pixels, params, canvasSize) {
        const toFill = [];
        const size = pixels.length;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (pixels[y][x] === null) {
                    // Count filled neighbors (Moore neighborhood - 8 cells)
                    let filledCount = 0;
                    const neighborColors = [];

                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            if (pixels[y + dy] && pixels[y + dy][x + dx]) {
                                filledCount++;
                                neighborColors.push(pixels[y + dy][x + dx]);
                            }
                        }
                    }

                    // Fill if more than 4 neighbors are filled
                    if (filledCount > 4) {
                        const color = SmoothingProcessor.getMostCommonColor(neighborColors);
                        toFill.push({ x, y, color });
                    }
                }
            }
        }

        // Apply fills
        toFill.forEach(({ x, y, color }) => {
            pixels[y][x] = color;
        });

        return pixels;
    }

    /**
     * Get the most common color from an array
     */
    static getMostCommonColor(colors) {
        if (colors.length === 0) return null;

        const colorMap = new Map();
        let maxCount = 0;
        let mostCommon = colors[0];

        colors.forEach(c => {
            const key = `${c.r},${c.g},${c.b}`;
            const count = (colorMap.get(key) || 0) + 1;
            colorMap.set(key, count);
            if (count > maxCount) {
                maxCount = count;
                mostCommon = c;
            }
        });

        return mostCommon;
    }

    /**
     * UI configuration for this processor
     */
    static getUIConfig() {
        return {
            id: SmoothingProcessor.id,
            name: SmoothingProcessor.name,
            type: 'toggle',
            default: SmoothingProcessor.defaultEnabled
        };
    }
}
