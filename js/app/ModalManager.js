/**
 * ModalManager
 * Handles the backstory modal display, animation, navigation, music preview, and video export.
 */
import { generateMusic } from '../audio/music-generator.js';
import { createSynths, schedulePlayback } from '../audio/browser/tone-adapter.js';

export class ModalManager {
    constructor(app) {
        this.app = app;
        this.currentModalCharacter = null;
        this.currentModalIndex = 0;
        this.isAnimating = false;
        this.animationFrame = 0;
        this.animationDirection = 1;
        this.animationInterval = null;

        // Music state
        this.musicPlayback = null;
        this.musicSynths = null;
        this.isMusicPlaying = false;
    }

    setup() {
        const modal = document.getElementById('backstoryModal');
        const closeBtn = modal.querySelector('.close-modal');

        // Navigation controls
        document.getElementById('prevChar').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextChar').addEventListener('click', () => this.navigate(1));
        document.getElementById('toggleAnimation').addEventListener('click', () => this.toggleAnimation());

        // Music control
        document.getElementById('toggleMusic').addEventListener('click', () => this.toggleMusic());

        // Export buttons in modal
        document.getElementById('exportModalCard').addEventListener('click', () => this.app.exportManager.exportCard());
        document.getElementById('exportModalStrip').addEventListener('click', () => this.app.exportManager.exportStrip());
        document.getElementById('exportModalSeq').addEventListener('click', () => this.app.exportManager.exportSeq());
        document.getElementById('exportModalVideo').addEventListener('click', () => {
            if (this.app.videoExportManager && this.currentModalCharacter) {
                this.app.videoExportManager.exportVideo(this.currentModalCharacter);
            }
        });

        // Close logic
        const closeModal = () => {
            modal.style.display = "none";
            this.stopAnimation();
            this.stopMusic();
        };

        if (closeBtn) closeBtn.onclick = closeModal;
        window.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    show(character) {
        const modal = document.getElementById('backstoryModal');
        this.currentModalCharacter = character;
        this.currentModalIndex = this.app.characters.indexOf(character);

        // Generate animation frames on-demand if not already cached
        if (!character.animationFrames) {
            character.animationFrames = this.app.currentGenerator.generateAnimationFrames(character.params);
        }

        // Reset animation state
        this.isAnimating = true;
        this.animationFrame = 0;
        this.animationDirection = 1;

        // Stop any playing music from previous character
        this.stopMusic();

        this.updateContent();
        modal.style.display = "flex";
        this.startAnimation();
    }

    updateContent() {
        const character = this.currentModalCharacter;
        if (!character) return;

        document.getElementById('modalTitle').textContent = character.name;
        document.getElementById('modalBody').innerHTML = character.backstory || (this.app.lang === 'eng' ? 'No story available.' : 'Nessuna storia disponibile.');

        // Update Play/Pause button
        const btn = document.getElementById('toggleAnimation');
        btn.textContent = this.isAnimating ? "⏸" : "▶";

        // Update music button
        const musicBtn = document.getElementById('toggleMusic');
        if (musicBtn) {
            musicBtn.textContent = this.isMusicPlaying ? "⏹" : "\u266B";
            musicBtn.title = this.isMusicPlaying ? "Stop Music" : "Play Music";
        }

        this.renderCanvas();
    }

    renderCanvas() {
        const modalImgContainer = document.querySelector('.modal-image-container');
        modalImgContainer.innerHTML = '';

        const canvas = this.app.characterRenderer.createCanvas();
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.imageRendering = 'pixelated';

        // Draw with current animation frame
        this.app.characterRenderer.drawCharacter(canvas, this.currentModalCharacter, {
            ...this.app.displayOptions,
            showFinal: true,
            frameIndex: this.animationFrame
        });

        modalImgContainer.appendChild(canvas);
    }

    navigate(direction) {
        if (this.app.characters.length === 0) return;

        this.currentModalIndex += direction;

        // Loop around
        if (this.currentModalIndex >= this.app.characters.length) this.currentModalIndex = 0;
        if (this.currentModalIndex < 0) this.currentModalIndex = this.app.characters.length - 1;

        this.currentModalCharacter = this.app.characters[this.currentModalIndex];

        // Generate animation frames on-demand if not cached
        if (!this.currentModalCharacter.animationFrames) {
            this.currentModalCharacter.animationFrames = this.app.currentGenerator.generateAnimationFrames(this.currentModalCharacter.params);
        }

        // Stop music when navigating to a different character
        this.stopMusic();

        this.updateContent();
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        this.updateContent();
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

            this.renderCanvas();
        }, 300);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    // --- Music Preview ---

    async toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopMusic();
        } else {
            await this.startMusic();
        }
        this.updateContent();
    }

    async startMusic() {
        const character = this.currentModalCharacter;
        if (!character) return;

        // Check Tone.js availability
        if (typeof Tone === 'undefined') {
            console.error('Tone.js not loaded.');
            return;
        }

        try {
            // Generate music data from character seed
            const { params, sequences, totalDuration } = generateMusic(character.params.seed);

            // Create synths and schedule playback
            this.musicSynths = createSynths(params);
            this.musicPlayback = schedulePlayback(sequences, this.musicSynths, params.bpm, totalDuration);

            await this.musicPlayback.start();
            this.isMusicPlaying = true;
        } catch (err) {
            console.error('Failed to start music preview:', err);
            this.stopMusic();
        }
    }

    stopMusic() {
        if (this.musicPlayback) {
            this.musicPlayback.dispose();
            this.musicPlayback = null;
        }
        if (this.musicSynths) {
            this.musicSynths.dispose();
            this.musicSynths = null;
        }
        this.isMusicPlaying = false;
    }

    /**
     * Hide the modal programmatically
     */
    hide() {
        const modal = document.getElementById('backstoryModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.stopAnimation();
        this.stopMusic();
    }


    // Getter for current character (used by export functions)
    get currentCharacter() {
        return this.currentModalCharacter;
    }
}
