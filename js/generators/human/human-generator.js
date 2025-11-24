import { CharacterGenerator } from '../../core/generator.js';
import { HUMAN_PALETTES } from '../../data/human-palettes.js';
import { randomFloat } from '../../utils/random.js';

export class HumanGenerator extends CharacterGenerator {
    constructor(canvasSize = 50) {
        super(canvasSize);
    }

    // Override to use human palettes
    randomParamsInRange(preset = 'standard') {
        const params = super.randomParamsInRange(preset);

        // Override palette with a human one
        const paletteIndex = Math.floor(Math.random() * HUMAN_PALETTES.length);
        params.palette = [...HUMAN_PALETTES[paletteIndex]];

        return params;
    }

    // Override to enforce human proportions
    getParamRanges(preset) {
        const baseRanges = {
            // Torso: More standard, less extreme variation
            torsoTopWidth: { min: 20, max: 28 },
            torsoBottomWidth: { min: 16, max: 24 },
            torsoHeight: { min: 28, max: 34 },
            torsoY: { min: 18, max: 22 },

            // Neck: Standard human neck
            neckWidth: { min: 6, max: 8 },
            neckHeight: { min: 4, max: 8 },

            // Head: Proportional to body
            headWidth: { min: 14, max: 18 },
            headHeight: { min: 16, max: 20 },

            // Arms: Standard length
            upperArmTopWidth: { min: 6, max: 9 },
            upperArmBottomWidth: { min: 5, max: 7 },
            upperArmLength: { min: 20, max: 26 },
            forearmTopWidth: { min: 5, max: 7 },
            forearmBottomWidth: { min: 4, max: 6 },
            forearmLength: { min: 20, max: 26 },
            armAngle: { min: -70, max: -20 },
            elbowAngle: { min: -10, max: 45 }, // Natural bend

            // Legs: Standard length
            thighTopWidth: { min: 9, max: 14 },
            thighBottomWidth: { min: 7, max: 11 },
            thighLength: { min: 22, max: 30 },
            shinTopWidth: { min: 7, max: 11 },
            shinBottomWidth: { min: 5, max: 8 },
            shinLength: { min: 24, max: 32 },
            legAngle: { min: -15, max: -5 }, // Slight stance

            // Generation
            fillDensity: { min: 0.9, max: 1.0 } // Solid fill for humans
        };

        // Adjustments for presets if needed, but keeping it simple for now
        // We can just return baseRanges for 'standard' and tweak others if requested
        return baseRanges;
    }
}
