// Main App Entry Point
import { MonsterGenerator } from './generators/monster/monster-generator.js';
import { HumanGenerator } from './generators/human/human-generator.js';
import { MonsterBackstoryGenerator } from './generators/monster/monster-backstory.js';
import { HumanBackstoryGenerator } from './generators/human/human-backstory.js';
import { CharacterRenderer } from './core/renderer.js';
import { PARAM_CONFIG } from './config.js';
import { generateRandomPalette } from './utils/random.js';

class App {
    constructor() {
        this.canvasSize = 50; // Default canvas size
        this.monsterGenerator = new MonsterGenerator(this.canvasSize);
        this.humanGenerator = new HumanGenerator(this.canvasSize);
        this.characterRenderer = new CharacterRenderer(3, this.canvasSize);

        this.monsterBackstoryGenerator = new MonsterBackstoryGenerator();
        this.humanBackstoryGenerator = new HumanBackstoryGenerator();

        this.currentParams = this.getParamsFromUI();
        this.displayOptions = this.getDisplayOptions();
        this.batchOptions = {
            preset: 'standard'
        };
        this.characters = [];

        this.init();
    }

    init() {
        this.setupGeneratorType();
        this.setupSliders();
        this.setupCheckboxes();
        this.setupBatchOptions();
        this.setupButtons();
        this.setupModal();
        this.generateCharacters(1);
    }

    get currentGenerator() {
        const type = document.getElementById('generatorType').value;
        return type === 'human' ? this.humanGenerator : this.monsterGenerator;
    }

    get currentBackstoryGenerator() {
        const type = document.getElementById('generatorType').value;
        return type === 'human' ? this.humanBackstoryGenerator : this.monsterBackstoryGenerator;
    }

    setupGeneratorType() {
        const selector = document.getElementById('generatorType');
        selector.addEventListener('change', () => {
            // When switching types, we might want to reset sliders to a default for that type
            // For now, let's just regenerate with current sliders but new logic
            this.generateCharacters(this.characters.length || 1);
        });
    }

    setupModal() {
        const modal = document.getElementById('backstoryModal');
        const closeBtn = modal.querySelector('.close-modal');

        // Controls
        document.getElementById('prevChar').addEventListener('click', () => this.navigateModal(-1));
        document.getElementById('nextChar').addEventListener('click', () => this.navigateModal(1));
        document.getElementById('toggleAnimation').addEventListener('click', () => this.toggleAnimation());

        document.getElementById('exportModalCard').addEventListener('click', () => this.exportCard());
        document.getElementById('exportModalStrip').addEventListener('click', () => this.exportStrip());
        document.getElementById('exportModalSeq').addEventListener('click', () => this.exportSeq());

        // Close logic
        const closeModal = () => {
            modal.style.display = "none";
            this.stopAnimation();
        };

        if (closeBtn) closeBtn.onclick = closeModal;
        window.onclick = (event) => {
            if (event.target == modal) closeModal();
        };
    }

    showBackstory(character) {
        const modal = document.getElementById('backstoryModal');
        this.currentModalCharacter = character;
        this.currentModalIndex = this.characters.indexOf(character);

        // Reset view state
        this.isAnimating = true;
        this.animationFrame = 0;
        this.animationDirection = 1; // 1 for forward, -1 for backward

        this.updateModalContent();
        modal.style.display = "flex";

        this.startAnimation();
    }

    updateModalContent() {
        const character = this.currentModalCharacter;
        if (!character) return;

        document.getElementById('modalTitle').textContent = character.name;
        document.getElementById('modalBody').innerHTML = character.backstory || "Nessuna storia disponibile.";

        // Update Play/Pause button
        const btn = document.getElementById('toggleAnimation');
        btn.textContent = this.isAnimating ? "⏸" : "▶";

        this.renderModalCanvas();
    }

