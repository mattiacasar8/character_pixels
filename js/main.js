// Main App Entry Point
import { CharacterGenerator } from './core/generator.js';
import { CharacterRenderer } from './core/renderer.js';
import { BackstoryGenerator } from './backstory-generator.js';
import { PARAM_CONFIG } from './config.js';
import { nameGenerator } from './utils/name-generator.js';
import { generateRandomPalette } from './utils/random.js';

class App {
    constructor() {
        this.canvasSize = 50; // Default canvas size
        this.characterGenerator = new CharacterGenerator(this.canvasSize);
        this.characterRenderer = new CharacterRenderer(3, this.canvasSize);
        this.backstoryGenerator = new BackstoryGenerator();

        this.currentParams = this.getParamsFromUI();
        this.displayOptions = this.getDisplayOptions();
        this.batchOptions = {
            preset: 'standard'
        };
        this.characters = [];

        this.init();
    }

    init() {
        this.setupSliders();
        this.setupCheckboxes();
        this.setupBatchOptions();
        this.setupButtons();
        this.setupModal();
        this.generateCharacters(1);
    }

    setupModal() {
        // Create modal structure if it doesn't exist
        if (!document.getElementById('backstoryModal')) {
            const modal = document.createElement('div');
            modal.id = 'backstoryModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2 id="modalTitle">Character Name</h2>
                    <div id="modalBody" class="backstory-text"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close logic
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.onclick = () => modal.style.display = "none";
            window.onclick = (event) => {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        }
    }

    showBackstory(character) {
        const modal = document.getElementById('backstoryModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = character.name;
        body.textContent = character.backstory || "Nessuna storia disponibile.";

        modal.style.display = "block";
    }

    getParamsFromUI() {
        // Helper function to get range from noUiSlider
        const getRange = (paramKey) => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) {
                // Fallback to config defaults if slider not initialized
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
            torsoY: 20, // Fixed at 20% from top

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

            enableSmoothing: document.getElementById('enableSmoothing').checked,
            showOutline: document.getElementById('showOutline').checked
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

    setupSliders() {
        // Canvas size slider
        const canvasSizeSlider = document.getElementById('canvasSize');
        const canvasSizeValue = document.getElementById('canvasSizeValue');

        canvasSizeSlider.addEventListener('input', (e) => {
            const newSize = parseInt(e.target.value);
            canvasSizeValue.textContent = newSize;
            this.updateCanvasSize(newSize);
        });

        // Initialize noUiSlider for all parameters
        Object.keys(PARAM_CONFIG).forEach(paramKey => {
            const cfg = PARAM_CONFIG[paramKey];
            const sliderElement = document.getElementById(`slider-${paramKey}`);
            const display = document.getElementById(`${paramKey}Display`);

            if (!sliderElement || !display) return;

            // Calculate default start values (within safe range)
            const defaultMin = cfg.safeMin + (cfg.safeMax - cfg.safeMin) * 0.2;
            const defaultMax = cfg.safeMin + (cfg.safeMax - cfg.safeMin) * 0.8;

            // Create noUiSlider
            noUiSlider.create(sliderElement, {
                start: [defaultMin, defaultMax],
                connect: true,
                step: cfg.step,
                range: {
                    'min': cfg.hardMin,
                    'max': cfg.hardMax
                }
            });

            // Calculate safe zone visualization
            const safeStartPct = ((cfg.safeMin - cfg.hardMin) / (cfg.hardMax - cfg.hardMin)) * 100;
            const safeEndPct = ((cfg.safeMax - cfg.hardMin) / (cfg.hardMax - cfg.hardMin)) * 100;

            // Apply safe zone background gradient
            sliderElement.style.background = `linear-gradient(to right,
                #222 0%,
                #222 ${safeStartPct}%,
                #3a3a3a ${safeStartPct}%,
                #3a3a3a ${safeEndPct}%,
                #222 ${safeEndPct}%,
                #222 100%)`;

            // Update display on slider change
            sliderElement.noUiSlider.on('update', (values) => {
                const vMin = parseFloat(values[0]);
                const vMax = parseFloat(values[1]);

                // Format display based on parameter
                if (paramKey === 'fillDensity') {
                    display.textContent = `${vMin.toFixed(2)} - ${vMax.toFixed(2)}`;
                } else if (paramKey.includes('Angle')) {
                    display.textContent = `${Math.round(vMin)} to ${Math.round(vMax)}${cfg.suffix}`;
                } else {
                    display.textContent = `${Math.round(vMin)} - ${Math.round(vMax)}${cfg.suffix}`;
                }
            });

            // Regenerate characters only on final change (performance)
            sliderElement.noUiSlider.on('change', () => {
                this.currentParams = this.getParamsFromUI();
                this.regenerateCurrentCharacters();
            });
        });
    }

    setupCheckboxes() {
        const displayCheckboxes = ['showStickFigure', 'showThickness', 'showHeatmap', 'showFinal', 'showGrid'];

        displayCheckboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.displayOptions = this.getDisplayOptions();
                this.redrawCharacters();
            });
        });

