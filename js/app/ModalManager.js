/**
 * ModalManager
 * Handles the backstory modal display, animation, and navigation.
 */
export class ModalManager {
    constructor(app) {
        this.app = app;
        this.currentModalCharacter = null;
        this.currentModalIndex = 0;
        this.isAnimating = false;
        this.animationFrame = 0;
        this.animationDirection = 1;
        this.animationInterval = null;
    }

    setup() {
        const modal = document.getElementById('backstoryModal');
        const closeBtn = modal.querySelector('.close-modal');

        // Navigation controls
        document.getElementById('prevChar').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextChar').addEventListener('click', () => this.navigate(1));
        document.getElementById('toggleAnimation').addEventListener('click', () => this.toggleAnimation());

        // Export buttons in modal
        document.getElementById('exportModalCard').addEventListener('click', () => this.app.exportManager.exportCard());
        document.getElementById('exportModalStrip').addEventListener('click', () => this.app.exportManager.exportStrip());
        document.getElementById('exportModalSeq').addEventListener('click', () => this.app.exportManager.exportSeq());

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

    show(character) {
        const modal = document.getElementById('backstoryModal');
        this.currentModalCharacter = character;
        this.currentModalIndex = this.app.characters.indexOf(character);

        // Reset animation state
        this.isAnimating = true;
        this.animationFrame = 0;
        this.animationDirection = 1;

        this.updateContent();
        modal.style.display = "flex";
        this.startAnimation();
    }

    updateContent() {
        const character = this.currentModalCharacter;
        if (!character) return;

        document.getElementById('modalTitle').textContent = character.name;
        document.getElementById('modalBody').innerHTML = character.backstory || "Nessuna storia disponibile.";

        // Update Play/Pause button
        const btn = document.getElementById('toggleAnimation');
        btn.textContent = this.isAnimating ? "⏸" : "▶";

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

    // Getter for current character (used by export functions)
    get currentCharacter() {
        return this.currentModalCharacter;
    }
}
