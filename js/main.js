// Main App Entry Point
import { MonsterGenerator } from './generators/monster/monster-generator.js';
import { HumanGenerator } from './generators/human/human-generator.js';
import { MonsterBackstoryGenerator } from './generators/monster/monster-backstory.js';
import { HumanBackstoryGenerator } from './generators/human/human-backstory.js';
import { CharacterRenderer } from './core/renderer.js';
import { PARAM_CONFIG } from './config.js';
import { generateRandomPalette } from './utils/random.js';
import { nameGenerator } from './generators/name-generator.js';

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
        const presetSelector = document.getElementById('bodyPreset');

        const updatePresets = () => {
            const type = selector.value;
            // Clear existing options
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

            // Reset to standard and apply corresponding ranges
            presetSelector.value = 'standard';
            this.batchOptions.preset = 'standard';
            this.applyPresetToSliders('standard');
        };

        // Initial call
        updatePresets();

        selector.addEventListener('change', () => {
            updatePresets();
            // When switching types, apply standard preset for the new type and regenerate
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

        // Outline color
        const outlineColor = document.getElementById('outlineColor');
        if (outlineColor) {
            outlineColor.addEventListener('input', () => {
                this.currentParams = this.getParamsFromUI();
                this.reprocessCurrentCharacters();
            });
        }
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
        this.currentBackstoryGenerator.resetPools();

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

        // When sliders are modified, preserve character identity and palette
        // Only when user clicks "Generate" buttons should everything be new
        const oldCharacters = [...this.characters];
        this.characters = oldCharacters.map((oldChar) => {
            const params = this.currentGenerator.resolveParams({ ...this.currentParams });

            // Preserve original palette from character
            params.palette = oldChar.params?.palette || oldChar.palette;

            // For humans, also preserve color scheme
            if (this.currentGenerator instanceof HumanGenerator && oldChar.params?.humanColors) {
                params.humanColors = oldChar.params.humanColors;
            }

            // Preserve seed if available for consistency
            if (oldChar.params?.seed) {
                params.seed = oldChar.params.seed;
            }

            const newChar = this.currentGenerator.generate(params);
            newChar.animationFrames = this.currentGenerator.generateAnimationFrames(params);

            // Preserve identity (name and backstory)
            newChar.name = oldChar.name;
            newChar.backstory = oldChar.backstory;

            return newChar;
        });

        this.renderCharacters();
    }

    reprocessCurrentCharacters() {
        if (this.characters.length === 0) return;

        this.characters = this.characters.map(char => {
            // We only want to update rendering flags, keeping dimensions and seed intact.
            // currentParams contains slider ranges which would overwrite resolved dimensions with objects,
            // causing NaN in generation.
            const mergedParams = { ...char.params };
            mergedParams.enableSmoothing = this.currentParams.enableSmoothing;
            mergedParams.showOutline = this.currentParams.showOutline;
            mergedParams.outlineColor = this.currentParams.outlineColor;

            const updatedChar = this.currentGenerator.reprocess(char, mergedParams);

            // Regenerate animation frames with new rendering settings
            updatedChar.animationFrames = this.currentGenerator.generateAnimationFrames(mergedParams);

            // Update stored params
            updatedChar.params = mergedParams;

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
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw each character to the spritesheet
        this.characters.forEach((character, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * spriteSize;
            const y = row * spriteSize;

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

        // Design Specs from Figma
        const paddingX = 165;
        const paddingY = 300;
        const contentWidth = 750;
        const gapImageName = 24;
        const gapNameDesc = 24;
        const imageSize = 750; // Full width of content column

        // Fonts
        const nameFontSize = 96;
        const nameFont = `${nameFontSize}px "Instrument Serif", serif`;
        const descFontSize = 36;
        const descFont = `${descFontSize}px "Inter", sans-serif`;
        const descLineHeight = descFontSize * 1.4; // Estimate for leading-normal

        // Text content
        const nameText = char.name;
        const descText = char.backstory || "Di Narril si sa poco. Qualcuno sostiene che non invecchi mai davvero.";

        // 1. Calculate Dimensions
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Measure Name
        tempCtx.font = nameFont;
        // Approximate height for name
        const nameHeight = nameFontSize;

        // Measure Description
        tempCtx.font = descFont;
        const wrapText = (ctx, text, maxWidth) => {
            const words = text.split(' ');
            let line = '';
            let lineCount = 1;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    line = words[n] + ' ';
                    lineCount++;
                } else {
                    line = testLine;
                }
            }
            return lineCount;
        };

        const descLineCount = wrapText(tempCtx, descText, contentWidth);
        const descHeight = descLineCount * descLineHeight;

        const totalHeight = paddingY + imageSize + gapImageName + nameHeight + gapNameDesc + descHeight + paddingY;
        const totalWidth = paddingX + contentWidth + paddingX;

        // 2. Create Final Canvas
        const canvas = document.createElement('canvas');
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // 3. Draw Content
        let currentY = paddingY;
        const startX = paddingX;

        const charCanvas = this.characterRenderer.createCanvas();
        this.characterRenderer.drawCharacter(charCanvas, char, { showFinal: true });

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(charCanvas, startX, currentY, imageSize, imageSize);

        currentY += imageSize + gapImageName;

        // Draw Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = nameFont;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(nameText, startX, currentY);

        currentY += nameHeight + gapNameDesc;

        // Draw Description
        ctx.font = descFont;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textBaseline = 'top';

        const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
            const words = text.split(' ');
            let line = '';
            let curY = y;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, curY);
                    line = words[n] + ' ';
                    curY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, curY);
        };

        drawWrappedText(ctx, descText, startX, currentY, contentWidth, descLineHeight);

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
