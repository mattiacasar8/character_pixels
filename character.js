// Character Generator - Trapezoid-based system

class CharacterGenerator {
    constructor() {
        this.canvasSize = 50;
        this.centerX = this.canvasSize / 2;
        this.groundY = this.canvasSize - 2;
    }

    generate(params) {
        const bodyParts = this.generateBodyParts(params);
        const heatmap = this.generateHeatmap(bodyParts, params);
        const final = this.generatePixels(heatmap, params);
        
        return {
            bodyParts,
            heatmap,
            final,
            params
        };
    }

    randomParams() {
        return {
            // Torso (anchor) - moved higher
            torsoTopWidth: this.randomFloat(8, 16),
            torsoBottomWidth: this.randomFloat(6, 14),
            torsoHeight: this.randomFloat(12, 18), // Shorter
            torsoY: this.randomFloat(8, 12), // Higher up
            
            // Neck
            neckWidth: this.randomFloat(2, 5),
            neckHeight: this.randomFloat(2, 6),
            
            // Head
            headWidth: this.randomFloat(6, 12),
            headHeight: this.randomFloat(6, 12),
            
            // Arms
            upperArmTopWidth: this.randomFloat(2, 6),
            upperArmBottomWidth: this.randomFloat(1.5, 5),
            upperArmLength: this.randomFloat(8, 14),
            forearmTopWidth: this.randomFloat(1.5, 5),
            forearmBottomWidth: this.randomFloat(1, 4),
            forearmLength: this.randomFloat(8, 14),
            armAngle: this.randomFloat(-80, -10),
            elbowAngle: this.randomFloat(-70, 70),
            
            // Legs
            thighTopWidth: this.randomFloat(3, 8),
            thighBottomWidth: this.randomFloat(2, 6),
            thighLength: this.randomFloat(8, 14), // Shorter default
            shinTopWidth: this.randomFloat(2, 6),
            shinBottomWidth: this.randomFloat(1.5, 5),
            shinLength: this.randomFloat(10, 16),
            legAngle: this.randomFloat(-25, 0),
            
            // Generation
            fillDensity: this.randomFloat(0.7, 1.0),
            palette: this.generateRandomPalette()
        };
    }

    generateRandomPalette() {
        const numColors = this.randomInt(3, 5);
        const palette = [];
        for (let i = 0; i < numColors; i++) {
            palette.push({
                r: this.randomInt(50, 255),
                g: this.randomInt(50, 255),
                b: this.randomInt(50, 255)
            });
        }
        return palette;
    }

    generateBodyParts(params) {
        const parts = {};
        
        // 1. TORSO (anchor)
        const torsoTop = params.torsoY;
        const torsoBottom = torsoTop + params.torsoHeight;
        parts.torso = this.createTrapezoid(
            this.centerX, torsoTop,
            params.torsoTopWidth, params.torsoBottomWidth,
            params.torsoHeight,
            0
        );
        
        // 2. NECK
        parts.neck = this.createTrapezoid(
            this.centerX, torsoTop,
            params.neckWidth, params.neckWidth,
            -params.neckHeight,
            0
        );
        
        // 3. HEAD
        parts.head = this.createTrapezoid(
            this.centerX, torsoTop - params.neckHeight,
            params.headWidth, params.headWidth,
            -params.headHeight,
            0
        );
        
        // 4. LEFT ARM
        const leftShoulderX = this.centerX - params.torsoTopWidth / 2;
        
        parts.leftUpperArm = this.createTrapezoid(
            leftShoulderX, torsoTop,
            params.upperArmTopWidth, params.upperArmBottomWidth,
            params.upperArmLength,
            params.armAngle
        );
        
        const upperArmEnd = this.getTrapezoidBottom(parts.leftUpperArm);
        
        parts.leftForearm = this.createTrapezoid(
            upperArmEnd.x, upperArmEnd.y,
            params.forearmTopWidth, params.forearmBottomWidth,
            params.forearmLength,
            params.armAngle + params.elbowAngle
        );
        
        // 5. RIGHT ARM
        const rightShoulderX = this.centerX + params.torsoTopWidth / 2;
        
        parts.rightUpperArm = this.createTrapezoid(
            rightShoulderX, torsoTop,
            params.upperArmTopWidth, params.upperArmBottomWidth,
            params.upperArmLength,
            -params.armAngle
        );
        
        const rightUpperArmEnd = this.getTrapezoidBottom(parts.rightUpperArm);
        
        parts.rightForearm = this.createTrapezoid(
            rightUpperArmEnd.x, rightUpperArmEnd.y,
            params.forearmTopWidth, params.forearmBottomWidth,
            params.forearmLength,
            -params.armAngle - params.elbowAngle
        );
        
        // 6. LEFT LEG
        const leftHipX = this.centerX - params.torsoBottomWidth / 2;
        
        parts.leftThigh = this.createTrapezoid(
            leftHipX, torsoBottom,
            params.thighTopWidth, params.thighBottomWidth,
            params.thighLength,
            params.legAngle
        );
        
        const thighEnd = this.getTrapezoidBottom(parts.leftThigh);
        const remainingShinLength = this.groundY - thighEnd.y;
        
        parts.leftShin = this.createTrapezoid(
            thighEnd.x, thighEnd.y,
            params.shinTopWidth, params.shinBottomWidth,
            remainingShinLength,
            0
        );
        
        // 7. RIGHT LEG
        const rightHipX = this.centerX + params.torsoBottomWidth / 2;
        
        parts.rightThigh = this.createTrapezoid(
            rightHipX, torsoBottom,
            params.thighTopWidth, params.thighBottomWidth,
            params.thighLength,
            -params.legAngle
        );
        
        const rightThighEnd = this.getTrapezoidBottom(parts.rightThigh);
        const rightRemainingShinLength = this.groundY - rightThighEnd.y;
        
        parts.rightShin = this.createTrapezoid(
            rightThighEnd.x, rightThighEnd.y,
            params.shinTopWidth, params.shinBottomWidth,
            rightRemainingShinLength,
            0
        );
        
        return parts;
    }

