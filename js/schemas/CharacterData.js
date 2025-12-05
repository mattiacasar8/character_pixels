/**
 * @typedef {Object} CharacterData
 * @property {string} id - Unique UUID
 * @property {number} version - Schema version (e.g. 2)
 * @property {number} timestamp - Creation timestamp
 * @property {string} name - Character Name
 * @property {string} backstory - Character Backstory
 * @property {CharacterVisuals} visuals - Deterministic visual parameters
 * @property {CharacterMetadata} metadata - Generation metadata
 */

/**
 * @typedef {Object} CharacterVisuals
 * @property {number} [torsoTopWidth] - Percentage
 * @property {number} [torsoBottomWidth] - Percentage
 * @property {number} [torsoHeight] - Percentage
 * @property {number} [torsoY] - Percentage or null
 * @property {number} [neckWidth] - Percentage
 * @property {number} [neckHeight] - Percentage
 * @property {number} [headWidth] - Percentage
 * @property {number} [headHeight] - Percentage
 * @property {number} [upperArmTopWidth] - Percentage
 * @property {number} [upperArmBottomWidth] - Percentage
 * @property {number} [upperArmLength] - Percentage
 * @property {number} [forearmTopWidth] - Percentage
 * @property {number} [forearmBottomWidth] - Percentage
 * @property {number} [forearmLength] - Percentage
 * @property {number} [armAngle] - Degrees
 * @property {number} [elbowAngle] - Degrees
 * @property {number} [thighTopWidth] - Percentage
 * @property {number} [thighBottomWidth] - Percentage
 * @property {number} [thighLength] - Percentage
 * @property {number} [shinTopWidth] - Percentage
 * @property {number} [shinBottomWidth] - Percentage
 * @property {number} [shinLength] - Percentage
 * @property {number} [legAngle] - Degrees
 * @property {number} [fillDensity] - 0.0 to 1.0
 * @property {string[]} palette - Array of hex colors
 * @property {Object} [humanColors] - Specific color assignments (Human only)
 * @property {string} [humanColors.skin]
 * @property {string} [humanColors.shirt]
 * @property {string} [humanColors.pants]
 * @property {string} [humanColors.hair]
 * @property {string} [humanColors.eyes]
 * @property {string} [humanColors.mouth]
 */

/**
 * @typedef {Object} CharacterMetadata
 * @property {number} seed - Original generation seed
 * @property {string} preset - Preset name (standard, athletic, etc.)
 * @property {'human'|'monster'} type - Character type
 * @property {'batch'|'single'} mode - Creation mode
 */


export const CharacterSchema = {
    version: 2,
    create: (id, type, preset, seed) => ({
        id,
        version: 2,
        timestamp: Date.now(),
        name: '',
        backstory: '',
        visuals: {},
        metadata: {
            seed,
            preset,
            type,
            mode: 'batch'
        }
    })
};
