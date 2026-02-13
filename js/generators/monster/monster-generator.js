import { CharacterGenerator } from '../../core/generator.js';
import { MONSTER_PALETTES } from '../../data/monster-palettes.js';
import { MonsterNameGenerator } from './monster-names.js';
import { BODY_PROPORTIONS } from '../../config.js';
import { SeededRandom } from '../../utils/random.js';

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
        characterData.name = this.nameGenerator.generate();
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

}