        // Rendering checkboxes that DO NOT require full regeneration, just reprocessing
        const reprocessingCheckboxes = ['enableSmoothing', 'showOutline'];

        reprocessingCheckboxes.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.currentParams = this.getParamsFromUI();
                    this.reprocessCurrentCharacters();
                });
            }
        });
    }

    setupBatchOptions() {
        const bodyPreset = document.getElementById('bodyPreset');

        bodyPreset.addEventListener('change', (e) => {
            const preset = e.target.value;
            this.batchOptions.preset = preset;
            this.applyPresetToSliders(preset);
        });
    }

    applyPresetToSliders(preset) {
        // Get preset ranges from generator (we need to instantiate a dummy or use static if available)
        // Since getParamRanges is an instance method, we use this.characterGenerator
        let ranges;

        if (preset === 'max') {
            // Special "Max Range" preset: set all sliders to safeMin/safeMax
            Object.keys(PARAM_CONFIG).forEach(paramKey => {
                const slider = document.getElementById(`slider-${paramKey}`);
                if (!slider || !slider.noUiSlider) return;

                const cfg = PARAM_CONFIG[paramKey];
                slider.noUiSlider.set([cfg.safeMin, cfg.safeMax]);
            });
            return;
        } else {
            ranges = this.characterGenerator.getParamRanges(preset);
        }

        Object.keys(ranges).forEach(paramKey => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) return;

            const range = ranges[paramKey];
            // ranges returns {min, max} for each param
            slider.noUiSlider.set([range.min, range.max]);
        });

        // Trigger regeneration
        this.currentParams = this.getParamsFromUI();
        this.regenerateCurrentCharacters();
    }

    setupButtons() {
        document.getElementById('generateOne').addEventListener('click', () => {
            this.generateCharacters(1);
        });

        document.getElementById('generateTen').addEventListener('click', () => {
            this.generateCharacters(10);
        });

        document.getElementById('generateHundred').addEventListener('click', () => {
            this.generateCharacters(100);
        });

        document.getElementById('randomize').addEventListener('click', () => {
            this.randomizeSliders();
        });

        document.getElementById('exportSpritesheet').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.exportSpritesheet();
        });

        document.getElementById('exportZip').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.exportZip();
        });
    }

    updateCanvasSize(newSize) {
        this.canvasSize = newSize;
        this.characterGenerator = new CharacterGenerator(this.canvasSize);
        this.characterRenderer = new CharacterRenderer(3, this.canvasSize);
        this.regenerateCurrentCharacters();
    }

    generateCharacters(count) {
        this.characters = [];
        // Reset pools to ensure variety in new batch
        this.backstoryGenerator.resetPools();

        for (let i = 0; i < count; i++) {
            // Always use UI params (which are now updated by presets)
            const params = this.characterGenerator.resolveParams({ ...this.currentParams });

            if (!params.palette) {
                params.palette = generateRandomPalette();
            }

            const character = this.characterGenerator.generate(params);

            // Generate backstory
            character.backstory = this.backstoryGenerator.generate(character.name);

            this.characters.push(character);
        }

        this.renderCharacters();
    }

    regenerateCurrentCharacters() {
        if (this.characters.length === 0) return;

        // Note: We keep the same names and backstories when just tweaking sliders?
        // Or should we regenerate everything?
        // The current logic regenerates the visual character but keeps the object reference if possible?
        // Actually map creates new array.
        // Let's keep the name and backstory if we are just regenerating visuals.

        const oldCharacters = [...this.characters];
        this.characters = oldCharacters.map((oldChar) => {
            const params = this.characterGenerator.resolveParams({ ...this.currentParams });
            params.palette = generateRandomPalette();
            const newChar = this.characterGenerator.generate(params);

            // Preserve identity
            newChar.name = oldChar.name;
            newChar.backstory = oldChar.backstory;

            return newChar;
        });

        this.renderCharacters();
    }

    reprocessCurrentCharacters() {
        if (this.characters.length === 0) return;

        this.characters = this.characters.map(char => {
            return this.characterGenerator.reprocess(char, this.currentParams);
        });

        this.renderCharacters();
    }

    redrawCharacters() {
        this.renderCharacters();
    }

    renderCharacters() {
        const grid = document.getElementById('canvasGrid');
        grid.innerHTML = '';

        this.characters.forEach((character) => {
            // Create card wrapper
            const card = document.createElement('div');
            card.className = 'char-card';

            // Add click listener for backstory
            card.style.cursor = 'pointer';
            card.title = 'Click to see backstory';
            card.addEventListener('click', () => this.showBackstory(character));

            const canvas = this.characterRenderer.createCanvas();
            this.characterRenderer.drawCharacter(canvas, character, this.displayOptions);

            // Create name overlay
            const nameDiv = document.createElement('div');
            nameDiv.className = 'char-name';
            nameDiv.textContent = character.name;

            card.appendChild(canvas);
            card.appendChild(nameDiv);
            grid.appendChild(card);
        });
    }

    randomizeSliders() {
        const randomParams = this.characterGenerator.randomParams();

        // Create a narrow range around each random value for variety
        const createRange = (value, paramKey) => {
            const cfg = PARAM_CONFIG[paramKey];
            const variance = paramKey.includes('Angle') ? 10 : (value * 0.15);
            const rangeMin = Math.max(value - variance, cfg.hardMin);
            const rangeMax = Math.min(value + variance, cfg.hardMax);
            return { min: rangeMin, max: rangeMax };
        };

        // Update all noUiSliders with randomized ranges
        Object.keys(PARAM_CONFIG).forEach(paramKey => {
            const slider = document.getElementById(`slider-${paramKey}`);
            if (!slider || !slider.noUiSlider) return;

            const value = randomParams[paramKey];
            const range = createRange(value, paramKey);

            // Set the slider to the new range
            slider.noUiSlider.set([range.min, range.max]);
        });

        // Update will be triggered automatically by noUiSlider events
        this.currentParams = this.getParamsFromUI();
        this.regenerateCurrentCharacters();
    }

    exportSpritesheet() {
        if (this.characters.length === 0) {
            alert('No characters to export! Generate some first.');
            return;
        }

        // Calculate grid dimensions for spritesheet
        const cols = Math.ceil(Math.sqrt(this.characters.length));
        const rows = Math.ceil(this.characters.length / cols);

        const spriteSize = this.characterRenderer.displaySize;
        const totalWidth = cols * spriteSize;
        const totalHeight = rows * spriteSize;

        // Create a large canvas for the spritesheet
        const spritesheetCanvas = document.createElement('canvas');
        spritesheetCanvas.width = totalWidth;
        spritesheetCanvas.height = totalHeight;
        const ctx = spritesheetCanvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw each character to the spritesheet
        this.characters.forEach((character, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * spriteSize;
            const y = row * spriteSize;

            // Create temporary canvas for this character
            const charCanvas = this.characterRenderer.createCanvas();
            this.characterRenderer.drawCharacter(charCanvas, character, { showFinal: true });

            // Draw to spritesheet
            ctx.drawImage(charCanvas, x, y);
        });

        // Download the spritesheet
        spritesheetCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `spritesheet_${this.characters.length}_${Date.now()}.png`;
            // Prevent navigation issues
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Delay revocation to ensure download starts
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        });
    }

    async exportZip() {
        if (this.characters.length === 0) {
            alert('No characters to export! Generate some first.');
            return;
        }

        if (typeof JSZip === 'undefined') {
            alert('JSZip library not loaded. Please refresh the page.');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder("characters");

        // Render and add each character to zip
        const promises = this.characters.map((char, index) => {
            return new Promise((resolve) => {
                const canvas = this.characterRenderer.createCanvas();
                this.characterRenderer.drawCharacter(canvas, char, { showFinal: true });

                canvas.toBlob(blob => {
                    // Generate unique filename
                    const filename = `${nameGenerator.generateUniqueFilename(char.name)}.png`;
                    folder.file(filename, blob);
                    // Also save backstory
                    if (char.backstory) {
                        folder.file(`${filename.replace('.png', '.txt')}`, char.backstory);
                    }
                    resolve();
                });
            });
        });

        await Promise.all(promises);

        // Generate and download ZIP
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `characters_${this.characters.length}_${Date.now()}.zip`;
        // Prevent navigation issues
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Delay revocation to ensure download starts
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
