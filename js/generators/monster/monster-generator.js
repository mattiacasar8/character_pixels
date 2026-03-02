import { CharacterGenerator } from '../../core/generator.js';
import { MONSTER_PALETTES } from '../../data/monster-palettes.js';
import { nameGenerator } from '../name-generator.js';
import { BODY_PROPORTIONS, ANIMATION } from '../../config.js';
import { SeededRandom } from '../../utils/random.js';
import { createTrapezoid, createJoint, getTrapezoidBottom } from '../../utils/math.js';

export class MonsterGenerator extends CharacterGenerator {
    constructor(canvasSize = 50) {
        super(canvasSize);
    }

    generate(params) {
        const characterData = super.generate(params);

        characterData.name = nameGenerator.generate('monster');
        characterData.type = 'monster';

        return characterData;
    }

    randomParamsInRange(preset = 'standard', existingSeed = null) {
        const seed = existingSeed !== null ? existingSeed : Math.floor(Math.random() * 2147483647);
        const params = super.randomParamsInRange(preset, seed);

        // Override palette with a monster one
        // Use seeded RNG for palette selection
        const rng = new SeededRandom(seed);
        const paletteIndex = rng.int(0, MONSTER_PALETTES.length - 1);
        params.palette = [...MONSTER_PALETTES[paletteIndex]];

        return params;
    }

    getParamRanges(preset) {
        // Use centralized body proportions from config
        const baseRanges = { ...BODY_PROPORTIONS.monster.base };

        if (preset && BODY_PROPORTIONS.monster.presets[preset]) {
            return {
                ...baseRanges,
                ...BODY_PROPORTIONS.monster.presets[preset]
            };
        }

        return baseRanges;
    }

