/**
 * Processor Manager
 * Central hub for all post-processing effects.
 * Manages processor registration, ordering, and application.
 */

import { SmoothingProcessor } from './SmoothingProcessor.js';
import { OutlineProcessor } from './OutlineProcessor.js';
import { LightingProcessor } from './LightingProcessor.js';

export class ProcessorManager {
    constructor() {
        // Processors in order of application
        // Order matters: smoothing fills gaps, lighting adds shading, outline goes last
        this.processors = [
            SmoothingProcessor,
            LightingProcessor,
            OutlineProcessor
        ];
    }

    /**
     * Get all registered processors
     * @returns {Array} List of processor classes
     */
    getProcessors() {
        return this.processors;
    }

    /**
     * Get UI configurations for all processors
     * @returns {Array} List of UI config objects
     */
    getUIConfigs() {
        return this.processors.map(p => p.getUIConfig());
    }

    /**
     * Apply all enabled processors to pixel grid
     * @param {Array<Array>} pixels - 2D pixel array
     * @param {Object} params - Parameters including effect enable flags
     * @param {number} canvasSize - Size of the canvas
     * @returns {Array<Array>} Processed pixel array
     */
    applyAll(pixels, params, canvasSize) {
        let result = pixels;

        // Debug: Count filled pixels initially
        let initialFilled = 0;
        result.forEach(row => row.forEach(p => { if (p) initialFilled++; }));
        console.log(`ProcessorManager starting. Filled pixels: ${initialFilled}`, params.effects);

        this.processors.forEach(processor => {
            // Check if processor is enabled in params
            const config = processor.getUIConfig();
            const isEnabled = params.effects
                ? params.effects[config.id] !== false
                : params[config.id] !== false; // Fallback for old params

            // Special case for lighting which might be missing in default effects
            // (handled by defaults in individual processors usually, but check here)

            if (isEnabled) {
                // Pre-process count
                let preCount = 0;
                result.forEach(row => row.forEach(p => { if (p) preCount++; }));
                console.log(`Applying ${processor.name}... (Px: ${preCount})`);

                result = processor.apply(result, params, canvasSize);

                let postCount = 0;
                result.forEach(row => row.forEach(p => { if (p) postCount++; }));
                console.log(`Applied ${processor.name}. (Px: ${postCount})`);
            }
        });

        return result;
    }

    /**
     * Get default effect settings
     * @returns {Object} Default effect toggles
     */
    static getDefaultEffects() {
        return {
            smoothing: SmoothingProcessor.defaultEnabled,
            lighting: LightingProcessor.defaultEnabled,
            outline: OutlineProcessor.defaultEnabled,
            outlineColor: OutlineProcessor.defaultColor
        };
    }
}

// Export singleton for convenience
export const processorManager = new ProcessorManager();

// Re-export individual processors
export { SmoothingProcessor, OutlineProcessor, LightingProcessor };
