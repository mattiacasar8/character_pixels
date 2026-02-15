/**
 * SingleModeController
 * Dedicated controller for Single Character Mode editing.
 * Manages editing state, parameter updates, and character regeneration.
 */

import { SKIN_TONES, CLOTHING_COLORS, HAIR_COLORS, EYE_COLORS } from '../data/human-palettes.js';
import { MONSTER_PALETTES } from '../data/monster-palettes.js';

export class SingleModeController {
    constructor(app) {
        this.app = app;
        this.originalCharacter = null;  // Snapshot for reset
        this.workingParams = null;      // Current editing state
        this.isActive = false;
    }

    /**
     * Enter single mode editing for a character
     * @param {Object} character - The character to edit
     */
    enter(character) {
        // Deep copy for reset functionality
        this.originalCharacter = JSON.parse(JSON.stringify(character));
        this.workingParams = JSON.parse(JSON.stringify(character.params));
        this.isActive = true;
    }

    /**
     * Update a single body parameter
     * @param {string} key - Parameter name (e.g., 'torsoHeight')
     * @param {number} value - New value
     */
    updateParam(key, value) {
        if (!this.isActive) return;

        this.workingParams[key] = value;
        this.regeneratePreview();
    }

    /**
     * Update a color for human characters
     * @param {string} category - 'skin', 'shirt', 'pants', or 'hair'
     * @param {Object} colorObj - {r, g, b} color object
     */
    updateColor(category, colorObj) {
        if (!this.isActive) return;

        if (this.workingParams.humanColors) {
            this.workingParams.humanColors[category] = colorObj;
            // Also update the palette array for rendering
            this.workingParams.palette = [
                this.workingParams.humanColors.skin,
                this.workingParams.humanColors.shirt,
                this.workingParams.humanColors.pants,
                this.workingParams.humanColors.hair
            ];
        }
        this.regeneratePreview();
    }

    /**
     * Update monster palette
     * @param {number} paletteIndex - Index into MONSTER_PALETTES
     */
    updateMonsterPalette(paletteIndex) {
        if (!this.isActive) return;

        if (paletteIndex >= 0 && paletteIndex < MONSTER_PALETTES.length) {
            this.workingParams.palette = [...MONSTER_PALETTES[paletteIndex]];
            this.regeneratePreview();
        }
    }

    /**
     * Update clothing pattern
     * @param {string} type - 'shirt' or 'pants'
     * @param {string} pattern - Pattern name
     */
    updatePattern(type, pattern) {
        if (!this.isActive) return;

        if (!this.workingParams.clothingOverrides) {
            this.workingParams.clothingOverrides = {};
        }
        this.workingParams.clothingOverrides[type] = pattern;
        this.regeneratePreview();
    }

    /**
     * Update character name
     * @param {string} newName - New name
     */
    updateName(newName) {
        if (!this.isActive || !this.app.singleModeCharacter) return;

        const oldName = this.app.singleModeCharacter.name;
        this.app.singleModeCharacter.name = newName;

        // Sync name in backstory (replace old name with new)
        if (this.app.singleModeCharacter.backstory && oldName && newName) {
            // Case-insensitive replace of old name
            const regex = new RegExp(this.escapeRegex(oldName), 'gi');
            this.app.singleModeCharacter.backstory =
                this.app.singleModeCharacter.backstory.replace(regex, newName);
            this.app.uiManager.updateSingleModeBackstoryDisplay(
                this.app.singleModeCharacter.backstory
            );
        }

        // Update display without full regeneration
        this.app.uiManager.updateSingleModeNameDisplay(newName);
        // Also update main view
        this.app.renderSingleCharacterView(this.app.singleModeCharacter);
    }

    /**
     * Escape regex special characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Regenerate backstory for the character
     * @param {string|null} patternKey - Optional pattern key (patternA-F)
     */
    regenerateBackstory(patternKey = null) {
        if (!this.isActive || !this.app.singleModeCharacter) return;

        const backstoryGen = this.app.currentBackstoryGenerator;
        const newBackstory = backstoryGen.generate(
            this.app.singleModeCharacter.name,
            patternKey || null
        );
        this.app.singleModeCharacter.backstory = newBackstory;
        this.app.uiManager.updateSingleModeBackstoryDisplay(newBackstory);
        // Also update main view
        this.app.renderSingleCharacterView(this.app.singleModeCharacter);
    }

