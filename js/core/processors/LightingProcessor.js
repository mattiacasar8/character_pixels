/**
 * Lighting Processor
 * Applies directional lighting with highlights and shadows.
 * Light source is positioned at top-right by default.
 * Previously only available for humans, now works for all character types.
 */

export class LightingProcessor {
    static id = 'lighting';
    static name = 'Lighting';
    static defaultEnabled = true;

    /**
     * Apply lighting to the pixel grid
     * @param {Array<Array>} pixels - 2D pixel array
     * @param {Object} params - Effect parameters
     * @param {number} canvasSize - Size of the canvas
     * @returns {Array<Array>} Modified pixel array
     */
    static defaultDirection = 'top-right';

    /**
     * Apply lighting to the pixel grid
     * @param {Array<Array>} pixels - 2D pixel array
     * @param {Object} params - Effect parameters
     * @param {number} canvasSize - Size of the canvas
     * @returns {Array<Array>} Modified pixel array
     */
    static apply(pixels, params, canvasSize) {
        // Debug log to check if called for humans
        console.log('LightingProcessor applied', { lighting: params.effects?.lighting, direction: params.lightDirection });

        const size = pixels.length;
        const direction = params.lightDirection || LightingProcessor.defaultDirection;
        const result = pixels.map(row => [...row]); // Create new buffer for output

        // Define direction offsets based on light source
        // If light is Top-Right:
        // - Top edges are lit (neighbor y-1 is empty)
        // - Right edges are lit (neighbor x+1 is empty)
        // - Bottom edges are shaded (neighbor y+1 is empty)
        // - Left edges are shaded (neighbor x-1 is empty)

        let litEdges = [];
        let shadedEdges = [];

        switch (direction) {
            case 'top-left':
                litEdges = [{ dy: -1, dx: 0 }, { dy: 0, dx: -1 }]; // Top, Left
                shadedEdges = [{ dy: 1, dx: 0 }, { dy: 0, dx: 1 }]; // Bottom, Right
                break;
            case 'bottom-right':
                litEdges = [{ dy: 1, dx: 0 }, { dy: 0, dx: 1 }]; // Bottom, Right
                shadedEdges = [{ dy: -1, dx: 0 }, { dy: 0, dx: -1 }]; // Top, Left
                break;
            case 'bottom-left':
                litEdges = [{ dy: 1, dx: 0 }, { dy: 0, dx: -1 }]; // Bottom, Left
                shadedEdges = [{ dy: -1, dx: 0 }, { dy: 0, dx: 1 }]; // Top, Right
                break;
            case 'top-right':
            default:
                litEdges = [{ dy: -1, dx: 0 }, { dy: 0, dx: 1 }]; // Top, Right
                shadedEdges = [{ dy: 1, dx: 0 }, { dy: 0, dx: -1 }]; // Bottom, Left
                break;
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const color = pixels[y][x]; // READ FROM ORIGINAL
                if (!color) continue;

                let newColor = { ...color };

                // Apply Highlights
                litEdges.forEach(({ dy, dx }) => {
                    const ny = y + dy;
                    const nx = x + dx;
                    if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                        if (!pixels[ny][nx]) { // Check neighbor in ORIGINAL
                            newColor = LightingProcessor.tint(newColor, 0.2);
                        }
                    } else {
                        // Edge of canvas is considered "empty" so it gets lit? 
                        // Usually yes, or ignore. Let's light it for pop.
                        newColor = LightingProcessor.tint(newColor, 0.2);
                    }
                });

                // Apply Shadows
                shadedEdges.forEach(({ dy, dx }) => {
                    const ny = y + dy;
                    const nx = x + dx;
                    if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                        if (!pixels[ny][nx]) { // Check neighbor in ORIGINAL
                            newColor = LightingProcessor.shade(newColor, 0.2);
                        }
                    } else {
                        // Edge of canvas shadow? 
                        newColor = LightingProcessor.shade(newColor, 0.2);
                    }
                });

                result[y][x] = newColor; // WRITE TO RESULT
            }
        }

        return result;
    }

    /**
     * Make a color darker (shadow)
     */
    static shade(color, percent) {
        return {
            r: Math.max(0, Math.round(color.r * (1 - percent))),
            g: Math.max(0, Math.round(color.g * (1 - percent))),
            b: Math.max(0, Math.round(color.b * (1 - percent)))
        };
    }

    /**
     * Make a color lighter (highlight)
     */
    static tint(color, percent) {
        return {
            r: Math.min(255, Math.round(color.r + (255 - color.r) * percent)),
            g: Math.min(255, Math.round(color.g + (255 - color.g) * percent)),
            b: Math.min(255, Math.round(color.b + (255 - color.b) * percent))
        };
    }

    /**
     * UI configuration for this processor
     */
    static getUIConfig() {
        return {
            id: LightingProcessor.id,
            name: LightingProcessor.name,
            type: 'toggle',
            default: LightingProcessor.defaultEnabled
        };
    }
}