    createTrapezoid(centerX, centerY, topWidth, bottomWidth, length, angleDeg) {
        const angleRad = (angleDeg * Math.PI) / 180;
        
        const topLeft = {
            x: centerX - topWidth / 2,
            y: centerY
        };
        const topRight = {
            x: centerX + topWidth / 2,
            y: centerY
        };
        
        const dx = Math.sin(angleRad) * length;
        const dy = Math.cos(angleRad) * length;
        
        const bottomCenter = {
            x: centerX + dx,
            y: centerY + dy
        };
        
        const bottomLeft = {
            x: bottomCenter.x - bottomWidth / 2,
            y: bottomCenter.y
        };
        const bottomRight = {
            x: bottomCenter.x + bottomWidth / 2,
            y: bottomCenter.y
        };
        
        return {
            type: 'trapezoid',
            points: [topLeft, topRight, bottomRight, bottomLeft],
            center: { x: centerX, y: centerY },
            bottomCenter: bottomCenter,
            topWidth,
            bottomWidth,
            length,
            angle: angleDeg
        };
    }

    getTrapezoidBottom(trap) {
        return trap.bottomCenter;
    }

    generateHeatmap(bodyParts, params) {
        const heatmap = Array(this.canvasSize).fill(0).map(() => 
            Array(this.canvasSize).fill(0)
        );
        
        Object.values(bodyParts).forEach(part => {
            this.fillHeatmapForTrapezoid(heatmap, part);
        });
        
        return heatmap;
    }

    fillHeatmapForTrapezoid(heatmap, trap) {
        // Get bounding box
        const xs = trap.points.map(p => p.x);
        const ys = trap.points.map(p => p.y);
        const minX = Math.max(0, Math.floor(Math.min(...xs)));
        const maxX = Math.min(this.canvasSize, Math.ceil(Math.max(...xs)));
        const minY = Math.max(0, Math.floor(Math.min(...ys)));
        const maxY = Math.min(this.canvasSize, Math.ceil(Math.max(...ys)));
        
        // Calculate the centroid of trapezoid
        const centroid = {
            x: trap.points.reduce((sum, p) => sum + p.x, 0) / trap.points.length,
            y: trap.points.reduce((sum, p) => sum + p.y, 0) / trap.points.length
        };
        
        // Calculate max distance from centroid to edges (for normalization)
        let maxDistFromCenter = 0;
        trap.points.forEach(p => {
            const d = this.distance(centroid, p);
            maxDistFromCenter = Math.max(maxDistFromCenter, d);
        });
        
        // Fill pixels ONLY inside trapezoid
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const point = { x, y };
                
                // Only fill if inside shape
                if (this.isPointInPolygon(point, trap.points)) {
                    // Distance from center of shape
                    const distFromCenter = this.distance(point, centroid);
                    
                    // Intensity: 1.0 at center, decays toward edges
                    const intensity = Math.max(0, 1 - (distFromCenter / maxDistFromCenter) * 0.5);
                    
                    heatmap[y][x] = Math.max(heatmap[y][x], intensity);
                }
            }
        }
    }

    isPointInPolygon(point, vertices) {
        let inside = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y;
            const xj = vertices[j].x, yj = vertices[j].y;
            
            const intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    pointToSegmentDistance(p, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const lengthSq = dx * dx + dy * dy;
        
        if (lengthSq === 0) return this.distance(p, a);
        
        let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        
        const closest = {
            x: a.x + t * dx,
            y: a.y + t * dy
        };
        
        return this.distance(p, closest);
    }

    distance(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    generatePixels(heatmap, params) {
        const pixels = Array(this.canvasSize).fill(0).map(() => 
            Array(this.canvasSize).fill(null)
        );
        
        const fillDensity = params.fillDensity || 0.8;
        
        // Generate left half, then mirror
        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < Math.floor(this.canvasSize / 2); x++) {
                const probability = heatmap[y][x];
                
                if (probability > 0.1 && Math.random() < probability * fillDensity) {
                    const color = params.palette[
                        Math.floor(Math.random() * params.palette.length)
                    ];
                    pixels[y][x] = color;
                    
                    const mirrorX = this.canvasSize - 1 - x;
                    pixels[y][mirrorX] = color;
                }
            }
        }
        
        this.removeIsolatedPixels(pixels);
        
        return pixels;
    }

    removeIsolatedPixels(pixels) {
        const toRemove = [];
        
        for (let y = 1; y < this.canvasSize - 1; y++) {
            for (let x = 1; x < this.canvasSize - 1; x++) {
                if (pixels[y][x]) {
                    let neighborCount = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            if (pixels[y + dy][x + dx]) neighborCount++;
                        }
                    }
                    
                    if (neighborCount < 2) {
                        toRemove.push({ x, y });
                    }
                }
            }
        }
        
        toRemove.forEach(({ x, y }) => {
            pixels[y][x] = null;
        });
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
}

const characterGenerator = new CharacterGenerator();
