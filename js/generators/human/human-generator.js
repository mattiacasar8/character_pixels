import { CharacterGenerator } from '../../core/generator.js';
import { SKIN_TONES, CLOTHING_COLORS, HAIR_COLORS, EYE_COLORS, MOUTH_COLORS } from '../../data/human-palettes.js';
import { randomFloat, randomInt, SeededRandom, hash } from '../../utils/random.js';
import { isPointInPolygon } from '../../utils/math.js';
import { FaceGenerator } from './face-generator.js';
import { nameGenerator } from '../name-generator.js';

export class HumanGenerator extends CharacterGenerator {
    constructor(canvasSize = 50) {
        super(canvasSize);
        this.faceGenerator = new FaceGenerator();
    }

    generate(params) {
        const characterData = super.generate(params);
        characterData.name = nameGenerator.generate();
        return characterData;
    }

    // Override to use human palettes
    randomParamsInRange(preset = 'standard') {
        const params = super.randomParamsInRange(preset);

        // Select colors
        const skinTone = this.getRandomColor(SKIN_TONES);

        // Clothing: Shirt and Pants
        const shirtColor = this.getRandomColor(CLOTHING_COLORS);
        let pantsColor = this.getRandomColor(CLOTHING_COLORS);
        // Ensure pants are different from shirt
        while (pantsColor === shirtColor && CLOTHING_COLORS.length > 1) {
            pantsColor = this.getRandomColor(CLOTHING_COLORS);
        }

        const hairColor = this.getRandomColor(HAIR_COLORS);
        const eyeColor = this.getRandomColor(EYE_COLORS);
        const mouthColor = this.getRandomColor(MOUTH_COLORS);

        params.humanColors = {
            skin: skinTone,
            shirt: shirtColor,
            pants: pantsColor,
            hair: hairColor,
            eyes: eyeColor,
            mouth: mouthColor
        };

        params.palette = [skinTone, shirtColor, pantsColor, hairColor];
        return params;
    }

