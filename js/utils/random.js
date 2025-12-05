// Random Utilities

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomPalette(rng) {
    const random = rng ? () => rng.next() : Math.random;
    const randInt = rng ? (min, max) => rng.int(min, max) : randomInt;

    const hue = Math.floor(random() * 360);
    const saturation = randInt(40, 80);
    const lightness = randInt(40, 70);

    const color1 = hslToRgb(hue, saturation, lightness);
    const color2 = hslToRgb((hue + 30) % 360, saturation, lightness);
    const color3 = hslToRgb((hue + 180) % 360, saturation, lightness);

    return [color1, color2, color3];
}

// Simple Mulberry32 seeded random
export class SeededRandom {
    constructor(seed) {
        this.seed = seed || Math.floor(Math.random() * 2147483647);
    }

    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    float(min, max) {
        return this.next() * (max - min) + min;
    }

    int(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

// Spatial Hash for stable noise
export function hash(x, y, seed) {
    let h = seed ^ x ^ (y * 57);
    h = Math.imul(h ^ h >>> 15, 0x85ebca6b);
    h = Math.imul(h ^ h >>> 13, 0xc2b2ae35);
    h = ((h ^ h >>> 16) >>> 0);
    return h / 4294967296;
}

// Helper function for HSL to RGB conversion
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}