    /**
     * Update a face property (hair style, expression)
     * @param {string} prop - 'hairStyle' or 'mouthState'
     * @param {number} value - 0-1 value for the property
     */
    updateFaceProperty(prop, value) {
        if (!this.isActive) return;

        if (!this.workingParams.faceOverrides) {
            this.workingParams.faceOverrides = {};
        }
        this.workingParams.faceOverrides[prop] = parseFloat(value);
        this.regeneratePreview();
    }

    /**
     * Regenerate the character preview with current working params
     */
    regeneratePreview() {
        if (!this.isActive || !this.app.singleModeCharacter) return;

        const charType = this.app.singleModeCharacter.type;
        const generator = charType === 'human' ? this.app.humanGenerator : this.app.monsterGenerator;

        // Merge working params with current effect settings
        const mergedParams = {
            ...this.workingParams,
            effects: {
                smoothing: this.app.currentParams?.effects?.smoothing !== false,
                lighting: this.app.currentParams?.effects?.lighting !== false,
                outline: this.app.currentParams?.effects?.outline || false,
            },
            lightDirection: this.app.currentParams?.lightDirection || 'top-right',
            outlineColor: this.app.currentParams?.outlineColor || '#2a2a2a'
        };

        // Generate new character data with working params
        const newCharData = generator.generate(mergedParams);

        // Generate animation frames
        newCharData.animationFrames = generator.generateAnimationFrames(mergedParams);

        // Preserve identity
        newCharData.name = this.app.singleModeCharacter.name;
        newCharData.backstory = this.app.singleModeCharacter.backstory;
        newCharData.type = charType;

        // Update the character in place
        this.app.singleModeCharacter.pixels = newCharData.pixels;
        this.app.singleModeCharacter.frames = newCharData.frames;
        this.app.singleModeCharacter.animationFrames = newCharData.animationFrames;
        this.app.singleModeCharacter.bodyParts = newCharData.bodyParts;
        this.app.singleModeCharacter.params = { ...mergedParams };

        // Update workingParams to keep in sync
        this.workingParams = { ...mergedParams };

        // Re-render
        this.app.renderSingleCharacterView(this.app.singleModeCharacter);
    }

    /**
     * Reset character to original state
     */
    reset() {
        if (!this.isActive || !this.originalCharacter) return;

        // Restore working params
        this.workingParams = JSON.parse(JSON.stringify(this.originalCharacter.params));

        // Restore character
        Object.assign(this.app.singleModeCharacter, this.originalCharacter);

        // Re-render and update UI
        this.app.renderSingleCharacterView(this.app.singleModeCharacter);
        this.app.uiManager.populateSingleModeControls(this.app.singleModeCharacter);
    }

    /**
     * Confirm changes and prepare to exit
     */
    confirm() {
        // Changes are already applied to the character
        // Just update the character in the main array if needed
        const index = this.app.characters.indexOf(this.app.singleModeCharacter);
        if (index !== -1) {
            this.app.characters[index] = this.app.singleModeCharacter;
        }
    }

    /**
     * Exit single mode
     */
    exit() {
        this.originalCharacter = null;
        this.workingParams = null;
        this.isActive = false;
    }

    /**
     * Get available color palettes based on character type
     * @returns {Object} Palette options for UI
     */
    getColorPalettes() {
        const type = this.app.singleModeCharacter?.type || 'human';

        if (type === 'human') {
            return {
                skin: SKIN_TONES,
                shirt: CLOTHING_COLORS,
                pants: CLOTHING_COLORS,
                hair: HAIR_COLORS,
                eyes: EYE_COLORS
            };
        } else {
            return {
                palettes: MONSTER_PALETTES
            };
        }
    }

    /**
     * Get current working params
     * @returns {Object} Current params
     */
    getCurrentParams() {
        return this.workingParams;
    }
}
