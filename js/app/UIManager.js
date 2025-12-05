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
        const presetContainer = document.getElementById('presetButtons');

        const updatePresets = () => {
            const type = selector.value;
            presetContainer.innerHTML = '';

            let options = [{ value: 'standard', text: 'Standard' }];

            if (type === 'monster') {
                options.push(
                    { value: 'short', text: 'Short' },
                    { value: 'tall', text: 'Tall' },
                    { value: 'thin', text: 'Thin' },
                    { value: 'bulky', text: 'Bulky' }
                );
            } else if (type === 'human') {
                options.push(
                    { value: 'athletic', text: 'Athletic' },
                    { value: 'slim', text: 'Slim' },
                    { value: 'stocky', text: 'Stocky' },
                    { value: 'tall', text: 'Tall' }
                );
            }

            options.push({ value: 'max', text: 'Chaos' });

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.textContent = opt.text;
                btn.dataset.value = opt.value;
                // Add active class if selected
                if (this.app.batchOptions.preset === opt.value) {
                    btn.classList.add('active'); // You might need CSS for .active on buttons
                    // Or style it differently
                    btn.style.background = '#e0e0e0';
                    btn.style.color = '#000';
                }

                btn.addEventListener('click', () => {
                    // Reset styles
                    Array.from(presetContainer.children).forEach(b => {
                        b.style.background = '';
                        b.style.color = '';
                    });
                    // Set active
                    btn.style.background = '#e0e0e0';
                    btn.style.color = '#000';

                    this.app.batchOptions.preset = opt.value;
                    this.applyPresetToSliders(opt.value);
                });

                presetContainer.appendChild(btn);
            });

            // Set default if current preset is invalid for new type
            if (!options.find(o => o.value === this.app.batchOptions.preset)) {
                this.app.batchOptions.preset = 'standard';
                // Trigger click on first button to update UI
                if (presetContainer.firstChild) {
                    presetContainer.firstChild.click();
                }
            }
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

        if (canvasSizeSlider && canvasSizeValue) {
            canvasSizeSlider.addEventListener('input', (e) => {
                const newSize = parseInt(e.target.value);
                canvasSizeValue.textContent = newSize;
                this.app.updateCanvasSize(newSize);
            });
        }

        // Randomize Sliders Button
        const randomizeBtn = document.getElementById('randomizeSliders');
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => this.randomizeSliders());
        }

        // Generate sliders dynamically
        const batchContainer = document.getElementById('slidersContainer');
        const densityContainer = document.getElementById('densityControlContainer');

        if (batchContainer) batchContainer.innerHTML = '';
        if (densityContainer) densityContainer.innerHTML = '';

        Object.keys(PARAM_CONFIG).forEach(paramKey => {
            const cfg = PARAM_CONFIG[paramKey];

            // Determine target container
            let targetContainer = batchContainer;
            if (paramKey === 'fillDensity' && densityContainer) {
                targetContainer = densityContainer;
            }

            if (!targetContainer) return;

            // Create slider HTML structure
            const group = document.createElement('div');
            group.className = 'control-group';
            group.dataset.param = paramKey;

            const labelRow = document.createElement('div');
            labelRow.className = 'label-row';

            const label = document.createElement('label');
            label.textContent = cfg.label || paramKey;

            const display = document.createElement('span');
            display.id = `${paramKey}Display`;

            labelRow.appendChild(label);
            labelRow.appendChild(display);

            const sliderElement = document.createElement('div');
            sliderElement.id = `slider-${paramKey}`;
            sliderElement.className = 'swiss-slider';

            group.appendChild(labelRow);
            group.appendChild(sliderElement);
            targetContainer.appendChild(group);

            // Initialize noUiSlider
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
                    display.textContent = `${Math.round(vMin)} - ${Math.round(vMax)}${cfg.suffix || '°'}`;
                } else {
                    display.textContent = `${Math.round(vMin)} - ${Math.round(vMax)}${cfg.suffix || '%'}`;
                }
            });

            sliderElement.noUiSlider.on('change', () => {
                this.app.currentParams = this.getParamsFromUI();
                this.app.regenerateCurrentCharacters();
            });
        });
    }

    setupCheckboxes() {
        const displayCheckboxes = ['showStickFigure', 'showThickness', 'showHeatmap', 'showFinal', 'showGrid', 'showShapes', 'showAnalysis'];

        displayCheckboxes.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.app.displayOptions = this.getDisplayOptions();
                    this.app.redrawCharacters();
                });
            }
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
        // Presets are now handled in setupGeneratorType via buttons
    }

    setupButtons() {
        // Mode Toggles
        document.getElementById('mode-batch').addEventListener('click', () => this.switchMode('batch'));
        document.getElementById('mode-single').addEventListener('click', () => this.switchMode('single'));

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

    switchMode(mode) {
        // UI Updates
        const batchActions = document.getElementById('batch-actions');
        const singleControls = document.getElementById('single-controls');
        const batchBtn = document.getElementById('mode-batch');
        const singleBtn = document.getElementById('mode-single');

        if (mode === 'batch') {
            if (batchActions) batchActions.style.display = 'block';
            if (singleControls) singleControls.style.display = 'none';
            batchBtn.classList.add('active');
            singleBtn.classList.remove('active');
        } else {
            if (batchActions) batchActions.style.display = 'none';
            if (singleControls) singleControls.style.display = 'block';
            batchBtn.classList.remove('active');
            singleBtn.classList.add('active');
        }

        // Notify App
        // this.app.setMode(mode);
    }

    populateSingleModeControls(character) {
        const container = document.getElementById('singleParamsContainer');
        container.innerHTML = ''; // Clear previous

        const generator = character.type === 'monster' ? this.app.monsterGenerator : this.app.humanGenerator;

        // Header info
        const header = document.createElement('div');
        header.style.marginBottom = '20px';
        header.style.padding = '15px';
        header.style.background = '#1a1a1a';
        header.style.border = '1px solid #333';
        header.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                <h3 style="margin: 0; color: #fff; font-size:14px; text-transform:uppercase;">${character.name}</h3>
                <span style="font-size: 10px; color: #666; text-transform:uppercase; border:1px solid #444; padding:2px 4px;">${character.type || 'Unknown'}</span>
            </div>
            <div style="font-size: 11px; color: #888;">Seed: <span style="font-family:monospace; color:#aaa;">${character.params.seed}</span></div>
        `;
        container.appendChild(header);

        // CRITICAL: Generate animation frames so the renderer has current data
        // (Renderer might prefer animationFrames over static pixels)
        updatedChar.animationFrames = generator.generateAnimationFrames(newParams);

        // Restore non-geometric properties
        updatedChar.name = character.name;
        updatedChar.backstory = character.backstory;
        updatedChar.id = character.id;

        Object.assign(character, updatedChar);

        // Re-render
        this.app.renderCharacters();
    };

            sliderElement.noUiSlider.on('slide', onSliderChange);
            sliderElement.noUiSlider.on('change', onSliderChange); // Catch clicks on track
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
