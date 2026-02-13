// Color Utilities

/**
 * Make a color darker by a percentage
 * @param {Object} color - {r, g, b} color object
 * @param {number} percent - 0.0 to 1.0 darkening factor
 * @returns {Object} New darker {r, g, b} color
 */
export function shade(color, percent) {
    return {
        r: Math.max(0, Math.round(color.r * (1 - percent))),
        g: Math.max(0, Math.round(color.g * (1 - percent))),
        b: Math.max(0, Math.round(color.b * (1 - percent)))
    };
}

/**
 * Make a color lighter by a percentage
 * @param {Object} color - {r, g, b} color object
 * @param {number} percent - 0.0 to 1.0 lightening factor
 * @returns {Object} New lighter {r, g, b} color
 */
export function tint(color, percent) {
    return {
        r: Math.min(255, Math.round(color.r + (255 - color.r) * percent)),
        g: Math.min(255, Math.round(color.g + (255 - color.g) * percent)),
        b: Math.min(255, Math.round(color.b + (255 - color.b) * percent))
    };
}

/**
 * Parse a hex color string to {r, g, b}
 * @param {string} hex - Color string like '#ff0000' or '#f00'
 * @returns {Object} {r, g, b} color object
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 42, g: 42, b: 42 };
}

/**
 * Find the most common color in a neighborhood of pixels
 * @param {Array<Array>} pixels - 2D pixel grid
 * @param {number} x - Center x coordinate
 * @param {number} y - Center y coordinate
 * @param {number} size - Grid size
 * @returns {Object|null} Most common {r, g, b} color, or null
 */
export function getMostCommonColor(pixels, x, y, size) {
    const colorCounts = new Map();
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < size && nx >= 0 && nx < size && pixels[ny][nx]) {
                const c = pixels[ny][nx];
                const key = `${c.r},${c.g},${c.b}`;
                colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
            }
        }
    }
    let maxCount = 0, maxColor = null;
    for (const [key, count] of colorCounts) {
        if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = key.split(',').map(Number);
            maxColor = { r, g, b };
        }
    }
    return maxColor;
}
