/**
 * UIManager
 * Handles all UI setup: sliders, checkboxes, buttons, presets, and generator type selection.
 */
import { PARAM_CONFIG } from '../config.js';

export class UIManager {
    constructor(app) {
        this.app = app;
    }

    setup() {
        // Order matters: sliders must be created before presets are applied
        this.setupSliders();        // Create sliders first
        this.setupGeneratorType();  // This applies presets to sliders
        this.setupCheckboxes();
        this.setupBatchOptions();
        this.setupButtons();
    }

    setupGeneratorType() {
        const selector = document.getElementById('generatorType');
        const presetSelector = document.getElementById('bodyPreset');

        const updatePresets = () => {
            const type = selector.value;
            presetSelector.innerHTML = '';

            let options = [{ value: 'standard', text: 'Standard' }];

            if (type === 'monster') {
                options.push(
                    { value: 'short', text: 'Short & Sturdy' },
                    { value: 'tall', text: 'Tall & Lanky' },
                    { value: 'thin', text: 'Thin / Skeleton' },
                    { value: 'bulky', text: 'Bulky / Ogre' }
                );
            } else if (type === 'human') {
                options.push(
                    { value: 'athletic', text: 'Athletic' },
                    { value: 'slim', text: 'Slim' },
                    { value: 'stocky', text: 'Stocky' },
                    { value: 'tall', text: 'Tall' }
                );
            }

            options.push({ value: 'max', text: 'Max Range (Chaos)' });

            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.value;
                el.textContent = opt.text;
                presetSelector.appendChild(el);
            });

