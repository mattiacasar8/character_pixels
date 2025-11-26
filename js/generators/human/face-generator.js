import { hash } from '../../utils/random.js';

export class FaceGenerator {
    constructor() {
    }

    /**
     * Generates a face grid based on the provided dimensions and parameters.
     * @param {number} width - Width of the head in pixels.
     * @param {number} height - Height of the head in pixels.
     * @param {object} colors - Object containing {skin, hair, eyes, mouth}.
     * @param {number} seed - Random seed.
     * @returns {Array<Array<object|null>>} - 2D array of colors (or null).
     */
    generate(width, height, colors, seed) {
        // Initialize grid
        const grid = Array(height).fill().map(() => Array(width).fill(null));
        const centerX = width / 2;

        // Helper to set pixel
        const setPixel = (x, y, color) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                grid[y][x] = color;
            }
        };

        // Helper for seeded random
        const random = (salt) => hash(salt, 0, seed);

        // Helper for chance
        const chance = (prob, salt) => hash(salt, 0, seed) < prob;
        const randomInt = (min, max, salt) => Math.floor(hash(salt, 1, seed) * (max - min + 1)) + min;

        // Color helpers (simple approximations since we deal with objects/strings sometimes)
        // We assume colors are objects {r,g,b}
        const shade = (c, percent) => ({ r: Math.max(0, c.r * (1 - percent)), g: Math.max(0, c.g * (1 - percent)), b: Math.max(0, c.b * (1 - percent)) });
        const tint = (c, percent) => ({ r: Math.min(255, c.r + (255 - c.r) * percent), g: Math.min(255, c.g + (255 - c.g) * percent), b: Math.min(255, c.b + (255 - c.b) * percent) });

        // --- Layer 1: The Cranium ---
        const baseSkin = colors.skin;
        const shadowSkin = shade(baseSkin, 0.2);
        const highlightSkin = tint(baseSkin, 0.15);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Skull/Egg shape logic
                // Normalize coordinates -1 to 1
                const nx = (x - centerX + 0.5) / (width / 2);
                const ny = (y - height / 2 + 0.5) / (height / 2);

                // Skull shape: Top is rounder (circle), bottom is slightly tapered (jaw)
                // We can use a modified distance check
                // Top half (ny < 0): Circle
                // Bottom half (ny > 0): Tapered ellipse

                let dist = Math.sqrt(nx * nx + ny * ny);
                if (ny > 0) {
                    // Taper width as we go down
                    // effective width reduces
                    const taper = 1 - (ny * 0.2); // slight taper
                    const tnx = nx / taper;
                    dist = Math.sqrt(tnx * tnx + ny * ny);
                }

                if (dist < 0.95) {
                    let shouldDraw = true;

                    if (shouldDraw) {
                        let color = baseSkin;
                        // Shading edges
                        if (dist > 0.8) color = shadowSkin;
                        // Forehead highlight
                        else if (ny < -0.2 && Math.abs(nx) < 0.5) color = highlightSkin;

                        setPixel(x, y, color);
                    }
                }
            }
        }

        // --- Layer 2: The T-Zone ---
        const eyeY = Math.floor(height * 0.45);
        const eyeSpacing = Math.max(2, Math.floor(width * 0.22));
        const offset = Math.max(2, Math.floor(width * 0.15));

        // Eyes
        const leftEyeX = Math.floor(centerX - offset - 1);
        const rightEyeX = Math.floor(centerX + offset);
        const scleraColor = { r: 245, g: 245, b: 245 };

        const drawEye = (x, y) => {
            if (width > 10) {
                // Detailed Eye
                setPixel(x, y, colors.eyes); // Pupil
                setPixel(x + 1, y, scleraColor); // White right
                setPixel(x - 1, y, scleraColor); // White left
                if (chance(0.5, x * y)) setPixel(x, y - 1, shade(baseSkin, 0.4)); // Eyelid
            } else {
                setPixel(x, y, colors.eyes);
            }
        };

        drawEye(leftEyeX, eyeY);
        drawEye(rightEyeX, eyeY);

        // Nose
        const noseY = eyeY + (width > 10 ? 3 : 2);
        const noseX = Math.floor(centerX);
        setPixel(noseX, noseY, shadowSkin);
        if (width > 10) {
            setPixel(noseX - 1, noseY + 1, shade(baseSkin, 0.3));
            setPixel(noseX + 1, noseY + 1, shade(baseSkin, 0.3));
            setPixel(noseX, noseY + 1, tint(baseSkin, 0.2)); // Tip
        }

        // Mouth
        const mouthY = Math.floor(height * 0.75);
        const mouthW = Math.max(3, Math.floor(width * 0.4));
        const mouthStartX = Math.floor(centerX - mouthW / 2);
        const lipColor = colors.mouth || shade(baseSkin, 0.4);

        // Mouth State
        const mouthStateVal = hash(seed, 10, seed);
        let mouthState = 'neutral'; // 0-0.3
        if (mouthStateVal > 0.3 && mouthStateVal < 0.6) mouthState = 'smile';
        else if (mouthStateVal >= 0.6 && mouthStateVal < 0.8) mouthState = 'open';
        else if (mouthStateVal >= 0.8) mouthState = 'frown';

        for (let i = 0; i < mouthW; i++) {
            let mx = mouthStartX + i;
            let my = mouthY;

            if (mouthState === 'neutral') {
                setPixel(mx, my, lipColor);
            } else if (mouthState === 'smile') {
                if (i === 0 || i === mouthW - 1) my -= 1;
                setPixel(mx, my, lipColor);
            } else if (mouthState === 'open') {
                if (i === 0 || i === mouthW - 1) my -= 1;
                setPixel(mx, my, lipColor); // Upper
                setPixel(mx, my + 1, { r: 50, g: 20, b: 20 }); // Inside
                if (i > 0 && i < mouthW - 1 && chance(0.5, mx)) setPixel(mx, my + 1, { r: 255, g: 255, b: 240 }); // Teeth
                setPixel(mx, my + 2, lipColor); // Lower
            } else { // Frown
                if (i === 0 || i === mouthW - 1) my += 1;
                setPixel(mx, my, lipColor);
            }
        }

        // --- Layer 3: Hair ---
        const hairColor = colors.hair;
        const hairHighlight = tint(hairColor, 0.3);
        const hairShadow = shade(hairColor, 0.3);
        const hairStyle = hash(seed, 20, seed); // 0-1

        // Hair Styles:
        // 0.0-0.2: Short/Bald
        // 0.2-0.4: Medium Messy
        // 0.4-0.6: Long Straight
        // 0.6-0.8: Long Wavy
        // 0.8-1.0: Mohawk/Punk

        const hairStartY = Math.floor(height * 0.15); // Higher hairline

        // Helper to draw hair pixel
        const drawHair = (x, y, isHighlight = false) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                setPixel(x, y, isHighlight ? hairHighlight : hairColor);
            }
        };

        if (hairStyle > 0.1) { // Not bald
            // Top coverage
            for (let y = 0; y <= hairStartY + 2; y++) {
                for (let x = 0; x < width; x++) {
                    const nx = (x - centerX + 0.5) / (width / 2);
                    const ny = (y - height / 2 + 0.5) / (height / 2);
                    let dist = Math.sqrt(nx * nx + ny * ny);

                    if (dist < 1.05) { // Slightly larger than head
                        if (chance(0.95, x * y)) {
                            drawHair(x, y, chance(0.2, x * y));
                        }
                    }
                }
            }

            // Sides/Back based on style
            if (hairStyle > 0.2 && hairStyle < 0.4) { // Medium Messy
                const len = height * 0.5;
                for (let y = hairStartY; y < len; y++) {
                    if (chance(0.8, y)) drawHair(0, y);
                    if (chance(0.8, y)) drawHair(width - 1, y);
                }
            } else if (hairStyle >= 0.4 && hairStyle < 0.6) { // Long Straight
                const len = height;
                for (let y = hairStartY; y < len; y++) {
                    drawHair(0, y);
                    drawHair(1, y);
                    drawHair(width - 1, y);
                    drawHair(width - 2, y);
                }
            } else if (hairStyle >= 0.6 && hairStyle < 0.8) { // Long Wavy
                const len = height;
                for (let y = hairStartY; y < len; y++) {
                    const wave = Math.sin(y * 0.5) * 2;
                    drawHair(0 + wave, y);
                    drawHair(1 + wave, y);
                    drawHair(width - 1 + wave, y);
                    drawHair(width - 2 + wave, y);
                }
            } else if (hairStyle >= 0.8) { // Mohawk
                for (let y = 0; y < height * 0.4; y++) {
                    for (let x = centerX - 2; x <= centerX + 2; x++) {
                        drawHair(x, y - 3); // Stick up
                    }
                }
            }
        }

        // --- Layer 4: Details ---
        // Blush
        if (chance(0.5, seed)) {
            const blushC = { r: 230, g: 160, b: 160 };
            setPixel(leftEyeX - 1, eyeY + 2, blushC);
            setPixel(rightEyeX + 1, eyeY + 2, blushC);
        }

        // Moles
        if (chance(0.3, seed + 1) && width > 10) {
            const mx = randomInt(2, width - 3, seed);
            const my = randomInt(eyeY + 1, mouthY, seed);
            const p = grid[my][mx];
            if (p === baseSkin || p === shadowSkin) {
                setPixel(mx, my, { r: 60, g: 40, b: 20 });
            }
        }

        // Scars
        if (chance(0.2, seed + 2)) {
            let sx = randomInt(1, width - 2, seed + 3);
            let sy = randomInt(0, height / 2, seed + 4);
            const scarLen = randomInt(3, 5, seed + 5);
            const scarColor = tint(baseSkin, 0.4);
            for (let i = 0; i < scarLen; i++) {
                setPixel(sx, sy, scarColor);
                sy++;
                if (chance(0.5, i)) sx++;
            }
        }

        return grid;
    }
}
