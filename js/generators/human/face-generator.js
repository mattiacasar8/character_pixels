import { hash } from '../../utils/random.js';
import { shade, tint } from '../../utils/color.js';

export class FaceGenerator {
    constructor() {
    }

    /**
     * Generates a face grid based on the provided dimensions and parameters.
     * @param {number} width - Width of the head in pixels.
     * @param {number} height - Height of the head in pixels.
     * @param {object} colors - Object containing {skin, hair, eyes, mouth}.
     * @param {number} seed - Random seed.
     * @param {object} faceOverrides - Optional overrides for hairStyle, mouthState
     * @returns {Array<Array<object|null>>} - 2D array of colors (or null).
     */
    generate(width, height, colors, seed, faceOverrides = {}) {
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

        // Mouth State - use override if provided
        const mouthStateVal = faceOverrides?.mouthState ?? hash(200, 10, seed);
        let mouthState = 'neutral';

        // Revised probabilities without 'open'
        if (mouthStateVal < 0.4) mouthState = 'neutral';       // 40%
        else if (mouthStateVal < 0.75) mouthState = 'smile';   // 35%
        else mouthState = 'frown';                             // 25%

        for (let i = 0; i < mouthW; i++) {
            let mx = mouthStartX + i;
            let my = mouthY;

            if (mouthState === 'neutral') {
                setPixel(mx, my, lipColor);
            } else if (mouthState === 'smile') {
                if (i === 0 || i === mouthW - 1) my -= 1;
                setPixel(mx, my, lipColor);
            } else { // Frown
                if (i === 0 || i === mouthW - 1) my += 1;
                setPixel(mx, my, lipColor);
            }
        }

        // --- Layer 3: Hair / Hats ---
        const hairColor = colors.hair;
        const hairHighlight = tint(hairColor, 0.3);
        const hairShadow = shade(hairColor, 0.3);
        // Hair/hat style - use override if provided
        const hairStyle = faceOverrides?.hairStyle ?? hash(100, 20, seed); // 0-1

        // Hair/Hat Styles:
        // 0.00-0.10: Bald
        // 0.10-0.20: Short/Buzz
        // 0.20-0.35: Medium Messy
        // 0.35-0.50: Long Straight
        // 0.50-0.65: Long Wavy
        // 0.65-0.75: Mohawk/Punk
        // 0.75-0.85: Elegant Hat
        // 0.85-0.93: Wizard Hat
        // 0.93-1.00: Turban/Hood

        const hairStartY = Math.floor(height * 0.15);
        const isHat = hairStyle >= 0.75;

        // Hat color palette (weighted: classic colors more likely)
        const hatColors = [
            // High probability (classic) - repeated for weight
            { r: 60, g: 40, b: 20 },   // Dark brown
            { r: 60, g: 40, b: 20 },   // Dark brown (2x)
            { r: 100, g: 70, b: 40 },  // Brown
            { r: 100, g: 70, b: 40 },  // Brown (2x)
            { r: 25, g: 25, b: 25 },   // Black
            { r: 25, g: 25, b: 25 },   // Black (2x)
            { r: 60, g: 60, b: 60 },   // Dark grey
            { r: 170, g: 150, b: 120 }, // Beige
            // Medium probability
            { r: 100, g: 30, b: 25 },  // Dark red
            { r: 30, g: 35, b: 65 },   // Dark blue
            { r: 35, g: 55, b: 35 },   // Dark green
            { r: 55, g: 30, b: 60 },   // Dark purple
            // Low probability (rare)
            { r: 200, g: 195, b: 185 }, // White/light grey
            { r: 150, g: 130, b: 60 }  // Gold
        ];
        const hatColorIndex = Math.floor(hash(150, 30, seed) * hatColors.length);
        const hatColor = hatColors[hatColorIndex];
        const hatHighlight = tint(hatColor, 0.2);
        const hatShadow = shade(hatColor, 0.2);

        // Helper to draw hair pixel
        const drawHair = (x, y, isHighlight = false) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                setPixel(x, y, isHighlight ? hairHighlight : hairColor);
            }
        };

        // Helper to draw hat pixel
        const drawHat = (x, y, isHighlight = false, isShadow = false) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                const c = isShadow ? hatShadow : (isHighlight ? hatHighlight : hatColor);
                setPixel(x, y, c);
            }
        };

        if (!isHat && hairStyle > 0.1) {
            // --- HAIR STYLES ---

            // Top coverage (all hair styles except bald)
            for (let y = 0; y <= hairStartY + 2; y++) {
                for (let x = 0; x < width; x++) {
                    const nx = (x - centerX + 0.5) / (width / 2);
                    const ny = (y - height / 2 + 0.5) / (height / 2);
                    let dist = Math.sqrt(nx * nx + ny * ny);

                    if (dist < 1.05) {
                        if (chance(0.95, x * y)) {
                            drawHair(x, y, chance(0.2, x * y));
                        }
                    }
                }
            }

            if (hairStyle >= 0.10 && hairStyle < 0.20) {
                // Short/Buzz - just the top coverage, no sides
            } else if (hairStyle >= 0.20 && hairStyle < 0.35) {
                // Medium Messy
                const len = height * 0.5;
                for (let y = hairStartY; y < len; y++) {
                    if (chance(0.8, y)) drawHair(0, y);
                    if (chance(0.8, y)) drawHair(width - 1, y);
                }
            } else if (hairStyle >= 0.35 && hairStyle < 0.50) {
                // Long Straight
                const len = height;
                for (let y = hairStartY; y < len; y++) {
                    drawHair(0, y);
                    drawHair(1, y);
                    drawHair(width - 1, y);
                    drawHair(width - 2, y);
                }
            } else if (hairStyle >= 0.50 && hairStyle < 0.65) {
                // Long Wavy
                const len = height;
                for (let y = hairStartY; y < len; y++) {
                    const wave = Math.sin(y * 0.5) * 2;
                    drawHair(0 + wave, y);
                    drawHair(1 + wave, y);
                    drawHair(width - 1 + wave, y);
                    drawHair(width - 2 + wave, y);
                }
            } else if (hairStyle >= 0.65 && hairStyle < 0.75) {
                // Mohawk
                for (let y = 0; y < height * 0.4; y++) {
                    for (let x = centerX - 2; x <= centerX + 2; x++) {
                        drawHair(x, y - 3);
                    }
                }
            }
        } else if (isHat) {
            // --- HAT STYLES ---

            if (hairStyle >= 0.75 && hairStyle < 0.85) {
                // Elegant Hat: dome + wide brim
                const brimY = Math.floor(height * 0.15);
                const brimExtend = Math.max(3, Math.floor(width * 0.3));

                // Dome (rounded top above head)
                for (let y = 0; y <= brimY; y++) {
                    const domeWidth = Math.floor((brimY - y + 1) * (width * 0.4) / brimY);
                    for (let dx = -domeWidth; dx <= domeWidth; dx++) {
                        const px = Math.floor(centerX) + dx;
                        drawHat(px, y, y < 2, false);
                    }
                }

                // Brim (horizontal band extending beyond head)
                for (let bRow = 0; bRow < 2; bRow++) {
                    for (let dx = -brimExtend; dx <= brimExtend; dx++) {
                        const px = Math.floor(centerX) + dx;
                        drawHat(px, brimY + bRow, false, bRow === 1);
                    }
                }

            } else if (hairStyle >= 0.85 && hairStyle < 0.93) {
                // Wizard Hat: tall pointed cone
                const hatBaseY = Math.floor(height * 0.18);
                const hatTipY = -6; // extends above head grid (clamped by drawHat)
                const hatHeight = hatBaseY - hatTipY;
                const baseHalfWidth = Math.max(3, Math.floor(width * 0.35));

                for (let y = hatTipY; y <= hatBaseY; y++) {
                    const progress = (y - hatTipY) / hatHeight;
                    const rowWidth = Math.floor(progress * baseHalfWidth);
                    for (let dx = -rowWidth; dx <= rowWidth; dx++) {
                        const px = Math.floor(centerX) + dx;
                        const isEdge = Math.abs(dx) === rowWidth;
                        drawHat(px, y, !isEdge && y < hatTipY + 3, isEdge);
                    }
                }

                // Small brim
                for (let dx = -(baseHalfWidth + 1); dx <= baseHalfWidth + 1; dx++) {
                    drawHat(Math.floor(centerX) + dx, hatBaseY + 1, false, true);
                }

            } else {
                // Turban/Hood: rounded wrapping shape
                const wrapStartY = 0;
                const wrapEndY = Math.floor(height * 0.55);

                for (let y = wrapStartY; y <= wrapEndY; y++) {
                    for (let x = 0; x < width; x++) {
                        const nx = (x - centerX + 0.5) / (width / 2);
                        const ny = (y - height * 0.25) / (height * 0.4);
                        const dist = Math.sqrt(nx * nx + ny * ny);

                        // Thicker than head (1.2 radius), wraps around sides
                        if (dist < 1.2) {
                            const isEdge = dist > 1.0;
                            const isTop = y < height * 0.1;
                            drawHat(x, y, isTop, isEdge);
                        }
                    }
                }

                // Fabric folds detail
                for (let y = Math.floor(height * 0.1); y < Math.floor(height * 0.4); y++) {
                    if (y % 3 === 0) {
                        drawHat(Math.floor(centerX), y, false, true);
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