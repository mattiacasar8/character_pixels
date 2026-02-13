/**
 * Outline Processor
 * Adds a colored outline around filled pixels.
 * Creates a defined border that helps characters stand out.
 */
import { hexToRgb } from '../../utils/color.js';

export class OutlineProcessor {
    static id = 'outline';
    static name = 'Outline';
    static defaultEnabled = true;
    static defaultColor = '#000000';

    /**
     * Apply outline to the pixel grid
     * @param {Array<Array>} pixels - 2D pixel array
     * @param {Object} params - Effect parameters (outlineColor)
     * @param {number} canvasSize - Size of the canvas
     * @returns {Array<Array>} Modified pixel array
     */
    static apply(pixels, params, canvasSize) {
        const color = params.outlineColor || { r: 0, g: 0, b: 0 };
        const outlineColor = typeof color === 'string'
            ? hexToRgb(color)
            : color;

        const toOutline = [];
        const size = pixels.length;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (pixels[y][x] !== null) {
                    // Check orthogonal neighbors (up, down, left, right)
                    const neighbors = [
                        { dy: -1, dx: 0 }, // up
                        { dy: 1, dx: 0 },  // down
                        { dy: 0, dx: -1 }, // left
                        { dy: 0, dx: 1 }   // right
                    ];

                    neighbors.forEach(({ dy, dx }) => {
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
                            if (pixels[ny][nx] === null) {
                                toOutline.push({ x: nx, y: ny });
                            }
                        }
                    });
                }
            }
        }

        // Apply outline (don't overwrite existing pixels)
        toOutline.forEach(({ x, y }) => {
            if (pixels[y][x] === null) {
                pixels[y][x] = outlineColor;
            }
        });

        return pixels;
    }

    /**
     * UI configuration for this processor
     */
    static getUIConfig() {
        return {
            id: OutlineProcessor.id,
            name: OutlineProcessor.name,
            type: 'toggle',
            default: OutlineProcessor.defaultEnabled,
            options: [
                {
                    id: 'outlineColor',
                    type: 'color',
                    default: OutlineProcessor.defaultColor,
                    label: 'Color'
                }
            ]
        };
    }
}
