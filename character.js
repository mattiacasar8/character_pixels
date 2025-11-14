// Character Generator - Core Logic

class CharacterGenerator {
    constructor() {
        this.canvasSize = 50;
        this.centerX = this.canvasSize / 2;
    }

    // Generate a character from parameters
    generate(params) {
        const stickFigure = this.generateStickFigure(params);
        const thickened = this.applyThickness(stickFigure, params);
        const final = this.applySurfaceNoise(thickened, params);
        
        return {
            stickFigure,
            thickened,
            final,
            params
        };
    }

    // Generate random parameters
    randomParams() {
        return {
            headSize: this.randomInt(8, 20),
            bodyHeight: this.randomInt(12, 30),
            shoulderWidth: this.randomInt(8, 24),
            hipWidth: this.randomInt(6, 20),
            armLength: this.randomInt(10, 28),
            legLength: this.randomInt(12, 32),
            headThickness: this.randomFloat(1, 6),
            torsoThickness: this.randomFloat(1, 8),
            armThickness: this.randomFloat(1, 5),
            legThickness: this.randomFloat(1, 6)
        };
    }

    // Generate stick figure skeleton
    generateStickFigure(params) {
        const {
            headSize,
            bodyHeight,
            shoulderWidth,
            hipWidth,
            armLength,
            legLength
        } = params;

        // Calculate vertical positions (from top)
        const headRadius = headSize / 2;
        const headCenterY = headRadius + 2; // Small margin from top
        const neckY = headCenterY + headRadius;
        const shoulderY = neckY + 2;
        const hipY = shoulderY + bodyHeight;
        const footY = hipY + legLength;

        // Create skeleton points
        const skeleton = {
            head: {
                center: { x: this.centerX, y: headCenterY },
                radius: headRadius
            },
            neck: { x: this.centerX, y: neckY },
            shoulders: {
                left: { x: this.centerX - shoulderWidth / 2, y: shoulderY },
                right: { x: this.centerX + shoulderWidth / 2, y: shoulderY }
            },
            spine: [
                { x: this.centerX, y: shoulderY },
                { x: this.centerX, y: hipY }
            ],
            hips: {
                left: { x: this.centerX - hipWidth / 2, y: hipY },
                right: { x: this.centerX + hipWidth / 2, y: hipY }
            },
            arms: {
                left: [
                    { x: this.centerX - shoulderWidth / 2, y: shoulderY },
                    { x: this.centerX - shoulderWidth / 2, y: shoulderY + armLength }
                ],
                right: [
                    { x: this.centerX + shoulderWidth / 2, y: shoulderY },
                    { x: this.centerX + shoulderWidth / 2, y: shoulderY + armLength }
                ]
            },
            legs: {
                left: [
                    { x: this.centerX - hipWidth / 2, y: hipY },
                    { x: this.centerX - hipWidth / 2, y: footY }
                ],
                right: [
                    { x: this.centerX + hipWidth / 2, y: hipY },
                    { x: this.centerX + hipWidth / 2, y: footY }
                ]
            }
        };

        return skeleton;
    }

    // Apply thickness to stick figure - convert to shapes
    applyThickness(skeleton, params) {
        const shapes = {
            head: this.createCircle(skeleton.head.center, skeleton.head.radius),
            torso: this.createRectFromLine(
                skeleton.spine[0],
                skeleton.spine[1],
                params.torsoThickness
            ),
            armLeft: this.createRectFromLine(
                skeleton.arms.left[0],
                skeleton.arms.left[1],
                params.armThickness
            ),
            armRight: this.createRectFromLine(
                skeleton.arms.right[0],
                skeleton.arms.right[1],
                params.armThickness
            ),
            legLeft: this.createRectFromLine(
                skeleton.legs.left[0],
                skeleton.legs.left[1],
                params.legThickness
            ),
            legRight: this.createRectFromLine(
                skeleton.legs.right[0],
                skeleton.legs.right[1],
                params.legThickness
            )
        };

        return shapes;
    }

    // Create circle shape
    createCircle(center, radius) {
        return {
            type: 'circle',
            center: { ...center },
            radius: radius
        };
    }

    // Create rectangle from a line with thickness
    createRectFromLine(start, end, thickness) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Perpendicular offset for thickness
        const offsetX = Math.sin(angle) * thickness / 2;
        const offsetY = -Math.cos(angle) * thickness / 2;

        return {
            type: 'rect',
            points: [
                { x: start.x - offsetX, y: start.y - offsetY },
                { x: start.x + offsetX, y: start.y + offsetY },
                { x: end.x + offsetX, y: end.y + offsetY },
                { x: end.x - offsetX, y: end.y - offsetY }
            ]
        };
    }

    // Apply surface noise/texture (placeholder for now)
    applySurfaceNoise(shapes, params) {
        // For now, just return shapes
        // Later: add pixel-level noise, asymmetry, details
        return shapes;
    }

    // Utility functions
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// Export for use in other scripts
const characterGenerator = new CharacterGenerator();