    generateBodyParts(params) {
        // Get standard body parts from base class (2 arms, 2 legs)
        const parts = super.generateBodyParts(params);

        // Dedicated RNG for extra limb decisions (seed + 54321)
        const limbRng = new SeededRandom(params.seed + 54321);

        const scale = this.canvasSize / 100;
        const scaledParams = this.scaleParams(params, scale);
        const torsoTop = scaledParams.torsoY;
        const torsoBottom = torsoTop + scaledParams.torsoHeight;

        // 25% chance of 4 arms
        if (limbRng.next() < 0.25) {
            // Second pair anchored at mid-torso height
            const extraArmY = (torsoTop + torsoBottom) / 2;
            // Torso width at mid-height (interpolated)
            const midTorsoWidth = (scaledParams.torsoTopWidth + scaledParams.torsoBottomWidth) / 2;

            // Wider angle so the extra pair spreads outward more
            const extraArmAngle = scaledParams.armAngle * 1.4;
            const extraForearmAngle = extraArmAngle + scaledParams.elbowAngle;

            // Slightly smaller (85% scale) to differentiate from primary pair
            const armScale = 0.85;

            // Left extra arm
            const extraLeftShoulderX = this.centerX - midTorsoWidth / 2;
            parts.extraLeftUpperArm = createTrapezoid(
                extraLeftShoulderX, extraArmY,
                scaledParams.upperArmTopWidth * armScale,
                scaledParams.upperArmBottomWidth * armScale,
                scaledParams.upperArmLength * armScale,
                extraArmAngle
            );
            const extraUpperArmEnd = getTrapezoidBottom(parts.extraLeftUpperArm);
            parts.extraLeftForearm = createTrapezoid(
                extraUpperArmEnd.x, extraUpperArmEnd.y,
                scaledParams.forearmTopWidth * armScale,
                scaledParams.forearmBottomWidth * armScale,
                scaledParams.forearmLength * armScale,
                extraForearmAngle
            );
            const extraLeftHandStart = parts.extraLeftForearm.bottomCenter;
            parts.extraLeftHand = createTrapezoid(
                extraLeftHandStart.x, extraLeftHandStart.y,
                scaledParams.forearmBottomWidth * armScale * 1.2,
                scaledParams.forearmBottomWidth * armScale * 0.8,
                scaledParams.forearmBottomWidth * armScale * 1.5,
                extraForearmAngle
            );

            // Right extra arm
            const extraRightShoulderX = this.centerX + midTorsoWidth / 2;
            parts.extraRightUpperArm = createTrapezoid(
                extraRightShoulderX, extraArmY,
                scaledParams.upperArmTopWidth * armScale,
                scaledParams.upperArmBottomWidth * armScale,
                scaledParams.upperArmLength * armScale,
                -extraArmAngle
            );
            const extraRightUpperArmEnd = getTrapezoidBottom(parts.extraRightUpperArm);
            parts.extraRightForearm = createTrapezoid(
                extraRightUpperArmEnd.x, extraRightUpperArmEnd.y,
                scaledParams.forearmTopWidth * armScale,
                scaledParams.forearmBottomWidth * armScale,
                scaledParams.forearmLength * armScale,
                -extraForearmAngle
            );
            const extraRightHandStart = parts.extraRightForearm.bottomCenter;
            parts.extraRightHand = createTrapezoid(
                extraRightHandStart.x, extraRightHandStart.y,
                scaledParams.forearmBottomWidth * armScale * 1.2,
                scaledParams.forearmBottomWidth * armScale * 0.8,
                scaledParams.forearmBottomWidth * armScale * 1.5,
                -extraForearmAngle
            );

            // Joints for extra arms
            parts.extraLeftElbow = createJoint(
                parts.extraLeftUpperArm.bottomCenter,
                scaledParams.upperArmBottomWidth * armScale / 2
            );
            parts.extraRightElbow = createJoint(
                parts.extraRightUpperArm.bottomCenter,
                scaledParams.upperArmBottomWidth * armScale / 2
            );
        }

        // 15% chance of 4 legs
        if (limbRng.next() < 0.15) {
            // Inner pair - anchored closer to torso center
            const innerLeftHipX = this.centerX - scaledParams.torsoBottomWidth / 4;
            const innerRightHipX = this.centerX + scaledParams.torsoBottomWidth / 4;
            const legScale = 0.85;

            parts.extraLeftThigh = createTrapezoid(
                innerLeftHipX, torsoBottom,
                scaledParams.thighTopWidth * legScale,
                scaledParams.thighBottomWidth * legScale,
                scaledParams.thighLength,
                scaledParams.legAngle * 0.5 // Less splayed for inner pair
            );
            const extraThighEnd = getTrapezoidBottom(parts.extraLeftThigh);
            const extraShinLength = Math.max(1, this.groundY - extraThighEnd.y);
            parts.extraLeftShin = createTrapezoid(
                extraThighEnd.x, extraThighEnd.y,
                scaledParams.shinTopWidth * legScale,
                scaledParams.shinBottomWidth * legScale,
                extraShinLength,
                0
            );

            parts.extraRightThigh = createTrapezoid(
                innerRightHipX, torsoBottom,
                scaledParams.thighTopWidth * legScale,
                scaledParams.thighBottomWidth * legScale,
                scaledParams.thighLength,
                -scaledParams.legAngle * 0.5
            );
            const extraRightThighEnd = getTrapezoidBottom(parts.extraRightThigh);
            const extraRightShinLength = Math.max(1, this.groundY - extraRightThighEnd.y);
            parts.extraRightShin = createTrapezoid(
                extraRightThighEnd.x, extraRightThighEnd.y,
                scaledParams.shinTopWidth * legScale,
                scaledParams.shinBottomWidth * legScale,
                extraRightShinLength,
                0
            );

            // Joints for extra legs
            parts.extraLeftKnee = createJoint(
                parts.extraLeftThigh.bottomCenter,
                scaledParams.thighBottomWidth * legScale / 2
            );
            parts.extraRightKnee = createJoint(
                parts.extraRightThigh.bottomCenter,
                scaledParams.thighBottomWidth * legScale / 2
            );

            // Feet for extra legs
            const extraLeftFootStart = parts.extraLeftShin.bottomCenter;
            parts.extraLeftFoot = createTrapezoid(
                extraLeftFootStart.x, extraLeftFootStart.y,
                scaledParams.shinBottomWidth * legScale,
                scaledParams.shinBottomWidth * legScale * 1.2,
                scaledParams.shinBottomWidth * legScale * 0.8,
                90
            );
            const extraRightFootStart = parts.extraRightShin.bottomCenter;
            parts.extraRightFoot = createTrapezoid(
                extraRightFootStart.x, extraRightFootStart.y,
                scaledParams.shinBottomWidth * legScale,
                scaledParams.shinBottomWidth * legScale * 1.2,
                scaledParams.shinBottomWidth * legScale * 0.8,
                90
            );
        }

        return parts;
    }

    // Override animation to keep face consistent across frames with head bobbing
    generateAnimationFrames(params) {
        const frames = [];
        const variations = ANIMATION.baseVariations;
        const headBobbing = ANIMATION.headBobbing;

        let facePixels = null;
        let headBounds = null;

        variations.forEach((variation, index) => {
            const frameParams = { ...params };

            if (frameParams.torsoHeight) {
                frameParams.torsoHeight = frameParams.torsoHeight * (1 + variation);
            }
            if (frameParams.armAngle) {
                frameParams.armAngle = frameParams.armAngle * (1 + variation * 2);
            }

            const char = this.generate(frameParams);

            if (index === 0) {
                const extracted = this.extractFacePixels(char.pixels, char.bodyParts);
                if (extracted) {
                    facePixels = extracted.facePixels;
                    headBounds = extracted.headBounds;
                }
            } else if (facePixels && headBounds) {
                this.applyFacePixels(char.pixels, facePixels, headBounds, headBobbing[index]);
            }

            frames.push(char.pixels);
        });

        return frames;
    }

}
