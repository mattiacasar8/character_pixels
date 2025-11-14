// Renderer - Draw trapezoid-based characters

class CharacterRenderer {
    constructor(scale = 3, canvasSize = 50) {
        this.scale = scale;
        this.canvasSize = canvasSize;
        this.displaySize = this.canvasSize * this.scale;
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this.displaySize;
        canvas.height = this.displaySize;
        return canvas;
    }

    drawCharacter(canvas, character, options = {}) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        const {
            showStickFigure = false,
            showThickness = false,
            showHeatmap = false,
            showFinal = true,
            showGrid = false
        } = options;

        // Clear
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, this.displaySize, this.displaySize);

        if (showGrid) this.drawGrid(ctx);
        if (showHeatmap) this.drawHeatmap(ctx, character.heatmap);
        if (showFinal) this.drawPixels(ctx, character.final);
        if (showThickness) this.drawBodyParts(ctx, character.bodyParts);
        if (showStickFigure) this.drawConnectionPoints(ctx, character.bodyParts);
    }

    drawGrid(ctx) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvasSize; i++) {
            const pos = i * this.scale;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.displaySize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.displaySize, pos);
            ctx.stroke();
        }
    }

    drawBodyParts(ctx, bodyParts) {
        ctx.fillStyle = 'rgba(74, 158, 255, 0.3)';
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.5)';
        ctx.lineWidth = 1;
        
        Object.values(bodyParts).forEach(part => {
            if (part.type === 'trapezoid') {
                this.drawTrapezoid(ctx, part);
            }
        });
    }

    drawTrapezoid(ctx, trap) {
        ctx.beginPath();
        ctx.moveTo(trap.points[0].x * this.scale, trap.points[0].y * this.scale);
        for (let i = 1; i < trap.points.length; i++) {
            ctx.lineTo(trap.points[i].x * this.scale, trap.points[i].y * this.scale);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawConnectionPoints(ctx, bodyParts) {
        ctx.fillStyle = '#ff6b6b';
        
        // Draw connection points (red dots)
        const points = [
            bodyParts.torso.center, // Torso center
            bodyParts.neck.center,
            bodyParts.neck.bottomCenter,
            bodyParts.head.bottomCenter,
            bodyParts.leftUpperArm.center,
            bodyParts.leftUpperArm.bottomCenter,
            bodyParts.leftForearm.bottomCenter,
            bodyParts.rightUpperArm.center,
            bodyParts.rightUpperArm.bottomCenter,
            bodyParts.rightForearm.bottomCenter,
            bodyParts.leftThigh.center,
            bodyParts.leftThigh.bottomCenter,
            bodyParts.leftShin.bottomCenter,
            bodyParts.rightThigh.center,
            bodyParts.rightThigh.bottomCenter,
            bodyParts.rightShin.bottomCenter
        ];
        
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(
                point.x * this.scale,
                point.y * this.scale,
                3, 0, Math.PI * 2
            );
            ctx.fill();
        });
        
        // Draw lines between connected parts
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 1;
        
        const connections = [
            [bodyParts.torso.center, bodyParts.neck.center],
            [bodyParts.neck.bottomCenter, bodyParts.head.center],
            [bodyParts.torso.center, bodyParts.leftUpperArm.center],
            [bodyParts.leftUpperArm.bottomCenter, bodyParts.leftForearm.center],
            [bodyParts.torso.center, bodyParts.rightUpperArm.center],
            [bodyParts.rightUpperArm.bottomCenter, bodyParts.rightForearm.center],
            [bodyParts.torso.bottomCenter, bodyParts.leftThigh.center],
            [bodyParts.leftThigh.bottomCenter, bodyParts.leftShin.center],
            [bodyParts.torso.bottomCenter, bodyParts.rightThigh.center],
            [bodyParts.rightThigh.bottomCenter, bodyParts.rightShin.center]
        ];
        
        connections.forEach(([p1, p2]) => {
            ctx.beginPath();
            ctx.moveTo(p1.x * this.scale, p1.y * this.scale);
            ctx.lineTo(p2.x * this.scale, p2.y * this.scale);
            ctx.stroke();
        });
    }

    drawHeatmap(ctx, heatmap) {
        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < this.canvasSize; x++) {
                const intensity = heatmap[y][x];
                if (intensity > 0) {
                    const r = 255;
                    const g = Math.floor(intensity * 255);
                    const b = 0;
                    const a = intensity * 0.6;
                    
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                    ctx.fillRect(
                        x * this.scale,
                        y * this.scale,
                        this.scale,
                        this.scale
                    );
                }
            }
        }
    }

    drawPixels(ctx, pixels) {
        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < this.canvasSize; x++) {
                const color = pixels[y][x];
                if (color) {
                    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                    ctx.fillRect(
                        x * this.scale,
                        y * this.scale,
                        this.scale,
                        this.scale
                    );
                }
            }
        }
    }
}

const characterRenderer = new CharacterRenderer(3);
