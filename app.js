// App - Connect UI with generation logic

class App {
    constructor() {
        this.currentParams = this.getParamsFromUI();
        this.displayOptions = this.getDisplayOptions();
        this.characters = [];
        
        this.init();
    }

    init() {
        this.setupSliders();
        this.setupCheckboxes();
        this.setupButtons();
        
        // Generate initial character
        this.generateCharacters(1);
    }

    // Get current parameters from UI sliders
    getParamsFromUI() {
        return {
            headSize: parseFloat(document.getElementById('headSize').value),
            bodyHeight: parseFloat(document.getElementById('bodyHeight').value),
            shoulderWidth: parseFloat(document.getElementById('shoulderWidth').value),
            hipWidth: parseFloat(document.getElementById('hipWidth').value),
            armLength: parseFloat(document.getElementById('armLength').value),
            legLength: parseFloat(document.getElementById('legLength').value),
            headThickness: parseFloat(document.getElementById('headThickness').value),
            torsoThickness: parseFloat(document.getElementById('torsoThickness').value),
            armThickness: parseFloat(document.getElementById('armThickness').value),
            legThickness: parseFloat(document.getElementById('legThickness').value)
        };
    }

    // Get display options from checkboxes
    getDisplayOptions() {
        return {
            showStickFigure: document.getElementById('showStickFigure').checked,
            showThickness: document.getElementById('showThickness').checked,
            showFinal: document.getElementById('showFinal').checked,
            showGrid: document.getElementById('showGrid').checked
        };
    }

    // Setup slider event listeners
    setupSliders() {
        const sliders = [
            'headSize', 'bodyHeight', 'shoulderWidth', 'hipWidth',
            'armLength', 'legLength', 'headThickness', 'torsoThickness',
            'armThickness', 'legThickness'
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

    // Setup checkbox event listeners
    setupCheckboxes() {
        const checkboxes = ['showStickFigure', 'showThickness', 'showFinal', 'showGrid'];
        
        checkboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.displayOptions = this.getDisplayOptions();
                this.redrawCharacters();
            });
        });
    }

    // Setup button event listeners
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

    // Generate N characters
    generateCharacters(count) {
        this.characters = [];
        
        for (let i = 0; i < count; i++) {
            const character = characterGenerator.generate(this.currentParams);
            this.characters.push(character);
        }
        
        this.renderCharacters();
    }

    // Regenerate characters with new parameters (keep same count)
    regenerateCurrentCharacters() {
        if (this.characters.length === 0) return;
        
        this.characters = this.characters.map(() => 
            characterGenerator.generate(this.currentParams)
        );
        
        this.renderCharacters();
    }

    // Redraw existing characters (no regeneration, just re-render)
    redrawCharacters() {
        this.renderCharacters();
    }

    // Render all characters to canvas grid
    renderCharacters() {
        const grid = document.getElementById('canvasGrid');
        grid.innerHTML = ''; // Clear grid

        this.characters.forEach((character, index) => {
            const container = document.createElement('div');
            container.className = 'canvas-container';
            
            const canvas = characterRenderer.createCanvas();
            characterRenderer.drawCharacter(canvas, character, this.displayOptions);
            
            const label = document.createElement('div');
            label.className = 'canvas-label';
            label.textContent = `Character ${index + 1}`;
            
            container.appendChild(canvas);
            container.appendChild(label);
            grid.appendChild(container);
        });
    }

    // Randomize all parameters
    randomizeParams() {
        const randomParams = characterGenerator.randomParams();
        
        // Update UI sliders
        Object.keys(randomParams).forEach(key => {
            const slider = document.getElementById(key);
            const valueDisplay = document.getElementById(key + 'Value');
            if (slider && valueDisplay) {
                slider.value = randomParams[key];
                valueDisplay.textContent = randomParams[key];
            }
        });
        
        this.currentParams = randomParams;
        this.regenerateCurrentCharacters();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