    renderModalCanvas() {
        const modalImgContainer = document.querySelector('.modal-image-container');
        modalImgContainer.innerHTML = '';

        const canvas = this.characterRenderer.createCanvas();

        canvas.style.width = '100%'; // Base width
        canvas.style.height = 'auto';
        canvas.style.imageRendering = 'pixelated';

        // Draw with current animation frame
        this.characterRenderer.drawCharacter(canvas, this.currentModalCharacter, {
            ...this.displayOptions,
            showFinal: true, // Always show pixels in modal
            frameIndex: this.animationFrame
        });

        modalImgContainer.appendChild(canvas);
    }

    navigateModal(direction) {
        if (this.characters.length === 0) return;

        this.currentModalIndex += direction;

        // Loop
        if (this.currentModalIndex >= this.characters.length) this.currentModalIndex = 0;
        if (this.currentModalIndex < 0) this.currentModalIndex = this.characters.length - 1;

        this.currentModalCharacter = this.characters[this.currentModalIndex];
        this.updateModalContent();
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        this.updateModalContent(); // Update button
        if (this.isAnimating) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        this.stopAnimation(); // Clear existing
        this.animationInterval = setInterval(() => {
            // Ping-pong loop: 0 -> 1 -> 2 -> 1 -> 0
            this.animationFrame += this.animationDirection;

            if (this.animationFrame >= 2) {
                this.animationDirection = -1;
                this.animationFrame = 2;
            } else if (this.animationFrame <= 0) {
                this.animationDirection = 1;
                this.animationFrame = 0;
            }

            this.renderModalCanvas();
        }, 300); // Faster than 500ms for breathing
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
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
            // Apply safe zone background gradient
            // Commented out for Swiss design (minimalist)
            /*
            sliderElement.style.background = `linear-gradient(to right,
                #222 0%,
                #222 ${safeStartPct}%,
                #3a3a3a ${safeStartPct}%,
                #3a3a3a ${safeEndPct}%,
                #222 ${safeEndPct}%,
                #222 100%)`;
            */

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
            ranges = this.currentGenerator.getParamRanges(preset);
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
        this.monsterGenerator = new MonsterGenerator(this.canvasSize);
        this.humanGenerator = new HumanGenerator(this.canvasSize);
        this.characterRenderer = new CharacterRenderer(3, this.canvasSize);
        this.regenerateCurrentCharacters();
    }

