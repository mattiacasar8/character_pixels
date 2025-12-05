/**
 * ExportManager
 * Handles all export functionality: spritesheet, card, strip, sequence, and ZIP exports.
 */
import { nameGenerator } from '../generators/name-generator.js';

export class ExportManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Export all characters as a single spritesheet PNG
     */
    exportSpritesheet() {
        if (this.app.characters.length === 0) {
            alert('No characters to export! Generate some first.');
            return;
        }

        // Calculate grid dimensions
        const cols = Math.ceil(Math.sqrt(this.app.characters.length));
        const rows = Math.ceil(this.app.characters.length / cols);

        const spriteSize = this.app.characterRenderer.displaySize;
        const totalWidth = cols * spriteSize;
        const totalHeight = rows * spriteSize;

        // Create spritesheet canvas
        const spritesheetCanvas = document.createElement('canvas');
        spritesheetCanvas.width = totalWidth;
        spritesheetCanvas.height = totalHeight;
        const ctx = spritesheetCanvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw each character
        this.app.characters.forEach((character, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * spriteSize;
            const y = row * spriteSize;

            const charCanvas = this.app.characterRenderer.createCanvas();
            this.app.characterRenderer.drawCharacter(charCanvas, character, { showFinal: true });
            ctx.drawImage(charCanvas, x, y);
        });

        // Download
        this._downloadCanvas(spritesheetCanvas, `spritesheet_${this.app.characters.length}_${Date.now()}.png`);
    }

    /**
     * Export current modal character as a card with name and backstory
     */
    exportCard() {
        const char = this.app.modalManager.currentCharacter;
        if (!char) return;

        // Design specs
        const paddingX = 165;
        const paddingY = 300;
        const contentWidth = 750;
        const gapImageName = 24;
        const gapNameDesc = 24;
        const imageSize = 750;

        // Fonts
        const nameFontSize = 96;
        const nameFont = `${nameFontSize}px "Instrument Serif", serif`;
        const descFontSize = 36;
        const descFont = `${descFontSize}px "Inter", sans-serif`;
        const descLineHeight = descFontSize * 1.4;

        // Text content
        const nameText = char.name;
        const descText = char.backstory || "Di Narril si sa poco. Qualcuno sostiene che non invecchi mai davvero.";

        // Calculate dimensions
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.font = nameFont;
        const nameHeight = nameFontSize;

        tempCtx.font = descFont;
        const descLineCount = this._countLines(tempCtx, descText, contentWidth);
        const descHeight = descLineCount * descLineHeight;

        const totalHeight = paddingY + imageSize + gapImageName + nameHeight + gapNameDesc + descHeight + paddingY;
        const totalWidth = paddingX + contentWidth + paddingX;

        // Create final canvas
        const canvas = document.createElement('canvas');
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw content
        let currentY = paddingY;
        const startX = paddingX;

        // Character sprite
        const charCanvas = this.app.characterRenderer.createCanvas();
        this.app.characterRenderer.drawCharacter(charCanvas, char, { showFinal: true });
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(charCanvas, startX, currentY, imageSize, imageSize);
        currentY += imageSize + gapImageName;

        // Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = nameFont;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(nameText, startX, currentY);
        currentY += nameHeight + gapNameDesc;

        // Description
        ctx.font = descFont;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textBaseline = 'top';
        this._drawWrappedText(ctx, descText, startX, currentY, contentWidth, descLineHeight);

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

    /**
     * Export current modal character as a 2-frame animation strip
     */
    exportStrip() {
        const char = this.app.modalManager.currentCharacter;
        if (!char) return;

        const numFrames = 2;
        const spriteSize = this.app.characterRenderer.displaySize;

        const canvas = document.createElement('canvas');
        canvas.width = spriteSize * numFrames;
        canvas.height = spriteSize;
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < numFrames; i++) {
            const frameCanvas = this.app.characterRenderer.createCanvas();
            this.app.characterRenderer.drawCharacter(frameCanvas, char, {
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

    /**
     * Export current modal character as a ZIP of individual frame PNGs
     */
    async exportSeq() {
        const char = this.app.modalManager.currentCharacter;
        if (!char) return;

        if (typeof JSZip === 'undefined') {
            alert('JSZip library not loaded.');
            return;
        }

        const zip = new JSZip();
        const numFrames = 2;

        const promises = [];
        for (let i = 0; i < numFrames; i++) {
            promises.push(new Promise(resolve => {
                const canvas = this.app.characterRenderer.createCanvas();
                this.app.characterRenderer.drawCharacter(canvas, char, {
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

    /**
     * Export all characters as a ZIP file with PNGs and backstory text files
     */
    async exportZip() {
        if (this.app.characters.length === 0) {
            alert('No characters to export! Generate some first.');
            return;
        }

        if (typeof JSZip === 'undefined') {
            alert('JSZip library not loaded. Please refresh the page.');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder("characters");

        const promises = this.app.characters.map((char) => {
            return new Promise((resolve) => {
                const canvas = this.app.characterRenderer.createCanvas();
                this.app.characterRenderer.drawCharacter(canvas, char, { showFinal: true });

                canvas.toBlob(blob => {
                    const filename = `${nameGenerator.generateUniqueFilename(char.name)}.png`;
                    folder.file(filename, blob);
                    if (char.backstory) {
                        folder.file(`${filename.replace('.png', '.txt')}`, char.backstory);
                    }
                    resolve();
                });
            });
        });

        await Promise.all(promises);

        const content = await zip.generateAsync({ type: "blob" });
        this._downloadBlob(content, `characters_${this.app.characters.length}_${Date.now()}.zip`);
    }

    // --- Helper Methods ---

    _downloadCanvas(canvas, filename) {
        canvas.toBlob((blob) => {
            this._downloadBlob(blob, filename);
        });
    }

    _downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }

    _countLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 1;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                line = words[n] + ' ';
                lineCount++;
            } else {
                line = testLine;
            }
        }
        return lineCount;
    }

    _drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let curY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, curY);
                line = words[n] + ' ';
                curY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, curY);
    }
}