    getRandomColor(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Override to enforce human proportions
    // Canvas is 50px (0-49). Proportions calculated to fit:
    // - 2px space at top for idle animation
    // - Head: ~8px (16%)
    // - Neck: ~2px (4%)
    // - Torso: ~13px (26%)
    // - Legs: ~24px (48%)
    // - Ground at 49
    getParamRanges(preset) {
        const baseRanges = {
            // Torso: Rectangular-ish (starts after head+neck)
            torsoTopWidth: { min: 14, max: 20 },
            torsoBottomWidth: { min: 12, max: 18 },
            torsoHeight: { min: 12, max: 16 },      // Reduced from 20-26
            torsoY: { min: 10, max: 14 },           // Moved up from 26-30 to leave space for head

            // Neck
            neckWidth: { min: 4, max: 6 },
            neckHeight: { min: 2, max: 3 },         // Slightly reduced

            // Head: Oval-ish (should fit in top ~10px with idle space)
            headWidth: { min: 11, max: 15 },
            headHeight: { min: 7, max: 9 },         // Reduced from 16-20 to fit in canvas

            // Arms (proportional to torso)
            upperArmTopWidth: { min: 4, max: 6 },
            upperArmBottomWidth: { min: 3, max: 5 },
            upperArmLength: { min: 10, max: 14 },   // Reduced from 14-18
            forearmTopWidth: { min: 3, max: 5 },
            forearmBottomWidth: { min: 2, max: 4 },
            forearmLength: { min: 10, max: 14 },    // Reduced from 14-18
            armAngle: { min: -80, max: -60 },
            elbowAngle: { min: 0, max: 20 },

            // Legs (take up ~48% of canvas)
            thighTopWidth: { min: 5, max: 8 },
            thighBottomWidth: { min: 4, max: 6 },
            thighLength: { min: 12, max: 15 },      // Reduced from 16-20
            shinTopWidth: { min: 4, max: 6 },
            shinBottomWidth: { min: 3, max: 5 },
            shinLength: { min: 12, max: 15 },       // Reduced from 18-22
            legAngle: { min: -5, max: 5 },

            // Generation
            fillDensity: { min: 1.0, max: 1.0 }
        };

        switch (preset) {
            case 'athletic':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 16, max: 22 },
                    torsoBottomWidth: { min: 14, max: 20 },
                    upperArmTopWidth: { min: 5, max: 7 },
                    thighTopWidth: { min: 6, max: 9 }
                };

            case 'slim':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 12, max: 16 },
                    torsoBottomWidth: { min: 10, max: 14 },
                    upperArmTopWidth: { min: 3, max: 5 },
                    thighTopWidth: { min: 4, max: 6 }
                };

            case 'stocky':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 18, max: 24 },
                    torsoBottomWidth: { min: 16, max: 22 },
                    torsoHeight: { min: 14, max: 18 },
                    upperArmTopWidth: { min: 5, max: 8 },
                    thighTopWidth: { min: 7, max: 10 },
                    thighLength: { min: 10, max: 13 },
                    shinLength: { min: 10, max: 13 }
                };

            case 'tall':
                return {
                    ...baseRanges,
                    torsoHeight: { min: 14, max: 18 },
                    torsoY: { min: 8, max: 12 },
                    headHeight: { min: 6, max: 8 },
                    upperArmLength: { min: 12, max: 16 },
                    forearmLength: { min: 12, max: 16 },
                    thighLength: { min: 14, max: 17 },
                    shinLength: { min: 14, max: 17 }
                };

            case 'standard':
            default:
                return baseRanges;
        }
    }

    generateBodyParts(params) {
        const parts = super.generateBodyParts(params);

        // Assign materials/regions
        parts.head.region = 'head';
        parts.neck.region = 'skin';
        parts.leftHand.region = 'skin';
        parts.rightHand.region = 'skin';

        parts.torso.region = 'shirt';
        parts.leftUpperArm.region = 'shirt';
        parts.rightUpperArm.region = 'shirt';
        parts.leftForearm.region = 'shirt'; // Long sleeves
        parts.rightForearm.region = 'shirt';

        parts.leftThigh.region = 'pants';
        parts.rightThigh.region = 'pants';
        parts.leftShin.region = 'pants';
        parts.rightShin.region = 'pants';

        parts.leftFoot.region = 'shoes';
        parts.rightFoot.region = 'shoes';

        // Joints
        parts.leftShoulder.region = 'shirt';
        parts.rightShoulder.region = 'shirt';
        parts.leftElbow.region = 'shirt';
        parts.rightElbow.region = 'shirt';
        parts.leftKnee.region = 'pants';
        parts.rightKnee.region = 'pants';

        return parts;
    }

    generatePixels(heatmap, params) {
        // Initialize grid
        const pixels = Array(this.canvasSize).fill(0).map(() =>
            Array(this.canvasSize).fill(null)
        );

        // Ensure colors exist
        let colors = params.humanColors;
        const rng = new SeededRandom(params.seed);
        if (!colors) {
            const getSeededColor = (arr) => arr[rng.int(0, arr.length - 1)];
            colors = {
                skin: getSeededColor(SKIN_TONES),
                shirt: getSeededColor(CLOTHING_COLORS),
                pants: getSeededColor(CLOTHING_COLORS),
                hair: getSeededColor(HAIR_COLORS),
                eyes: getSeededColor(EYE_COLORS),
                mouth: getSeededColor(MOUTH_COLORS)
            };
        }

        // Determine Clothing Patterns (Once per generation)
        const shirtPatternVal = rng.next();
        let shirtPattern = 'none';
        if (shirtPatternVal < 0.25) shirtPattern = 'stripes';
        else if (shirtPatternVal < 0.5) shirtPattern = 'checkers';
        else if (shirtPatternVal < 0.75) shirtPattern = 'buttons';

        const pantsPatternVal = rng.next();
        let pantsPattern = 'none';
        if (pantsPatternVal < 0.3) pantsPattern = 'stripes';

        const bodyParts = this.generateBodyParts(params);

        // 1. Generate Face using FaceGenerator
        // Get head bounds
        const headPoints = bodyParts.head.points;
        const ys = headPoints.map(p => p.y);
        const xs = headPoints.map(p => p.x);
        const minY = Math.floor(Math.min(...ys));
        const maxY = Math.ceil(Math.max(...ys));
        const minX = Math.floor(Math.min(...xs));
        const maxX = Math.ceil(Math.max(...xs));

        const headW = maxX - minX;
        const headH = maxY - minY;

        const faceGrid = this.faceGenerator.generate(headW, headH, colors, params.seed);

        // 2. Fill Body (Solid)
        // Helper to find region
        const getRegion = (x, y) => {
            const point = { x, y };

            // Check Hands
            if (isPointInPolygon(point, bodyParts.leftHand.points)) return 'skin';
            if (isPointInPolygon(point, bodyParts.rightHand.points)) return 'skin';

            // Check Feet
            if (isPointInPolygon(point, bodyParts.leftFoot.points)) return 'shoes';
            if (isPointInPolygon(point, bodyParts.rightFoot.points)) return 'shoes';

            // Check Rest
            for (const key in bodyParts) {
                if (key === 'head') continue; // Skip head
                if (bodyParts[key].region) {
                    if (bodyParts[key].points && isPointInPolygon(point, bodyParts[key].points)) return bodyParts[key].region;
                    if (bodyParts[key].type === 'circle' || (bodyParts[key].center && bodyParts[key].radius)) {
                        const dx = x - bodyParts[key].center.x;
                        const dy = y - bodyParts[key].center.y;
                        if (dx * dx + dy * dy <= bodyParts[key].radius * bodyParts[key].radius) return bodyParts[key].region;
                    }
                }
            }
            return null;
        };

        // Helper to shade color
        const shade = (c, percent) => ({ r: Math.max(0, c.r * (1 - percent)), g: Math.max(0, c.g * (1 - percent)), b: Math.max(0, c.b * (1 - percent)) });
        const tint = (c, percent) => ({ r: Math.min(255, c.r + (255 - c.r) * percent), g: Math.min(255, c.g + (255 - c.g) * percent), b: Math.min(255, c.b + (255 - c.b) * percent) });

        // Fill Loop
        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < this.canvasSize; x++) {
                // Check if inside any body part (except head)
                const region = getRegion(x, y);
                if (region) {
                    let color = null;
                    if (region === 'skin') color = colors.skin;
                    else if (region === 'shirt') color = colors.shirt;
                    else if (region === 'pants') color = colors.pants;
                    else if (region === 'shoes') color = { r: 30, g: 30, b: 30 };

                    if (color) {
                        // Clothing Details
                        if (region === 'shirt') {
                            if (shirtPattern === 'stripes') {
                                if (y % 4 === 0) color = shade(color, 0.15);
                            } else if (shirtPattern === 'checkers') {
                                if ((Math.floor(x / 3) + Math.floor(y / 3)) % 2 === 0) color = shade(color, 0.1);
                            } else if (shirtPattern === 'buttons') {
                                if (Math.abs(x - this.centerX) <= 1) {
                                    color = shade(color, 0.1); // Placket
                                    if (y % 5 === 0 && y > minY + 5) color = tint(color, 0.3); // Button
                                }
                            }
                        } else if (region === 'pants') {
                            if (pantsPattern === 'stripes') {
                                if (x % 3 === 0) color = shade(color, 0.1);
                            }
                        }

                        pixels[y][x] = color;
                    }
                }
            }
        }

        // Add belt at shirt/pants boundary by detecting color transition
        // Current approach: O(n²) color reference comparison
        // Alternative optimization if needed: Track regions during fill (requires ~2x memory)
        for (let y = 1; y < this.canvasSize - 1; y++) {
            for (let x = 0; x < this.canvasSize; x++) {
                if (pixels[y][x] && pixels[y + 1][x]) {
                    // Detect shirt-to-pants transition by comparing color references
                    const c1 = pixels[y][x];
                    const c2 = pixels[y + 1][x];
                    if (c1 === colors.shirt && c2 === colors.pants) {
                        pixels[y][x] = { r: 50, g: 30, b: 20 }; // Belt color
                    }
                }
            }
        }

        // 3. Stamp Face
        for (let fy = 0; fy < headH; fy++) {
            for (let fx = 0; fx < headW; fx++) {
                const color = faceGrid[fy][fx];
                if (color) {
                    const targetX = minX + fx;
                    const targetY = minY + fy;
                    if (targetX >= 0 && targetX < this.canvasSize && targetY >= 0 && targetY < this.canvasSize) {
                        pixels[targetY][targetX] = color;
                    }
                }
            }
        }

        // Apply outline to human characters (black outline for definition)
        // Note: Outline is drawn OUTSIDE the character on empty adjacent pixels
        if (params.showOutline !== false) {
            const outlineColor = this.hexToRgb(params.outlineColor) || { r: 0, g: 0, b: 0 };
            this.applyOutline(pixels, outlineColor);
        }

        return pixels;
    }

    // Override animation frames with breathing + arm/leg movement
    generateAnimationFrames(params) {
        const frames = [];
        // Frame variations: exhale, neutral, inhale
        const variations = [
            { torsoMult: 0.96, armMult: 1.05, legMult: 1.0, y: 0.5 },   // Exhale: slightly down
            { torsoMult: 1.0, armMult: 1.0, legMult: 1.0, y: 0 },       // Neutral
            { torsoMult: 1.04, armMult: 0.95, legMult: 1.0, y: -0.5 }   // Inhale: slightly up
        ];

        variations.forEach(variation => {
            const frameParams = { ...params };

            // Breathing: adjust torso height
            if (frameParams.torsoHeight) {
                frameParams.torsoHeight = frameParams.torsoHeight * variation.torsoMult;
            }

            // Breathing: slight vertical position adjustment
            if (frameParams.torsoY) {
                frameParams.torsoY = frameParams.torsoY + variation.y;
            }

            // Arm movement: slight angle variation for natural pose
            if (frameParams.armAngle) {
                frameParams.armAngle = frameParams.armAngle * variation.armMult;
            }

            // Generate frame with modified params
            const heatmap = this.generateHeatmap(this.generateBodyParts(frameParams), frameParams);
            const pixels = this.generatePixels(heatmap, frameParams);
            frames.push(pixels);
        });

        return frames;
    }
}
