import { CharacterGenerator } from '../../core/generator.js';
import { MONSTER_PALETTES } from '../../data/monster-palettes.js';
import { MonsterNameGenerator } from './monster-names.js';
import { PARAM_CONFIG } from '../../config.js';
import { createTrapezoid, createJoint, getTrapezoidBottom } from '../../utils/math.js';

export class MonsterGenerator extends CharacterGenerator {
    constructor(canvasSize = 50) {
        super(canvasSize);
        this.nameGenerator = new MonsterNameGenerator();
    }

    // This method is now handled by the base CharacterGenerator,
    // but we need to override the name generation.
    generate(params) {
        // Call the base class's generate method to handle pixel generation, smoothing, outline, etc.
        const characterData = super.generate(params);

        // Generate a monster-specific name
        const nameGen = new MonsterNameGenerator();
        characterData.name = nameGen.generate();

        return characterData;
    }

    // reprocess is now handled by the base CharacterGenerator
    // resolveParams is now handled by the base CharacterGenerator
    // randomParams is now handled by the base CharacterGenerator

    randomParamsInRange(preset = 'standard') {
        const ranges = this.getParamRanges(preset);
        const params = super.randomParamsInRange(preset);

        // Override palette with a monster one
        const paletteIndex = Math.floor(Math.random() * MONSTER_PALETTES.length);
        params.palette = [...MONSTER_PALETTES[paletteIndex]];

        return params;
    }

    getParamRanges(preset) {
        // All size parameters are now in % of canvas size
        const baseRanges = {
            torsoTopWidth: { min: 16, max: 32 },
            torsoBottomWidth: { min: 12, max: 28 },
            torsoHeight: { min: 24, max: 36 },
            torsoY: { min: 16, max: 24 },
            neckWidth: { min: 4, max: 10 },
            neckHeight: { min: 4, max: 12 },
            headWidth: { min: 12, max: 24 },
            headHeight: { min: 12, max: 24 },
            upperArmTopWidth: { min: 4, max: 12 },
            upperArmBottomWidth: { min: 3, max: 10 },
            upperArmLength: { min: 16, max: 28 },
            forearmTopWidth: { min: 3, max: 10 },
            forearmBottomWidth: { min: 2, max: 8 },
            forearmLength: { min: 16, max: 28 },
            armAngle: { min: -80, max: -10 },
            elbowAngle: { min: -70, max: 70 },
            thighTopWidth: { min: 6, max: 16 },
            thighBottomWidth: { min: 4, max: 12 },
            thighLength: { min: 16, max: 28 },
            shinTopWidth: { min: 4, max: 12 },
            shinBottomWidth: { min: 3, max: 10 },
            shinLength: { min: 20, max: 32 },
            legAngle: { min: -25, max: 0 },
            fillDensity: { min: 0.7, max: 1.0 }
        };

        switch (preset) {
            case 'short':
                return {
                    ...baseRanges,
                    torsoHeight: { min: 24, max: 30 },
                    torsoY: { min: 24, max: 32 },
                    thighLength: { min: 12, max: 20 },
                    shinLength: { min: 16, max: 24 }
                };

            case 'tall':
                return {
                    ...baseRanges,
                    torsoHeight: { min: 32, max: 44 },
                    torsoY: { min: 12, max: 20 },
                    thighLength: { min: 24, max: 36 },
                    shinLength: { min: 28, max: 40 },
                    upperArmLength: { min: 24, max: 36 },
                    forearmLength: { min: 24, max: 36 }
                };

            case 'thin':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 12, max: 20 },
                    torsoBottomWidth: { min: 10, max: 18 },
                    upperArmTopWidth: { min: 3, max: 6 },
                    forearmTopWidth: { min: 2, max: 5 },
                    thighTopWidth: { min: 4, max: 8 },
                    shinTopWidth: { min: 3, max: 6 }
                };

