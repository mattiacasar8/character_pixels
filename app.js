// App - Connect UI with generation logic

// Parameter Configuration: Hard Limits vs Safe Limits
const PARAM_CONFIG = {
    torsoTopWidth: {
        hardMin: 5, hardMax: 50,      // Extreme physical limits
        safeMin: 16, safeMax: 32,     // Suggested humanoid range
        step: 1,
        label: 'Torso Width (Top)',
        suffix: '%'
    },
    torsoBottomWidth: {
        hardMin: 5, hardMax: 45,
        safeMin: 12, safeMax: 28,
        step: 1,
        label: 'Torso Width (Bottom)',
        suffix: '%'
    },
    torsoHeight: {
        hardMin: 10, hardMax: 60,
        safeMin: 24, safeMax: 36,
        step: 1,
        label: 'Torso Height',
        suffix: '%'
    },
    headWidth: {
        hardMin: 5, hardMax: 40,
        safeMin: 12, safeMax: 24,
        step: 1,
        label: 'Head Size',
        suffix: '%'
    },
    neckWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 10,
        step: 1,
        label: 'Neck Width',
        suffix: '%'
    },
    neckHeight: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Neck Height',
        suffix: '%'
    },
    upperArmTopWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Upper Arm Width',
        suffix: '%'
    },
    forearmTopWidth: {
        hardMin: 2, hardMax: 18,
        safeMin: 3, safeMax: 10,
        step: 1,
        label: 'Forearm Width',
        suffix: '%'
    },
    upperArmLength: {
        hardMin: 10, hardMax: 40,
        safeMin: 16, safeMax: 28,
        step: 1,
        label: 'Arm Length',
        suffix: '%'
    },
    armAngle: {
        hardMin: -180, hardMax: 0,
        safeMin: -80, safeMax: -10,
        step: 5,
        label: 'Arm Angle',
        suffix: '°'
    },
    elbowAngle: {
        hardMin: -90, hardMax: 90,
        safeMin: -70, safeMax: 70,
        step: 5,
        label: 'Elbow Angle',
        suffix: '°'
    },
    thighTopWidth: {
        hardMin: 3, hardMax: 25,
        safeMin: 6, safeMax: 16,
        step: 1,
        label: 'Thigh Width',
        suffix: '%'
    },
    shinTopWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Shin Width',
        suffix: '%'
    },
    thighLength: {
        hardMin: 10, hardMax: 40,
        safeMin: 16, safeMax: 28,
        step: 1,
        label: 'Thigh Length',
        suffix: '%'
    },
    legAngle: {
        hardMin: -45, hardMax: 15,
        safeMin: -25, safeMax: 0,
        step: 5,
        label: 'Leg Angle',
        suffix: '°'
    },
    fillDensity: {
        hardMin: 0.1, hardMax: 1.0,
        safeMin: 0.3, safeMax: 1.0,
        step: 0.05,
        label: 'Fill Density',
        suffix: ''
    }
};

class App {
    constructor() {
        this.canvasSize = 50; // Default canvas size, will be configurable
        this.characterGenerator = new CharacterGenerator(this.canvasSize);
        this.characterRenderer = new CharacterRenderer(3, this.canvasSize);

        this.currentParams = this.getParamsFromUI();
        this.displayOptions = this.getDisplayOptions();
        this.batchOptions = {
            randomize: false,
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
        this.generateCharacters(1);
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

    generatePalette() {
        return [
            { r: 255, g: 100, b: 100 },
            { r: 100, g: 255, b: 100 },
            { r: 100, g: 100, b: 255 }
        ];
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
        // Canvas size slider (special handling - still using native range input)
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

        // Rendering checkboxes that require regeneration
        const renderingCheckboxes = ['enableSmoothing', 'showOutline'];

        renderingCheckboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.currentParams = this.getParamsFromUI();
                this.regenerateCurrentCharacters();
            });
        });
    }

    setupBatchOptions() {
        const randomizeBatch = document.getElementById('randomizeBatch');
        const bodyPreset = document.getElementById('bodyPreset');

        randomizeBatch.addEventListener('change', (e) => {
            this.batchOptions.randomize = e.target.checked;
        });

        bodyPreset.addEventListener('change', (e) => {
            this.batchOptions.preset = e.target.value;
        });
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
            this.randomizeParams();
        });

        document.getElementById('exportSpritesheet').addEventListener('click', () => {
            this.exportSpritesheet();
        });

        document.getElementById('exportZip').addEventListener('click', () => {
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

        for (let i = 0; i < count; i++) {
            let params;

            if (count > 1 && this.batchOptions.randomize) {
                // Batch generation with preset randomization
                params = this.characterGenerator.randomParamsInRange(this.batchOptions.preset);
            } else {
                // Single or batch generation using UI ranges
                // Resolve range params {min, max} to specific values
                params = this.characterGenerator.resolveParams({ ...this.currentParams });
            }

            // Always add random palette
            params.palette = this.generateRandomPalette();

            const character = this.characterGenerator.generate(params);
            this.characters.push(character);
        }

        this.renderCharacters();
    }

    generateRandomPalette() {
        const numColors = Math.floor(Math.random() * 3) + 3;
        const palette = [];
        for (let i = 0; i < numColors; i++) {
            palette.push({
                r: Math.floor(Math.random() * 206) + 50,
                g: Math.floor(Math.random() * 206) + 50,
                b: Math.floor(Math.random() * 206) + 50
            });
        }
        return palette;
    }

    regenerateCurrentCharacters() {
        if (this.characters.length === 0) return;

        this.characters = this.characters.map(() => {
            // Resolve UI range params to specific values for each character
            const params = this.characterGenerator.resolveParams({ ...this.currentParams });
            params.palette = this.generateRandomPalette();
            return this.characterGenerator.generate(params);
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

    randomizeParams() {
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
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
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
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