            presetSelector.value = 'standard';
            this.app.batchOptions.preset = 'standard';
            this.applyPresetToSliders('standard');
        };

        updatePresets();

        selector.addEventListener('change', () => {
            updatePresets();
            this.app.generateCharacters(this.app.characters.length || 1);
        });
    }

    setupSliders() {
        // Canvas size slider
        const canvasSizeSlider = document.getElementById('canvasSize');
        const canvasSizeValue = document.getElementById('canvasSizeValue');

        canvasSizeSlider.addEventListener('input', (e) => {
            const newSize = parseInt(e.target.value);
            canvasSizeValue.textContent = newSize;
            this.app.updateCanvasSize(newSize);
        });

        // Initialize noUiSlider for all parameters
        Object.keys(PARAM_CONFIG).forEach(paramKey => {
            const cfg = PARAM_CONFIG[paramKey];
            const sliderElement = document.getElementById(`slider-${paramKey}`);
            const display = document.getElementById(`${paramKey}Display`);

            if (!sliderElement || !display) return;

            const defaultMin = cfg.safeMin + (cfg.safeMax - cfg.safeMin) * 0.2;
            const defaultMax = cfg.safeMin + (cfg.safeMax - cfg.safeMin) * 0.8;

            noUiSlider.create(sliderElement, {
                start: [defaultMin, defaultMax],
                connect: true,
                step: cfg.step,
                range: {
                    'min': cfg.hardMin,
                    'max': cfg.hardMax
                }
            });

            sliderElement.noUiSlider.on('update', (values) => {
                const vMin = parseFloat(values[0]);
                const vMax = parseFloat(values[1]);

                if (paramKey === 'fillDensity') {
                    display.textContent = `${vMin.toFixed(2)} - ${vMax.toFixed(2)}`;
                } else if (paramKey.includes('Angle')) {
                    display.textContent = `${Math.round(vMin)} to ${Math.round(vMax)}${cfg.suffix}`;
                } else {
                    display.textContent = `${Math.round(vMin)} - ${Math.round(vMax)}${cfg.suffix}`;
                }
            });

            sliderElement.noUiSlider.on('change', () => {
                this.app.currentParams = this.getParamsFromUI();
                this.app.regenerateCurrentCharacters();
            });
        });
    }

    setupCheckboxes() {
        const displayCheckboxes = ['showStickFigure', 'showThickness', 'showHeatmap', 'showFinal', 'showGrid'];

        displayCheckboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.app.displayOptions = this.getDisplayOptions();
                this.app.redrawCharacters();
            });
        });

        // Effects checkboxes that require reprocessing
        const reprocessingCheckboxes = ['enableSmoothing', 'enableLighting', 'showOutline'];

        reprocessingCheckboxes.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.app.currentParams = this.getParamsFromUI();
                    this.app.reprocessCurrentCharacters();
                });
            }
        });

        const outlineColor = document.getElementById('outlineColor');
        if (outlineColor) {
            outlineColor.addEventListener('input', () => {
                this.app.currentParams = this.getParamsFromUI();
                this.app.reprocessCurrentCharacters();
            });
        }

        const lightDirection = document.getElementById('lightDirection');
        if (lightDirection) {
            lightDirection.addEventListener('change', () => {
                this.app.currentParams = this.getParamsFromUI();
                this.app.reprocessCurrentCharacters();
            });
        }
    }

    setupBatchOptions() {
        const bodyPreset = document.getElementById('bodyPreset');

        bodyPreset.addEventListener('change', (e) => {
            const preset = e.target.value;
            this.app.batchOptions.preset = preset;
            this.applyPresetToSliders(preset);
        });
    }

    setupButtons() {
        document.getElementById('generateOne').addEventListener('click', () => {
            this.app.generateCharacters(1);
        });

        document.getElementById('generateTen').addEventListener('click', () => {
            this.app.generateCharacters(10);
        });

        document.getElementById('generateHundred').addEventListener('click', () => {
            this.app.generateCharacters(100);
        });

        document.getElementById('randomize').addEventListener('click', () => {
            this.randomizeSliders();
        });

        document.getElementById('exportSpritesheet').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.app.exportManager.exportSpritesheet();
        });

        document.getElementById('exportZip').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.app.exportManager.exportZip();
        });
    }

    applyPresetToSliders(preset) {
        let ranges;

        if (preset === 'max') {
            Object.keys(PARAM_CONFIG).forEach(paramKey => {
                const slider = document.getElementById(`slider-${paramKey}`);
                if (!slider || !slider.noUiSlider) return;

                const cfg = PARAM_CONFIG[paramKey];
                slider.noUiSlider.set([cfg.safeMin, cfg.safeMax]);
            });
            return;
        } else {
            ranges = this.app.currentGenerator.getParamRanges(preset);
        }

        Object.keys(ranges).forEach(paramKey => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) return;

            const range = ranges[paramKey];
            slider.noUiSlider.set([range.min, range.max]);
        });

        this.app.currentParams = this.getParamsFromUI();
        this.app.regenerateCurrentCharacters();
    }

    randomizeSliders() {
        const randomParams = this.app.currentGenerator.randomParams();

        const createRange = (value, paramKey) => {
            const cfg = PARAM_CONFIG[paramKey];
            const variance = paramKey.includes('Angle') ? 10 : (value * 0.15);
            const rangeMin = Math.max(value - variance, cfg.hardMin);
            const rangeMax = Math.min(value + variance, cfg.hardMax);
            return { min: rangeMin, max: rangeMax };
        };

        Object.keys(PARAM_CONFIG).forEach(paramKey => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) return;

            const value = randomParams[paramKey];
            const range = createRange(value, paramKey);
            slider.noUiSlider.set([range.min, range.max]);
        });

        this.app.currentParams = this.getParamsFromUI();
        this.app.regenerateCurrentCharacters();
    }

    getParamsFromUI() {
        const getRange = (paramKey) => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) {
                const cfg = PARAM_CONFIG[paramKey];
                return { min: cfg.safeMin, max: cfg.safeMax };
            }
            const values = slider.noUiSlider.get();
            return {
                min: parseFloat(values[0]),
                max: parseFloat(values[1])
            };
        };

        return {
            torsoTopWidth: getRange('torsoTopWidth'),
            torsoBottomWidth: getRange('torsoBottomWidth'),
            torsoHeight: getRange('torsoHeight'),
            torsoY: 20,

            neckWidth: getRange('neckWidth'),
            neckHeight: getRange('neckHeight'),
            headWidth: getRange('headWidth'),

            upperArmTopWidth: getRange('upperArmTopWidth'),
            forearmTopWidth: getRange('forearmTopWidth'),
            upperArmLength: getRange('upperArmLength'),
            armAngle: getRange('armAngle'),
            elbowAngle: getRange('elbowAngle'),

            thighTopWidth: getRange('thighTopWidth'),
            shinTopWidth: getRange('shinTopWidth'),
            thighLength: getRange('thighLength'),
            legAngle: getRange('legAngle'),

            fillDensity: getRange('fillDensity'),

            // Effects
            enableSmoothing: document.getElementById('enableSmoothing').checked,
            enableLighting: document.getElementById('enableLighting').checked,
            lightDirection: document.getElementById('lightDirection').value,
            showOutline: document.getElementById('showOutline').checked,
            outlineColor: document.getElementById('outlineColor').value
        };
    }

    getDisplayOptions() {
        return {
            showStickFigure: document.getElementById('showStickFigure').checked,
            showThickness: document.getElementById('showThickness').checked,
            showHeatmap: document.getElementById('showHeatmap').checked,
            showFinal: document.getElementById('showFinal').checked,
            showGrid: document.getElementById('showGrid').checked
        };
    }
}