            case 'bulky':
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 24, max: 36 },
                    torsoBottomWidth: { min: 20, max: 32 },
                    upperArmTopWidth: { min: 8, max: 16 },
                    forearmTopWidth: { min: 6, max: 12 },
                    thighTopWidth: { min: 10, max: 20 },
                    shinTopWidth: { min: 8, max: 16 },
                    headWidth: { min: 16, max: 28 }
                };

            case 'standard':
            default:
                return baseRanges;
        }
    }

    // scaleParams is now handled by the base CharacterGenerator

    generateBodyParts(params) {
        const parts = {};

        // Convert percentage-based params to pixels
        const scale = this.canvasSize / 100;
        const scaledParams = this.scaleParams(params, scale);

        // 1. TORSO (anchor)
        const torsoTop = scaledParams.torsoY;
        const torsoBottom = torsoTop + scaledParams.torsoHeight;
        parts.torso = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.torsoTopWidth, scaledParams.torsoBottomWidth,
            scaledParams.torsoHeight,
            0
        );

        // 2. NECK
        parts.neck = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.neckWidth, scaledParams.neckWidth,
            -scaledParams.neckHeight,
            0
        );

        // 3. HEAD
        parts.head = createTrapezoid(
            this.centerX, torsoTop - scaledParams.neckHeight,
            scaledParams.headWidth, scaledParams.headWidth,
            -scaledParams.headHeight,
            0
        );

        // Symmetrical by default (mirrored)
        const leftShoulderAngle = scaledParams.armAngle;
        const leftForearmAngle = scaledParams.armAngle + scaledParams.elbowAngle;

        const rightShoulderAngle = -scaledParams.armAngle;
        const rightForearmAngle = -scaledParams.armAngle - scaledParams.elbowAngle;


        // 4. LEFT ARM
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

        // 5. RIGHT ARM
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

        // 6. LEFT LEG
        const leftHipX = this.centerX - scaledParams.torsoBottomWidth / 2;

        parts.leftThigh = createTrapezoid(
            leftHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            scaledParams.legAngle
        );

        const thighEnd = getTrapezoidBottom(parts.leftThigh);
        const remainingShinLength = this.groundY - thighEnd.y;

        parts.leftShin = createTrapezoid(
            thighEnd.x, thighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            remainingShinLength,
            0
        );

        // 7. RIGHT LEG
        const rightHipX = this.centerX + scaledParams.torsoBottomWidth / 2;

        parts.rightThigh = createTrapezoid(
            rightHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            -scaledParams.legAngle
        );

        const rightThighEnd = getTrapezoidBottom(parts.rightThigh);
        const rightRemainingShinLength = this.groundY - rightThighEnd.y;

        parts.rightShin = createTrapezoid(
            rightThighEnd.x, rightThighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            rightRemainingShinLength,
            0
        );

        // 8. JOINTS (circles at articulation points)
        parts.leftElbow = createJoint(parts.leftUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.rightElbow = createJoint(parts.rightUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.leftKnee = createJoint(parts.leftThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.rightKnee = createJoint(parts.rightThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.leftShoulder = createJoint(parts.leftUpperArm.center, scaledParams.upperArmTopWidth / 2);
        parts.rightShoulder = createJoint(parts.rightUpperArm.center, scaledParams.upperArmTopWidth / 2);

        // 9. HANDS (small trapezoids at forearm ends)
        const leftHandStart = parts.leftForearm.bottomCenter;
        const leftHandAngle = leftForearmAngle;
        parts.leftHand = createTrapezoid(
            leftHandStart.x, leftHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            leftHandAngle
        );

        const rightHandStart = parts.rightForearm.bottomCenter;
        const rightHandAngle = rightForearmAngle;
        parts.rightHand = createTrapezoid(
            rightHandStart.x, rightHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            rightHandAngle
        );

        // 10. FEET (small trapezoids at shin ends)
        const leftFootStart = parts.leftShin.bottomCenter;
        parts.leftFoot = createTrapezoid(
            leftFootStart.x, leftFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        const rightFootStart = parts.rightShin.bottomCenter;
        parts.rightFoot = createTrapezoid(
            rightFootStart.x, rightFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        return parts;
    }

    // Override animation to keep face consistent across frames with head bobbing
    generateAnimationFrames(params) {
        const frames = [];
        const variations = [-0.05, 0, 0.05];
        const headBobbing = [1, 0, -1];  // Head vertical offset for each frame

        // Generate first frame and extract face region
        let facePixels = null;
        let headBounds = null;

        variations.forEach((variation, index) => {
            const frameParams = { ...params };

            // Note: All size params are in percentage of canvas (0-100)
            if (frameParams.torsoHeight) {
                frameParams.torsoHeight = frameParams.torsoHeight * (1 + variation);
            }

            // Add arm angle variation for breathing effect
            if (frameParams.armAngle) {
                frameParams.armAngle = frameParams.armAngle * (1 + variation * 2);
            }

            // Generate frame
            const char = this.generate(frameParams);

            // Extract face region from first frame
            if (index === 0) {
                const bodyParts = char.bodyParts;
                const head = bodyParts.head;

                if (head && head.points) {
                    // Calculate head bounding box
                    const xs = head.points.map(p => p.x);
                    const ys = head.points.map(p => p.y);
                    headBounds = {
                        minX: Math.floor(Math.min(...xs)),
                        maxX: Math.ceil(Math.max(...xs)),
                        minY: Math.floor(Math.min(...ys)),
                        maxY: Math.ceil(Math.max(...ys))
                    };

                    // Copy face pixels from first frame
                    facePixels = [];
                    for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
                        facePixels[y] = [];
                        for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                            if (y >= 0 && y < this.canvasSize && x >= 0 && x < this.canvasSize) {
                                facePixels[y][x] = char.pixels[y][x] ? { ...char.pixels[y][x] } : null;
                            }
                        }
                    }
                }
            } else if (facePixels && headBounds) {
                // Apply head bobbing: shift face pixels vertically
                const yOffset = headBobbing[index];

                for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
                    for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                        const targetY = y + yOffset;
                        if (targetY >= 0 && targetY < this.canvasSize && x >= 0 && x < this.canvasSize) {
                            if (facePixels[y] && facePixels[y][x] !== undefined) {
                                char.pixels[targetY][x] = facePixels[y][x] ? { ...facePixels[y][x] } : null;
                            }
                        }
                    }
                }
            }

            frames.push(char.pixels);
        });

        return frames;
    }

    // generateHeatmap is now handled by the base CharacterGenerator
    // fillHeatmapForCircle is now handled by the base CharacterGenerator
    // fillHeatmapForTrapezoid is now handled by the base CharacterGenerator
    // generatePixels is now handled by the base CharacterGenerator
    // removeIsolatedPixels is now handled by the base CharacterGenerator
    // applySmoothing is now handled by the base CharacterGenerator
    // applyOutline is now handled by the base CharacterGenerator
    // getMostCommonColor is now handled by the base CharacterGenerator
}
