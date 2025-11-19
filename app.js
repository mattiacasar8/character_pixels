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
        // All parameters are now in % of canvas size
        const torsoTopWidth = parseFloat(document.getElementById('torsoTopWidth').value);
        const torsoBottomWidth = parseFloat(document.getElementById('torsoBottomWidth').value);
        const headWidth = parseFloat(document.getElementById('headWidth').value);
        const upperArmTopWidth = parseFloat(document.getElementById('upperArmTopWidth').value);
        const forearmTopWidth = parseFloat(document.getElementById('forearmTopWidth').value);
        const thighTopWidth = parseFloat(document.getElementById('thighTopWidth').value);
        const shinTopWidth = parseFloat(document.getElementById('shinTopWidth').value);

        return {
            torsoTopWidth: torsoTopWidth,
            torsoBottomWidth: torsoBottomWidth,
            torsoHeight: parseFloat(document.getElementById('torsoHeight').value),
            torsoY: 20, // 20% from top

            neckWidth: parseFloat(document.getElementById('neckWidth').value),
            neckHeight: parseFloat(document.getElementById('neckHeight').value),
            headWidth: headWidth,
            headHeight: headWidth,

            upperArmTopWidth: upperArmTopWidth,
            upperArmBottomWidth: upperArmTopWidth * 0.8,
            upperArmLength: parseFloat(document.getElementById('upperArmLength').value),
            forearmTopWidth: forearmTopWidth,
            forearmBottomWidth: forearmTopWidth * 0.7,
            forearmLength: parseFloat(document.getElementById('upperArmLength').value),
            armAngle: parseFloat(document.getElementById('armAngle').value),
            elbowAngle: parseFloat(document.getElementById('elbowAngle').value),

            thighTopWidth: thighTopWidth,
            thighBottomWidth: thighTopWidth * 0.8,
            thighLength: parseFloat(document.getElementById('thighLength').value),
            shinTopWidth: shinTopWidth,
            shinBottomWidth: shinTopWidth * 0.8,
            shinLength: 24, // 24%
            legAngle: parseFloat(document.getElementById('legAngle').value),

            fillDensity: parseFloat(document.getElementById('fillDensity').value),
            palette: this.generatePalette(),
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

        // Regular parameter sliders
        const sliders = [
            'torsoTopWidth', 'torsoBottomWidth', 'torsoHeight',
            'headWidth', 'neckWidth', 'neckHeight',
            'upperArmTopWidth', 'forearmTopWidth', 'upperArmLength',
            'armAngle', 'elbowAngle',
            'thighTopWidth', 'shinTopWidth', 'thighLength', 'legAngle',
            'fillDensity'
        ];

        sliders.forEach(id => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(id + 'Value');

            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
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

        document.getElementById('exportAll').addEventListener('click', () => {
            this.exportAll();
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
                // Batch generation con randomizzazione
                params = this.characterGenerator.randomParamsInRange(this.batchOptions.preset);
            } else {
                // Generazione singola o batch senza randomizzazione
                params = { ...this.currentParams };
                params.palette = this.generateRandomPalette();
            }

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
            const params = { ...this.currentParams };
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
            const canvas = this.characterRenderer.createCanvas();
            this.characterRenderer.drawCharacter(canvas, character, this.displayOptions);

            // Store character name in dataset
            canvas.dataset.characterName = character.name;

            // Add click event to show name
            canvas.addEventListener('click', () => {
                this.showCharacterTooltip(character.name);
            });

            grid.appendChild(canvas);
        });
    }

    showCharacterTooltip(name) {
        const tooltip = document.getElementById('characterTooltip');
        tooltip.textContent = `Character: ${name}`;
        tooltip.classList.add('show');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 3000);
    }

    randomizeParams() {
        const randomParams = this.characterGenerator.randomParams();
        
        const sliderMappings = {
            'torsoTopWidth': randomParams.torsoTopWidth,
            'torsoBottomWidth': randomParams.torsoBottomWidth,
            'torsoHeight': randomParams.torsoHeight,
            'headWidth': randomParams.headWidth,
            'neckWidth': randomParams.neckWidth,
            'neckHeight': randomParams.neckHeight,
            'upperArmTopWidth': randomParams.upperArmTopWidth,
            'forearmTopWidth': randomParams.forearmTopWidth,
            'upperArmLength': randomParams.upperArmLength,
            'armAngle': randomParams.armAngle,
            'elbowAngle': randomParams.elbowAngle,
            'thighTopWidth': randomParams.thighTopWidth,
            'shinTopWidth': randomParams.shinTopWidth,
            'thighLength': randomParams.thighLength,
            'legAngle': randomParams.legAngle,
            'fillDensity': randomParams.fillDensity
        };
        
        Object.keys(sliderMappings).forEach(id => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(id + 'Value');
            if (slider && valueDisplay) {
                const value = sliderMappings[id];
                slider.value = value;
                valueDisplay.textContent = typeof value === 'number' ? value.toFixed(1) : value;
            }
        });
        
        this.currentParams = randomParams;
        this.regenerateCurrentCharacters();
    }

    exportAll() {
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
            a.download = `characters_${this.characters.length}_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
