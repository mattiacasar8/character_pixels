import { CharacterGenerator } from '../../core/generator.js';
import { SKIN_TONES, CLOTHING_COLORS, HAIR_COLORS, EYE_COLORS, MOUTH_COLORS } from '../../data/human-palettes.js';
import { randomFloat, randomInt, SeededRandom } from '../../utils/random.js';
import { createTrapezoid, createJoint, getTrapezoidBottom, isPointInPolygon } from '../../utils/math.js';
import { FaceGenerator } from './face-generator.js';
import { nameGenerator } from '../name-generator.js';
import { processorManager } from '../../core/processors/ProcessorManager.js';
import { ClothingGenerator } from './clothing-generator.js';
import { AccessoryGenerator } from './accessory-generator.js';
import { BODY_PROPORTIONS } from '../../config.js';

export class HumanGenerator extends CharacterGenerator {
    constructor(canvasSize = 50) {
        super(canvasSize);
        this.faceGenerator = new FaceGenerator();
        this.clothingGenerator = new ClothingGenerator();
        this.accessoryGenerator = new AccessoryGenerator();
    }

    generate(params) {
        const characterData = super.generate(params);
        characterData.name = nameGenerator.generate();
        return characterData;
    }

    // Override to use human palettes
    randomParamsInRange(preset = 'standard', existingSeed = null) {
        const seed = existingSeed !== null ? existingSeed : Math.floor(Math.random() * 2147483647);
        const params = super.randomParamsInRange(preset, seed);

        // Select colors deterministically using the seed
        // We use a salted seed for colors to avoid correlation with size params if desired,
        // but using the same RNG sequence involves less boilerplate.
        // Let's create a new seeded RNG specifically for colors to keep it clean.
        // We can just use the next values from the rng initialized in super if we passed rng back,
        // but super returns params object.
        // So we re-initialize rng with the same seed + salt for colors.

        // Actually, super.randomParamsInRange returns params.seed.
        // Let's use a simple integer salt to ensure colors are distinct from geometry but deterministic.
        // We use integer addition because SeededRandom works best with integer seeds.
        // hash() returns a float 0-1 which is bad for SeededRandom initialization.
        const rng = new SeededRandom(params.seed + 12345); // Salted with integer

        const getRandomColor = (array) => array[rng.int(0, array.length - 1)];

        const skinTone = getRandomColor(SKIN_TONES);
        const shirtColor = getRandomColor(CLOTHING_COLORS);
        let pantsColor = getRandomColor(CLOTHING_COLORS);

        // Ensure pants are different from shirt
        let attempts = 0;
        while (pantsColor === shirtColor && CLOTHING_COLORS.length > 1 && attempts < 10) {
            pantsColor = getRandomColor(CLOTHING_COLORS);
            attempts++;
        }

        const hairColor = getRandomColor(HAIR_COLORS);
        const eyeColor = getRandomColor(EYE_COLORS);
        const mouthColor = getRandomColor(MOUTH_COLORS);

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
        // Fallback for non-seeded calls if any
        return array[Math.floor(Math.random() * array.length)];
    }

    // Override to enforce human proportions
    // Canvas is 50px (0-49). Proportions recalculated based on feedback.
    getParamRanges(preset) {
        const baseRanges = { ...BODY_PROPORTIONS.human.base };

        if (preset && BODY_PROPORTIONS.human.presets[preset]) {
            return {
                ...baseRanges,
                ...BODY_PROPORTIONS.human.presets[preset]
            };
        }

        return baseRanges;
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

            // To maintain determinism, we need to replicate the color selection order if params aren't present
            // But usually generatePixels is called with params generated by randomParamsInRange/generateFrames
            // which should have colors.
            // If we are here, we might need a fallback.
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
        const clothingPatterns = this.clothingGenerator.generatePatterns(rng);

        // Generate Accessories
        const accessories = this.accessoryGenerator.generateAccessories(rng);

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
                        if (clothingPatterns.shirt.pattern === 'tunic' && clothingPatterns.shirt.props.long) {
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
                        // Apply Patterns
                        color = this.clothingGenerator.applyPattern(
                            x, y, color, region, clothingPatterns, this.centerX, minY, maxY
                        );
                    }

                    pixels[y][x] = color;
                }
            }
        }

        // Post-Process: Accessories
        this.accessoryGenerator.drawAccessories(pixels, accessories, this.centerX, minY, this.canvasSize);
        // Special case for belt which needs colors
        this.accessoryGenerator.drawBelt(pixels, this.centerX, this.canvasSize, colors);


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

        // Effects (smoothing, lighting, outline) are now applied by ProcessorManager
        // in the base CharacterGenerator.generate() method

        return pixels;
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
            let pixels = this.generatePixels(heatmap, frameParams); // Use let to allow reassignment

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

            // Apply Processors (Smoothing, Lighting, Outline)
            // Prepare effect params
            const effects = frameParams.effects || {
                smoothing: frameParams.enableSmoothing !== false,
                lighting: frameParams.enableLighting !== false,
                outline: frameParams.showOutline !== false
            };

            const effectParams = {
                ...frameParams,
                effects,
                outlineColor: frameParams.outlineColor,
                lightDirection: frameParams.lightDirection
            };

            pixels = processorManager.applyAll(pixels, effectParams, this.canvasSize);

            frames.push(pixels);
        });

        return frames;
    }
}