    generateCharacters(count) {
        this.characters = [];
        // Reset pools to ensure variety in new batch
        // this.backstoryGenerator.resetPools(); // TODO: Add reset to placeholders if needed

        for (let i = 0; i < count; i++) {
            // Always use UI params (which are now updated by presets)
            // Use current generator to resolve params
            const params = this.currentGenerator.resolveParams({ ...this.currentParams });

            if (!params.palette) {
                if (this.currentGenerator instanceof HumanGenerator) {
                    const dummy = this.currentGenerator.randomParamsInRange();
                    params.palette = dummy.palette;
                } else {
                    params.palette = generateRandomPalette();
                }
            }

            const character = this.currentGenerator.generate(params);

            // Generate animation frames
            character.animationFrames = this.currentGenerator.generateAnimationFrames(params);

            // Generate backstory
            character.backstory = this.currentBackstoryGenerator.generate(character.name);

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
            const params = this.currentGenerator.resolveParams({ ...this.currentParams });

            // Keep existing palette if we are just tweaking sliders?
            // Or generate new one? Original code generated new one.
            // Let's generate new one consistent with generator type.
            if (this.currentGenerator instanceof HumanGenerator) {
                const dummy = this.currentGenerator.randomParamsInRange();
                params.palette = dummy.palette;
            } else {
                params.palette = generateRandomPalette();
            }

            const newChar = this.currentGenerator.generate(params);
            newChar.animationFrames = this.currentGenerator.generateAnimationFrames(params);

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
            const updatedChar = this.currentGenerator.reprocess(char, this.currentParams);
            // Reprocessing animation frames is tricky because they are just pixels.
            // Ideally we should regenerate them if params changed significantly, 
            // but reprocess is for smoothing/outline which applies to pixels.
            // So we need to reprocess each frame too.
            // But wait, reprocess method in Generator takes a character object and modifies its pixels.
            // It doesn't return new pixels for frames.
            // Let's just regenerate frames for simplicity since reprocess is fast enough or we can skip it for now.
            // Actually, if we change smoothing, we want frames to be smoothed too.
            // So let's regenerate frames using current params.
            updatedChar.animationFrames = this.currentGenerator.generateAnimationFrames(this.currentParams);
            return updatedChar;
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

            // Create story overlay
            const storyDiv = document.createElement('div');
            storyDiv.className = 'char-story';
            storyDiv.textContent = character.backstory || "Nessuna storia disponibile.";

            card.appendChild(canvas);
            card.appendChild(nameDiv);
            card.appendChild(storyDiv);
            grid.appendChild(card);
        });
    }

    randomizeSliders() {
        const randomParams = this.currentGenerator.randomParams();

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

    exportCard() {
        const char = this.currentModalCharacter;
        if (!char) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 20;
        const cardWidth = 400;
        const imageSize = 300; // Scaled up pixel art
        const textHeight = 200;
        const cardHeight = padding + imageSize + padding + textHeight + padding;

        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);

        // Draw Character
        // We need a temp canvas to draw the character first at correct resolution then scale
        const charCanvas = this.characterRenderer.createCanvas();
        this.characterRenderer.drawCharacter(charCanvas, char, { showFinal: true });

        ctx.imageSmoothingEnabled = false;
        // Center image
        const imgX = (cardWidth - imageSize) / 2;
        ctx.drawImage(charCanvas, imgX, padding, imageSize, imageSize);

        // Draw Name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(char.name, cardWidth / 2, padding + imageSize + 40);

        // Draw Backstory (wrap text)
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillStyle = '#ccc';
        const textX = cardWidth / 2;
        let textY = padding + imageSize + 70;
        const maxWidth = cardWidth - (padding * 2);
        const lineHeight = 20;

        const words = (char.backstory || "").split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, textX, textY);
                line = words[n] + ' ';
                textY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, textX, textY);

        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${char.name.replace(/\s+/g, '_')}_card.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    exportStrip() {
        const char = this.currentModalCharacter;
        if (!char) return;

        const numFrames = 2; // 0 and 1
        const spriteSize = this.characterRenderer.displaySize;

        const canvas = document.createElement('canvas');
        canvas.width = spriteSize * numFrames;
        canvas.height = spriteSize;
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < numFrames; i++) {
            const frameCanvas = this.characterRenderer.createCanvas();
            this.characterRenderer.drawCharacter(frameCanvas, char, {
                showFinal: true,
                frameIndex: i
            });
            ctx.drawImage(frameCanvas, i * spriteSize, 0);
        }

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${char.name.replace(/\s+/g, '_')}_strip.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    async exportSeq() {
        const char = this.currentModalCharacter;
        if (!char) return;

        if (typeof JSZip === 'undefined') {
            alert('JSZip library not loaded.');
            return;
        }

        const zip = new JSZip();
        const numFrames = 2; // 0 and 1

        const promises = [];
        for (let i = 0; i < numFrames; i++) {
            promises.push(new Promise(resolve => {
                const canvas = this.characterRenderer.createCanvas();
                this.characterRenderer.drawCharacter(canvas, char, {
                    showFinal: true,
                    frameIndex: i
                });
                canvas.toBlob(blob => {
                    zip.file(`${char.name.replace(/\s+/g, '_')}_frame_${i}.png`, blob);
                    resolve();
                });
            }));
        }

        await Promise.all(promises);

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${char.name.replace(/\s+/g, '_')}_sequence.zip`;
        a.click();
        URL.revokeObjectURL(url);
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
