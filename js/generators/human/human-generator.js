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
    // Canvas is 50px (0-49). Proportions recalculated based on feedback:
    // - Head + Neck: ~10-12px
    // - Torso: ~11-20px (22-40% as suggested)
    // - Legs: Calculated to fit remaining space without being too long
    getParamRanges(preset) {
        const baseRanges = {
            // Torso: Balanced proportions
            torsoTopWidth: { min: 14, max: 20 },
            torsoBottomWidth: { min: 12, max: 18 },
            torsoHeight: { min: 22, max: 28 },      // Increased from 12-16 based on feedback
            torsoY: { min: 12, max: 16 },           // Adjusted to accommodate larger torso

            // Neck
            neckWidth: { min: 4, max: 6 },
            neckHeight: { min: 3, max: 4 },

            // Head: Proportional
            headWidth: { min: 12, max: 16 },
            headHeight: { min: 8, max: 11 },

            // Arms: Thicker and more varied poses
            upperArmTopWidth: { min: 5, max: 8 },    // Increased from 4-6
            upperArmBottomWidth: { min: 4, max: 7 },
            upperArmLength: { min: 12, max: 16 },
            forearmTopWidth: { min: 4, max: 7 },
            forearmBottomWidth: { min: 3, max: 6 },
            forearmLength: { min: 12, max: 16 },
            armAngle: { min: -85, max: -55 },        // More variety in poses
            elbowAngle: { min: -5, max: 25 },        // More natural bend range

            // Legs: Shorter to avoid being too long
            thighTopWidth: { min: 6, max: 10 },      // Thicker for cavallo
            thighBottomWidth: { min: 5, max: 8 },
            thighLength: { min: 10, max: 14 },       // Reduced significantly
            shinTopWidth: { min: 5, max: 8 },
            shinBottomWidth: { min: 4, max: 7 },
            shinLength: { min: 10, max: 14 },        // Reduced significantly
            legAngle: { min: -10, max: 10 },         // More angle for cavallo separation

            // Generation
            fillDensity: { min: 1.0, max: 1.0 }
        };

        switch (preset) {
            case 'athletic':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 18, max: 24 },        // Much wider
                    torsoBottomWidth: { min: 16, max: 22 },
                    torsoHeight: { min: 24, max: 30 },
                    upperArmTopWidth: { min: 6, max: 10 },       // Muscular arms
                    forearmTopWidth: { min: 5, max: 8 },
                    thighTopWidth: { min: 8, max: 12 },          // Thick legs
                    shinTopWidth: { min: 6, max: 10 }
                };

            case 'slim':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 10, max: 14 },         // Much narrower
                    torsoBottomWidth: { min: 8, max: 12 },
                    torsoHeight: { min: 20, max: 26 },           // Slightly shorter torso
                    upperArmTopWidth: { min: 3, max: 5 },        // Thin arms
                    forearmTopWidth: { min: 3, max: 5 },
                    thighTopWidth: { min: 4, max: 6 },           // Thin legs
                    shinTopWidth: { min: 3, max: 5 }
                };

            case 'stocky':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 20, max: 26 },         // Very wide
                    torsoBottomWidth: { min: 18, max: 24 },
                    torsoHeight: { min: 20, max: 26 },           // Shorter torso
                    torsoY: { min: 14, max: 18 },                // Lower position
                    upperArmTopWidth: { min: 6, max: 9 },        // Thick arms
                    thighTopWidth: { min: 8, max: 12 },          // Very thick legs
                    thighLength: { min: 8, max: 12 },            // Shorter legs
                    shinLength: { min: 8, max: 12 }
                };

            case 'tall':
                return {
                    ...baseRanges,
                    torsoHeight: { min: 26, max: 34 },           // Taller torso
                    torsoY: { min: 10, max: 14 },                // Higher to fit
                    headHeight: { min: 7, max: 10 },
                    upperArmLength: { min: 14, max: 18 },        // Longer limbs
                    forearmLength: { min: 14, max: 18 },
                    thighLength: { min: 12, max: 16 },
                    shinLength: { min: 12, max: 16 }
                };

            case 'standard':
            default:
                return baseRanges;
        }
    }

    generateBodyParts(params) {
        // First call parent to get base body parts
        const parts = {};
        const scale = this.canvasSize / 100;
        const scaledParams = this.scaleParams(params, scale);

        // Generate torso, neck, head, arms exactly as base class
        // (code duplicated from base to override leg generation)
        const torsoTop = scaledParams.torsoY;
        const torsoBottom = torsoTop + scaledParams.torsoHeight;
        parts.torso = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.torsoTopWidth, scaledParams.torsoBottomWidth,
            scaledParams.torsoHeight,
            0
        );

        parts.neck = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.neckWidth, scaledParams.neckWidth,
            -scaledParams.neckHeight,
            0
        );

        parts.head = createTrapezoid(
            this.centerX, torsoTop - scaledParams.neckHeight,
            scaledParams.headWidth, scaledParams.headWidth,
            -scaledParams.headHeight,
            0
        );

        // Arms (symmetric)
        const leftShoulderAngle = scaledParams.armAngle;
        const leftForearmAngle = scaledParams.armAngle + scaledParams.elbowAngle;
        const rightShoulderAngle = -scaledParams.armAngle;
        const rightForearmAngle = -scaledParams.armAngle - scaledParams.elbowAngle;

        const leftShoulderX = this.centerX - scaledParams.torsoTopWidth / 2;
        parts.leftUpperArm = createTrapezoid(
            leftShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            leftShoulderAngle
        );
        const upperArmEnd = getTrapezoidBottom(parts.leftUpperArm);
        parts.leftForearm = createTrapezoid(
            upperArmEnd.x, upperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            leftForearmAngle
        );

        const rightShoulderX = this.centerX + scaledParams.torsoTopWidth / 2;
        parts.rightUpperArm = createTrapezoid(
            rightShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            rightShoulderAngle
        );
        const rightUpperArmEnd = getTrapezoidBottom(parts.rightUpperArm);
        parts.rightForearm = createTrapezoid(
            rightUpperArmEnd.x, rightUpperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            rightForearmAngle
        );

        // LEGS: Use specified length instead of calculating to ground
        // This prevents overly long legs
        const leftHipX = this.centerX - scaledParams.torsoBottomWidth / 2;
        parts.leftThigh = createTrapezoid(
            leftHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            scaledParams.legAngle
        );
        const thighEnd = getTrapezoidBottom(parts.leftThigh);

        // Use scaledParams.shinLength directly instead of calculating to ground
        parts.leftShin = createTrapezoid(
            thighEnd.x, thighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            scaledParams.shinLength,  // Use params instead of remainingShinLength!
            0
        );

        const rightHipX = this.centerX + scaledParams.torsoBottomWidth / 2;
        parts.rightThigh = createTrapezoid(
            rightHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            -scaledParams.legAngle
        );
        const rightThighEnd = getTrapezoidBottom(parts.rightThigh);

        parts.rightShin = createTrapezoid(
            rightThighEnd.x, rightThighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            scaledParams.shinLength,  // Use params instead of remainingShinLength!
            0
        );

        // Joints
        parts.leftElbow = createJoint(parts.leftUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.rightElbow = createJoint(parts.rightUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.leftKnee = createJoint(parts.leftThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.rightKnee = createJoint(parts.rightThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.leftShoulder = createJoint(parts.leftUpperArm.center, scaledParams.upperArmTopWidth / 2);
        parts.rightShoulder = createJoint(parts.rightUpperArm.center, scaledParams.upperArmTopWidth / 2);

        // Hands
        const leftHandStart = parts.leftForearm.bottomCenter;
        parts.leftHand = createTrapezoid(
            leftHandStart.x, leftHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            leftForearmAngle
        );
        const rightHandStart = parts.rightForearm.bottomCenter;
        parts.rightHand = createTrapezoid(
            rightHandStart.x, rightHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            rightForearmAngle
        );

        // Feet
        const leftFootStart = parts.leftShin.bottomCenter;
        parts.leftFoot = createTrapezoid(
            leftFootStart.x, leftFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90
        );
        const rightFootStart = parts.rightShin.bottomCenter;
        parts.rightFoot = createTrapezoid(
            rightFootStart.x, rightFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90
        );

        // Assign materials/regions for human rendering
        parts.head.region = 'head';
        parts.neck.region = 'skin';
        parts.leftHand.region = 'skin';
        parts.rightHand.region = 'skin';

        parts.torso.region = 'shirt';
        parts.leftUpperArm.region = 'shirt';
        parts.rightUpperArm.region = 'shirt';
        parts.leftForearm.region = 'shirt';
        parts.rightForearm.region = 'shirt';

        parts.leftThigh.region = 'pants';
        parts.rightThigh.region = 'pants';
        parts.leftShin.region = 'pants';
        parts.rightShin.region = 'pants';

        parts.leftFoot.region = 'shoes';
        parts.rightFoot.region = 'shoes';

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

    // Override animation frames with breathing + arm movement + head bobbing
    generateAnimationFrames(params) {
        const frames = [];
        let facePixels = null;
        let headBounds = null;

        // Frame variations: exhale, neutral, inhale
        const variations = [
            { torsoMult: 0.96, armMult: 1.05, y: 0.5, headBob: 1 },    // Exhale: down, head up
            { torsoMult: 1.0, armMult: 1.0, y: 0, headBob: 0 },         // Neutral
            { torsoMult: 1.04, armMult: 0.95, y: -0.5, headBob: -1 }   // Inhale: up, head down
        ];

        variations.forEach((variation, index) => {
            const frameParams = { ...params };

            // CRITICAL: Preserve seed and colors across all frames
            if (!frameParams.seed) {
                frameParams.seed = Math.floor(Math.random() * 2147483647);
            }
            if (!frameParams.humanColors && params.humanColors) {
                frameParams.humanColors = params.humanColors;
            }

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
            const bodyParts = this.generateBodyParts(frameParams);
            const heatmap = this.generateHeatmap(bodyParts, frameParams);
            const pixels = this.generatePixels(heatmap, frameParams);

            // Extract and preserve face from first frame
            if (index === 0) {
                const head = bodyParts.head;
                if (head && head.points) {
                    const xs = head.points.map(p => p.x);
                    const ys = head.points.map(p => p.y);
                    headBounds = {
                        minX: Math.floor(Math.min(...xs)),
                        maxX: Math.ceil(Math.max(...xs)),
                        minY: Math.floor(Math.min(...ys)),
                        maxY: Math.ceil(Math.max(...ys))
                    };

                    // Extract face pixels from first frame
                    facePixels = [];
                    for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
                        facePixels[y] = [];
                        for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                            if (y >= 0 && y < this.canvasSize && x >= 0 && x < this.canvasSize) {
                                facePixels[y][x] = pixels[y][x] ? { ...pixels[y][x] } : null;
                            }
                        }
                    }
                }
            } else if (facePixels && headBounds) {
                // Apply consistent face with head bobbing
                const yOffset = variation.headBob;

                // Clear current head area first
                for (let y = headBounds.minY - 1; y <= headBounds.maxY + 1; y++) {
                    for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                        if (y >= 0 && y < this.canvasSize && x >= 0 && x < this.canvasSize) {
                            pixels[y][x] = null;
                        }
                    }
                }

                // Apply face with offset
                for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
                    for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                        const targetY = y + yOffset;
                        if (targetY >= 0 && targetY < this.canvasSize && x >= 0 && x < this.canvasSize) {
                            if (facePixels[y] && facePixels[y][x] !== undefined) {
                                pixels[targetY][x] = facePixels[y][x] ? { ...facePixels[y][x] } : null;
                            }
                        }
                    }
                }
            }

            frames.push(pixels);
        });

        return frames;
    }
}
