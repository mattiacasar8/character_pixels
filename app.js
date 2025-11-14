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
            torsoY: 10, // Higher up
            
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
            shinLength: 12,
            legAngle: parseFloat(document.getElementById('legAngle').value),
            
            fillDensity: parseFloat(document.getElementById('fillDensity').value),
            palette: this.generatePalette()
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
        const checkboxes = ['showStickFigure', 'showThickness', 'showHeatmap', 'showFinal', 'showGrid'];

        checkboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.displayOptions = this.getDisplayOptions();
                this.redrawCharacters();
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

        this.characters.forEach((character, index) => {
            const container = document.createElement('div');
            container.className = 'canvas-container';

            const canvas = this.characterRenderer.createCanvas();
            this.characterRenderer.drawCharacter(canvas, character, this.displayOptions);

            const label = document.createElement('div');
            label.className = 'canvas-label';
            label.textContent = `Character ${index + 1}`;

            container.appendChild(canvas);
            container.appendChild(label);
            grid.appendChild(container);
        });
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
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
