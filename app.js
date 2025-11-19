// App - Connect UI with generation logic

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
        // All parameters are now ranges (min-max) in % of canvas size
        return {
            torsoTopWidth: {
                min: parseFloat(document.getElementById('torsoTopWidthMin').value),
                max: parseFloat(document.getElementById('torsoTopWidthMax').value)
            },
            torsoBottomWidth: {
                min: parseFloat(document.getElementById('torsoBottomWidthMin').value),
                max: parseFloat(document.getElementById('torsoBottomWidthMax').value)
            },
            torsoHeight: {
                min: parseFloat(document.getElementById('torsoHeightMin').value),
                max: parseFloat(document.getElementById('torsoHeightMax').value)
            },
            torsoY: 20, // 20% from top (fixed)

            neckWidth: {
                min: parseFloat(document.getElementById('neckWidthMin').value),
                max: parseFloat(document.getElementById('neckWidthMax').value)
            },
            neckHeight: {
                min: parseFloat(document.getElementById('neckHeightMin').value),
                max: parseFloat(document.getElementById('neckHeightMax').value)
            },
            headWidth: {
                min: parseFloat(document.getElementById('headWidthMin').value),
                max: parseFloat(document.getElementById('headWidthMax').value)
            },

            upperArmTopWidth: {
                min: parseFloat(document.getElementById('upperArmTopWidthMin').value),
                max: parseFloat(document.getElementById('upperArmTopWidthMax').value)
            },
            forearmTopWidth: {
                min: parseFloat(document.getElementById('forearmTopWidthMin').value),
                max: parseFloat(document.getElementById('forearmTopWidthMax').value)
            },
            upperArmLength: {
                min: parseFloat(document.getElementById('upperArmLengthMin').value),
                max: parseFloat(document.getElementById('upperArmLengthMax').value)
            },
            armAngle: {
                min: parseFloat(document.getElementById('armAngleMin').value),
                max: parseFloat(document.getElementById('armAngleMax').value)
            },
            elbowAngle: {
                min: parseFloat(document.getElementById('elbowAngleMin').value),
                max: parseFloat(document.getElementById('elbowAngleMax').value)
            },

            thighTopWidth: {
                min: parseFloat(document.getElementById('thighTopWidthMin').value),
                max: parseFloat(document.getElementById('thighTopWidthMax').value)
            },
            shinTopWidth: {
                min: parseFloat(document.getElementById('shinTopWidthMin').value),
                max: parseFloat(document.getElementById('shinTopWidthMax').value)
            },
            thighLength: {
                min: parseFloat(document.getElementById('thighLengthMin').value),
                max: parseFloat(document.getElementById('thighLengthMax').value)
            },
            legAngle: {
                min: parseFloat(document.getElementById('legAngleMin').value),
                max: parseFloat(document.getElementById('legAngleMax').value)
            },

            fillDensity: {
                min: parseFloat(document.getElementById('fillDensityMin').value),
                max: parseFloat(document.getElementById('fillDensityMax').value)
            },

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
        // Canvas size slider (special handling)
        const canvasSizeSlider = document.getElementById('canvasSize');
        const canvasSizeValue = document.getElementById('canvasSizeValue');

        canvasSizeSlider.addEventListener('input', (e) => {
            const newSize = parseInt(e.target.value);
            canvasSizeValue.textContent = newSize;
            this.updateCanvasSize(newSize);
        });

        // Range parameter inputs (Min/Max system)
        const rangeParams = [
            'torsoTopWidth', 'torsoBottomWidth', 'torsoHeight',
            'headWidth', 'neckWidth', 'neckHeight',
            'upperArmTopWidth', 'forearmTopWidth', 'upperArmLength',
            'armAngle', 'elbowAngle',
            'thighTopWidth', 'shinTopWidth', 'thighLength', 'legAngle',
            'fillDensity'
        ];

        rangeParams.forEach(id => {
            const minInput = document.getElementById(id + 'Min');
            const maxInput = document.getElementById(id + 'Max');
            const valueDisplay = document.getElementById(id + 'Value');

            const updateDisplay = () => {
                const minVal = parseFloat(minInput.value);
                const maxVal = parseFloat(maxInput.value);

                // Format display based on parameter type
                if (id === 'fillDensity') {
                    valueDisplay.textContent = `${minVal.toFixed(2)}-${maxVal.toFixed(2)}`;
                } else if (id.includes('Angle')) {
                    valueDisplay.textContent = `${minVal} to ${maxVal}`;
                } else {
                    valueDisplay.textContent = `${minVal}-${maxVal}`;
                }

                this.currentParams = this.getParamsFromUI();
                this.regenerateCurrentCharacters();
            };

            minInput.addEventListener('input', updateDisplay);
            maxInput.addEventListener('input', updateDisplay);
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
        const createRange = (value, variance = 0.15) => {
            const range = value * variance;
            return {
                min: Math.max(value - range, value * 0.7),
                max: Math.min(value + range, value * 1.3)
            };
        };

        const paramList = [
            'torsoTopWidth', 'torsoBottomWidth', 'torsoHeight',
            'headWidth', 'neckWidth', 'neckHeight',
            'upperArmTopWidth', 'forearmTopWidth', 'upperArmLength',
            'armAngle', 'elbowAngle',
            'thighTopWidth', 'shinTopWidth', 'thighLength', 'legAngle',
            'fillDensity'
        ];

        paramList.forEach(id => {
            const value = randomParams[id];
            const minInput = document.getElementById(id + 'Min');
            const maxInput = document.getElementById(id + 'Max');
            const valueDisplay = document.getElementById(id + 'Value');

            if (minInput && maxInput && valueDisplay) {
                const range = createRange(value, id.includes('Angle') ? 10 : 0.15);

                minInput.value = range.min.toFixed(id === 'fillDensity' ? 2 : 0);
                maxInput.value = range.max.toFixed(id === 'fillDensity' ? 2 : 0);

                // Update display
                if (id === 'fillDensity') {
                    valueDisplay.textContent = `${range.min.toFixed(2)}-${range.max.toFixed(2)}`;
                } else if (id.includes('Angle')) {
                    valueDisplay.textContent = `${Math.round(range.min)} to ${Math.round(range.max)}`;
                } else {
                    valueDisplay.textContent = `${Math.round(range.min)}-${Math.round(range.max)}`;
                }
            }
        });

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
