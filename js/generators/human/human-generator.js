import { CharacterGenerator } from '../../core/generator.js';
import { SKIN_TONES, CLOTHING_COLORS, HAIR_COLORS, EYE_COLORS, MOUTH_COLORS } from '../../data/human-palettes.js';
import { randomFloat, randomInt, SeededRandom, hash } from '../../utils/random.js';
import { createTrapezoid, createJoint, getTrapezoidBottom, isPointInPolygon } from '../../utils/math.js';
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
    // Canvas is 50px (0-49). Proportions recalculated based on feedback.
    getParamRanges(preset) {
        const baseRanges = {
            // Torso (17-35%, 14-27%, 20-41%)
            torsoTopWidth: { min: 17, max: 35 },
            torsoBottomWidth: { min: 14, max: 27 },
            torsoHeight: { min: 20, max: 41 },
            // Position: Dynamic based on height
            // We override torsoY in generateBodyParts to center the character
            torsoY: { min: 28, max: 34 },

            // Neck (4-6%, 2-4%)
            neckWidth: { min: 4, max: 6 },
            neckHeight: { min: 2, max: 4 },

            // Head (14-24%)
            headWidth: { min: 14, max: 24 },
            headHeight: { min: 14, max: 24 },

            // Arms (Len: 14-22%, W: 9-14%, 6-9%)
            upperArmTopWidth: { min: 9, max: 14 },
            upperArmBottomWidth: { min: 7, max: 11 }, // Slightly tapered
            upperArmLength: { min: 14, max: 22 },
            forearmTopWidth: { min: 6, max: 9 },
            forearmBottomWidth: { min: 5, max: 8 },
            forearmLength: { min: 14, max: 22 },

            // Angles
            armAngle: { min: -40, max: 0 },
            elbowAngle: { min: -5, max: 35 },

            // Legs (Len: 12-18%, W: 7-12%, 5-8%)
            thighTopWidth: { min: 7, max: 12 },
            thighBottomWidth: { min: 6, max: 10 },
            thighLength: { min: 12, max: 18 },
            shinTopWidth: { min: 5, max: 8 },
            shinBottomWidth: { min: 4, max: 7 },
            shinLength: { min: 12, max: 18 },
            legAngle: { min: -25, max: 0 },

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

        // We want the feet to be at a consistent "ground" level (90% of canvas).
        const groundY = this.canvasSize * 0.9;
        const legVertical = scaledParams.thighLength + scaledParams.shinLength;
        const calculatedTorsoY = groundY - scaledParams.torsoHeight - legVertical;

        // Ensure we don't go too high (cut off head)
        const minHeadTop = 2; // 2px margin
        const impliedHeadTop = calculatedTorsoY - scaledParams.neckHeight - scaledParams.headHeight;

        let torsoTop = calculatedTorsoY;
        if (impliedHeadTop < minHeadTop) {
            torsoTop = minHeadTop + scaledParams.headHeight + scaledParams.neckHeight;
        }

        // Apply the calculated Y
        scaledParams.torsoY = torsoTop;

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
        // Position legs inward by half their width so they sit inside the torso bottom edge
        const leftHipX = this.centerX - scaledParams.torsoBottomWidth / 2 + scaledParams.thighTopWidth / 2;
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

        const rightHipX = this.centerX + scaledParams.torsoBottomWidth / 2 - scaledParams.thighTopWidth / 2;
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

        // Joints - Reduced size to 0.65 of limb width to avoid Popeye effect
        parts.leftElbow = createJoint(parts.leftUpperArm.bottomCenter, scaledParams.upperArmBottomWidth * 0.325);
        parts.rightElbow = createJoint(parts.rightUpperArm.bottomCenter, scaledParams.upperArmBottomWidth * 0.325);
        parts.leftKnee = createJoint(parts.leftThigh.bottomCenter, scaledParams.thighBottomWidth * 0.325);
        parts.rightKnee = createJoint(parts.rightThigh.bottomCenter, scaledParams.thighBottomWidth * 0.325);
        parts.leftShoulder = createJoint(parts.leftUpperArm.center, scaledParams.upperArmTopWidth * 0.325);
        parts.rightShoulder = createJoint(parts.rightUpperArm.center, scaledParams.upperArmTopWidth * 0.325);

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

        // Determine Clothing Patterns & Styles

        // Shirt Patterns
        const shirtPatternVal = rng.next();
        let shirtPattern = 'none';
        let shirtProps = {};

        if (shirtPatternVal < 0.25) {
            shirtPattern = 'stripes';
            shirtProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (shirtPatternVal < 0.5) {
            shirtPattern = 'checkers';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.shape = 'square';
            else if (sub < 0.66) shirtProps.shape = 'triangle';
            else shirtProps.shape = 'circle';
        } else if (shirtPatternVal < 0.75) {
            shirtPattern = 'buttons';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.align = 'left';
            else if (sub < 0.66) shirtProps.align = 'right';
            else shirtProps.align = 'center';
        } else {
            shirtPattern = 'tunic';
            shirtProps.long = rng.next() < 0.3; // 30% chance of long tunic/robe
        }

        // Pants Patterns
        const pantsPatternVal = rng.next();
        let pantsPattern = 'none';
        let pantsProps = {};
        if (pantsPatternVal < 0.3) {
            pantsPattern = 'stripes';
            pantsProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (pantsPatternVal < 0.5) {
            pantsPattern = 'patches';
        }

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
                    if (bodyParts[key].points && isPointInPolygon(point, bodyParts[key].points)) {
                        let region = bodyParts[key].region;

                        // LONG TUNIC OVERRIDE
                        if (shirtPattern === 'tunic' && shirtProps.long) {
                            if (region === 'pants') return 'shirt'; // Cover legs
                        }

                        return region;
                    }
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
        const tint = (c, percent) => ({ r: Math.min(255, c.r + (255 - c.r) * percent), g: Math.min(255, c.g + (255 - c.r) * percent), b: Math.min(255, c.b + (255 - c.b) * percent) });

        // Accessories Generation
        const hasNecklace = rng.next() < 0.3; // 30% chance
        let necklace = null;
        if (hasNecklace) {
            necklace = {
                color: rng.next() < 0.5 ? { r: 255, g: 215, b: 0 } : { r: 192, g: 192, b: 192 }, // Gold or Silver
                length: rng.next() < 0.5 ? 'short' : 'long',
                pendant: ['circle', 'diamond', 'square', 'cross', 'gem'][rng.int(0, 4)]
            };
            if (necklace.pendant === 'gem') {
                necklace.pendantColor = { r: 231, g: 76, b: 60 }; // Ruby default
                if (rng.next() < 0.33) necklace.pendantColor = { r: 46, g: 204, b: 113 }; // Emerald
                else if (rng.next() < 0.66) necklace.pendantColor = { r: 52, g: 152, b: 219 }; // Sapphire
            }
        }

        const hasCuts = rng.next() < 0.15; // 15% chance of cuts/tears
        const hasPockets = rng.next() < 0.4; // 40% chance of pockets

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
                    else if (region === 'shoes') color = { r: 40, g: 30, b: 20 }; // Leather boots default

                    if (color) {
                        // Clothing Details & Patterns
                        if (region === 'shirt') {
                            if (shirtPattern === 'stripes') {
                                if (shirtProps.orientation === 'horizontal') {
                                    if (y % 4 === 0) color = shade(color, 0.15);
                                } else {
                                    if (x % 4 === 0) color = shade(color, 0.15);
                                }
                            } else if (shirtPattern === 'checkers') {
                                const cx = Math.floor(x / 3);
                                const cy = Math.floor(y / 3);
                                const isCheck = (cx + cy) % 2 === 0;

                                if (isCheck) {
                                    if (shirtProps.shape === 'square') {
                                        color = shade(color, 0.1);
                                    } else if (shirtProps.shape === 'triangle') {
                                        // Diagonal split
                                        if ((x % 3) + (y % 3) < 3) color = shade(color, 0.1);
                                    } else {
                                        // Circle/Dot (center of 3x3)
                                        if (x % 3 === 1 && y % 3 === 1) color = shade(color, 0.2);
                                    }
                                }
                            } else if (shirtPattern === 'buttons') {
                                let btnX = this.centerX;
                                if (shirtProps.align === 'left') btnX -= 3;
                                if (shirtProps.align === 'right') btnX += 3;

                                if (Math.abs(x - btnX) <= 1) {
                                    color = shade(color, 0.1); // Placket
                                    if (y % 5 === 0 && y > minY + 5) color = tint(color, 0.3); // Button
                                }
                            } else if (shirtPattern === 'tunic') {
                                // Vertical trim (lighter center)
                                if (Math.abs(x - this.centerX) <= 2) color = tint(color, 0.15);
                                // Bottom trim
                                if (y > maxY - 2) color = tint(color, 0.1);

                                // Tunic buttons
                                if (Math.abs(x - this.centerX) === 0 && y % 6 === 0 && y > minY + 5) {
                                    color = shade(color, 0.2); // Dark buttons
                                }
                            }
                        } else if (region === 'pants') {
                            if (pantsPattern === 'stripes') {
                                if (pantsProps.orientation === 'vertical') {
                                    if (x % 3 === 0) color = shade(color, 0.1);
                                } else {
                                    if (y % 3 === 0) color = shade(color, 0.1);
                                }
                            } else if (pantsPattern === 'patches') {
                                // 3x3 patches
                                const px = Math.floor(x / 3);
                                const py = Math.floor(y / 3);
                                const patchHash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
                                if ((patchHash - Math.floor(patchHash)) > 0.9) {
                                    color = shade(color, 0.2);
                                }
                            }
                        }

                        // Pockets
                        if (hasPockets) {
                            // Simple side pockets
                            if (Math.abs(x - this.centerX) >= 4 && Math.abs(x - this.centerX) <= 7) {
                                if (y >= minY + 20 && y <= minY + 24) { // Approx hip level
                                    color = shade(color, 0.1);
                                }
                            }
                        }
                    }

                    // Cuts/Tears (Global on clothes)
                    if (hasCuts && (region === 'shirt' || region === 'pants')) {
                        // Random noise for cuts
                        const cutHash = Math.sin(x * 45.123 + y * 91.532) * 12345.678;
                        if ((cutHash - Math.floor(cutHash)) > 0.98) { // 2% chance per pixel
                            color = shade(color, 0.4); // Dark cut
                            // Or show skin?
                            // color = colors.skin; 
                        }
                    }

                    pixels[y][x] = color;
                }
            }
        }

        // Post-Process: Necklace
        if (necklace) {
            const neckY = minY + 3; // Approx neck base
            const chainColor = necklace.color;

            // Draw Chain
            const chainLength = necklace.length === 'long' ? 10 : 6;
            for (let i = 0; i <= chainLength; i++) {
                // V shape
                const dy = i;
                const dx = Math.floor(i * 0.7);

                // Left side
                if (pixels[neckY + dy] && pixels[neckY + dy][this.centerX - dx])
                    pixels[neckY + dy][this.centerX - dx] = chainColor;

                // Right side
                if (pixels[neckY + dy] && pixels[neckY + dy][this.centerX + dx])
                    pixels[neckY + dy][this.centerX + dx] = chainColor;
            }

            // Draw Pendant
            const pendantY = neckY + chainLength;
            const pendantX = this.centerX;
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

        // Add belt at shirt/pants boundary by detecting color transition
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

        // 4. Apply Directional Lighting (Top-Right Source)
        this.applyLighting(pixels);

        // Apply outline to human characters (black outline for definition)
        if (params.showOutline !== false) {
            const outlineColor = this.hexToRgb(params.outlineColor) || { r: 0, g: 0, b: 0 };
            this.applyOutline(pixels, outlineColor);
        }

        return pixels;
    }

    applyLighting(pixels) {
        // Light Source: Top-Right
        // Highlights: Top edges, Right edges
        // Shadows: Bottom edges, Left edges

        const shade = (c, percent) => ({
            r: Math.max(0, c.r * (1 - percent)),
            g: Math.max(0, c.g * (1 - percent)),
            b: Math.max(0, c.b * (1 - percent))
        });
        const tint = (c, percent) => ({
            r: Math.min(255, c.r + (255 - c.r) * percent),
            g: Math.min(255, c.g + (255 - c.g) * percent),
            b: Math.min(255, c.b + (255 - c.b) * percent)
        });

        // We need a copy or to be careful not to propagate lighting changes immediately if we scan
        // But for simple edge lighting, immediate update is usually okay if we don't read from updated pixels for neighbors.
        // Actually, we check neighbors to decide if WE are an edge.
        // Neighbors are not changing their "existence" (null/not null), only color.
        // So we can modify in place.

        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < this.canvasSize; x++) {
                const color = pixels[y][x];
                if (!color) continue;

                // Check neighbors (0 is empty/null)
                const top = (y > 0) ? pixels[y - 1][x] : null;
                const bottom = (y < this.canvasSize - 1) ? pixels[y + 1][x] : null;
                const left = (x > 0) ? pixels[y][x - 1] : null;
                const right = (x < this.canvasSize - 1) ? pixels[y][x + 1] : null;

                let newColor = color;

                // Highlights (Top & Right)
                if (!top) newColor = tint(newColor, 0.2);
                if (!right) newColor = tint(newColor, 0.15);

                // Shadows (Bottom & Left)
                if (!bottom) newColor = shade(newColor, 0.2);
                if (!left) newColor = shade(newColor, 0.15);

                pixels[y][x] = newColor;
            }
        }
    }

    // Override animation frames with breathing + arm movement + head bobbing
    generateAnimationFrames(params) {
        const frames = [];
        let facePixels = null;
        let headBounds = null;

        // CRITICAL: Ensure seed and colors are set ONCE before generating frames
        // This prevents different colors on each frame
        if (!params.seed) {
            params.seed = Math.floor(Math.random() * 2147483647);
        }
        if (!params.humanColors) {
            // Generate colors once using the seed
            const rng = new SeededRandom(params.seed);
            const getSeededColor = (arr) => arr[rng.int(0, arr.length - 1)];
            params.humanColors = {
                skin: getSeededColor(SKIN_TONES),
                shirt: getSeededColor(CLOTHING_COLORS),
                pants: getSeededColor(CLOTHING_COLORS),
                hair: getSeededColor(HAIR_COLORS),
                eyes: getSeededColor(EYE_COLORS),
                mouth: getSeededColor(MOUTH_COLORS)
            };
        }

        // Frame variations: exhale, neutral, inhale
        const variations = [
            { torsoMult: 0.96, armMult: 1.05, y: 0.5, headBob: 1 },    // Exhale: down, head up
            { torsoMult: 1.0, armMult: 1.0, y: 0, headBob: 0 },         // Neutral
            { torsoMult: 1.04, armMult: 0.95, y: -0.5, headBob: -1 }   // Inhale: up, head down
        ];

        variations.forEach((variation, index) => {
            const frameParams = { ...params };
            // Seed and humanColors are now guaranteed to be in params, so they'll be copied correctly

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
                for (let y = headBounds.minY - 2; y <= headBounds.maxY + 2; y++) {
                    for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                        if (y >= 0 && y < this.canvasSize && x >= 0 && x < this.canvasSize) {
                            // Only clear if it was likely part of the head/face in the previous frame
                            // This is tricky without a mask.
                            // Simplification: Just overwrite with face pixels, and if moving up, fill neck.
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

                // Fix Neck Separation: If head moves up, fill the gap below.
                if (yOffset < 0) { // Head moved up
                    // Find the bottom of the head/face
                    const neckTopY = headBounds.maxY + yOffset + 1;

                    // Scan the bottom row of the face and extend downwards if needed
                    for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                        // If we have a face pixel at the bottom of the moved face
                        const faceBottomY = headBounds.maxY + yOffset;
                        if (pixels[faceBottomY] && pixels[faceBottomY][x]) {
                            // Check if there's a gap below
                            if (pixels[faceBottomY + 1] && !pixels[faceBottomY + 1][x]) {
                                // Fill it with the pixel below that (if it exists) or the face pixel color (neck color)
                                if (pixels[faceBottomY + 2] && pixels[faceBottomY + 2][x]) {
                                    pixels[faceBottomY + 1][x] = { ...pixels[faceBottomY + 2][x] };
                                } else {
                                    // Fallback: extend neck down
                                    pixels[faceBottomY + 1][x] = { ...pixels[faceBottomY][x] }; // Extend face/neck down
                                }
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