import { CharacterGenerator } from '../../core/generator.js';
import { MONSTER_PALETTES } from '../../data/monster-palettes.js';
import { nameGenerator } from '../name-generator.js';
import { BODY_PROPORTIONS } from '../../config.js';
import { SeededRandom } from '../../utils/random.js';

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

    // Override animation to keep face consistent across frames with head bobbing
    generateAnimationFrames(params) {
        const frames = [];
        const variations = [-0.05, 0, 0.05];
        const headBobbing = [1, 0, -1];

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
