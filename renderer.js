// Renderer - Draw characters on canvas

class CharacterRenderer {
    constructor(scale = 3) {
        this.scale = scale; // Scale factor for display (50px -> 150px)
        this.canvasSize = 50;
        this.displaySize = this.canvasSize * this.scale;
    }

    // Create a new canvas element
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.displaySize;
        canvas.height = this.displaySize;
        return canvas;
    }

    // Draw character with all layers
    drawCharacter(canvas, character, options = {}) {
        const ctx = canvas.getContext('2d');
        const {
            showStickFigure = false,
            showThickness = false,
            showFinal = true,
            showGrid = false
        } = options;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, this.displaySize, this.displaySize);

        // Draw grid if enabled
        if (showGrid) {
            this.drawGrid(ctx);
        }

        // Draw layers based on options
        if (showStickFigure) {
            this.drawStickFigure(ctx, character.stickFigure);
        }

        if (showThickness) {
            this.drawThickened(ctx, character.thickened);
        }

        if (showFinal) {
            this.drawFinal(ctx, character.final);
        }
    }

    // Draw grid
    drawGrid(ctx) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= this.canvasSize; i++) {
            const pos = i * this.scale;
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.displaySize);
            ctx.stroke();
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.displaySize, pos);
            ctx.stroke();
        }
    }

    // Draw stick figure skeleton
    drawStickFigure(ctx, skeleton) {
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ff6b6b';

        // Draw head circle
        ctx.beginPath();
        ctx.arc(
            skeleton.head.center.x * this.scale,
            skeleton.head.center.y * this.scale,
            skeleton.head.radius * this.scale,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        // Draw spine
        this.drawLine(ctx, skeleton.spine[0], skeleton.spine[1]);

        // Draw arms
        this.drawLine(ctx, skeleton.arms.left[0], skeleton.arms.left[1]);
        this.drawLine(ctx, skeleton.arms.right[0], skeleton.arms.right[1]);

        // Draw legs
        this.drawLine(ctx, skeleton.legs.left[0], skeleton.legs.left[1]);
        this.drawLine(ctx, skeleton.legs.right[0], skeleton.legs.right[1]);

        // Draw shoulder line
        this.drawLine(ctx, skeleton.shoulders.left, skeleton.shoulders.right);

        // Draw hip line
        this.drawLine(ctx, skeleton.hips.left, skeleton.hips.right);
    }

    // Draw thickened shapes
    drawThickened(ctx, shapes) {
        ctx.fillStyle = '#4a9eff';
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 1;

        // Draw all shapes
        Object.values(shapes).forEach(shape => {
            if (shape.type === 'circle') {
                ctx.beginPath();
                ctx.arc(
                    shape.center.x * this.scale,
                    shape.center.y * this.scale,
                    shape.radius * this.scale,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else if (shape.type === 'rect') {
                ctx.beginPath();
                ctx.moveTo(
                    shape.points[0].x * this.scale,
                    shape.points[0].y * this.scale
                );
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(
                        shape.points[i].x * this.scale,
                        shape.points[i].y * this.scale
                    );
                }
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    // Draw final pixelated version
    drawFinal(ctx, final) {
        // For now, same as thickened
        // Later: add pixel snapping, noise, etc
        ctx.fillStyle = '#6bff6b';
        ctx.strokeStyle = '#6bff6b';
        ctx.lineWidth = 1;

        Object.values(final).forEach(shape => {
            if (shape.type === 'circle') {
                ctx.beginPath();
                ctx.arc(
                    shape.center.x * this.scale,
                    shape.center.y * this.scale,
                    shape.radius * this.scale,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else if (shape.type === 'rect') {
                ctx.beginPath();
                ctx.moveTo(
                    shape.points[0].x * this.scale,
                    shape.points[0].y * this.scale
                );
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(
                        shape.points[i].x * this.scale,
                        shape.points[i].y * this.scale
                    );
                }
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    // Helper: draw line between two points
    drawLine(ctx, start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x * this.scale, start.y * this.scale);
        ctx.lineTo(end.x * this.scale, end.y * this.scale);
        ctx.stroke();
    }
}

// Export renderer instance
const characterRenderer = new CharacterRenderer(3);
