// Character Generator - Trapezoid-based system

class CharacterGenerator {
    constructor(canvasSize = 50) {
        this.canvasSize = canvasSize;
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
        return this.randomParamsInRange('standard');
    }

    randomParamsInRange(preset = 'standard') {
        const ranges = this.getParamRanges(preset);

        return {
            // Torso (anchor)
            torsoTopWidth: this.randomFloat(ranges.torsoTopWidth.min, ranges.torsoTopWidth.max),
            torsoBottomWidth: this.randomFloat(ranges.torsoBottomWidth.min, ranges.torsoBottomWidth.max),
            torsoHeight: this.randomFloat(ranges.torsoHeight.min, ranges.torsoHeight.max),
            torsoY: this.randomFloat(ranges.torsoY.min, ranges.torsoY.max),

            // Neck
            neckWidth: this.randomFloat(ranges.neckWidth.min, ranges.neckWidth.max),
            neckHeight: this.randomFloat(ranges.neckHeight.min, ranges.neckHeight.max),

            // Head
            headWidth: this.randomFloat(ranges.headWidth.min, ranges.headWidth.max),
            headHeight: this.randomFloat(ranges.headHeight.min, ranges.headHeight.max),

            // Arms
            upperArmTopWidth: this.randomFloat(ranges.upperArmTopWidth.min, ranges.upperArmTopWidth.max),
            upperArmBottomWidth: this.randomFloat(ranges.upperArmBottomWidth.min, ranges.upperArmBottomWidth.max),
            upperArmLength: this.randomFloat(ranges.upperArmLength.min, ranges.upperArmLength.max),
            forearmTopWidth: this.randomFloat(ranges.forearmTopWidth.min, ranges.forearmTopWidth.max),
            forearmBottomWidth: this.randomFloat(ranges.forearmBottomWidth.min, ranges.forearmBottomWidth.max),
            forearmLength: this.randomFloat(ranges.forearmLength.min, ranges.forearmLength.max),
            armAngle: this.randomFloat(ranges.armAngle.min, ranges.armAngle.max),
            elbowAngle: this.randomFloat(ranges.elbowAngle.min, ranges.elbowAngle.max),

            // Legs
            thighTopWidth: this.randomFloat(ranges.thighTopWidth.min, ranges.thighTopWidth.max),
            thighBottomWidth: this.randomFloat(ranges.thighBottomWidth.min, ranges.thighBottomWidth.max),
            thighLength: this.randomFloat(ranges.thighLength.min, ranges.thighLength.max),
            shinTopWidth: this.randomFloat(ranges.shinTopWidth.min, ranges.shinTopWidth.max),
            shinBottomWidth: this.randomFloat(ranges.shinBottomWidth.min, ranges.shinBottomWidth.max),
            shinLength: this.randomFloat(ranges.shinLength.min, ranges.shinLength.max),
            legAngle: this.randomFloat(ranges.legAngle.min, ranges.legAngle.max),

            // Generation
            fillDensity: this.randomFloat(ranges.fillDensity.min, ranges.fillDensity.max),
            palette: this.generateRandomPalette()
        };
    }

    getParamRanges(preset) {
        // All size parameters are now in % of canvas size
        const baseRanges = {
            torsoTopWidth: { min: 16, max: 32 },
            torsoBottomWidth: { min: 12, max: 28 },
            torsoHeight: { min: 24, max: 36 },
            torsoY: { min: 16, max: 24 },
            neckWidth: { min: 4, max: 10 },
            neckHeight: { min: 4, max: 12 },
            headWidth: { min: 12, max: 24 },
            headHeight: { min: 12, max: 24 },
            upperArmTopWidth: { min: 4, max: 12 },
            upperArmBottomWidth: { min: 3, max: 10 },
            upperArmLength: { min: 16, max: 28 },
            forearmTopWidth: { min: 3, max: 10 },
            forearmBottomWidth: { min: 2, max: 8 },
            forearmLength: { min: 16, max: 28 },
            armAngle: { min: -80, max: -10 },
            elbowAngle: { min: -70, max: 70 },
            thighTopWidth: { min: 6, max: 16 },
            thighBottomWidth: { min: 4, max: 12 },
            thighLength: { min: 16, max: 28 },
            shinTopWidth: { min: 4, max: 12 },
            shinBottomWidth: { min: 3, max: 10 },
            shinLength: { min: 20, max: 32 },
            legAngle: { min: -25, max: 0 },
            fillDensity: { min: 0.7, max: 1.0 }
        };

        switch (preset) {
            case 'short':
                // Personaggi bassi - torso e gambe più corti
                return {
                    ...baseRanges,
                    torsoHeight: { min: 24, max: 30 },
                    torsoY: { min: 24, max: 32 },
                    thighLength: { min: 12, max: 20 },
                    shinLength: { min: 16, max: 24 }
                };

            case 'tall':
                // Personaggi alti - torso e gambe più lunghi
                return {
                    ...baseRanges,
                    torsoHeight: { min: 32, max: 44 },
                    torsoY: { min: 12, max: 20 },
                    thighLength: { min: 24, max: 36 },
                    shinLength: { min: 28, max: 40 },
                    upperArmLength: { min: 24, max: 36 },
                    forearmLength: { min: 24, max: 36 }
                };

            case 'thin':
                // Personaggi magri - parti del corpo più strette
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 12, max: 20 },
                    torsoBottomWidth: { min: 10, max: 18 },
                    upperArmTopWidth: { min: 3, max: 6 },
                    forearmTopWidth: { min: 2, max: 5 },
                    thighTopWidth: { min: 4, max: 8 },
                    shinTopWidth: { min: 3, max: 6 }
                };

            case 'bulky':
                // Personaggi robusti - parti del corpo più larghe
                return {
                    ...baseRanges,
                    torsoTopWidth: { min: 24, max: 36 },
                    torsoBottomWidth: { min: 20, max: 32 },
                    upperArmTopWidth: { min: 8, max: 16 },
                    forearmTopWidth: { min: 6, max: 12 },
                    thighTopWidth: { min: 10, max: 20 },
                    shinTopWidth: { min: 8, max: 16 },
                    headWidth: { min: 16, max: 28 }
                };

            case 'standard':
            default:
                return baseRanges;
        }
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

    scaleParams(params, scale) {
        // Scale all size parameters from percentage to pixels
        return {
            torsoTopWidth: params.torsoTopWidth * scale,
            torsoBottomWidth: params.torsoBottomWidth * scale,
            torsoHeight: params.torsoHeight * scale,
            torsoY: params.torsoY * scale,
            neckWidth: params.neckWidth * scale,
            neckHeight: params.neckHeight * scale,
            headWidth: params.headWidth * scale,
            headHeight: params.headHeight * scale,
            upperArmTopWidth: params.upperArmTopWidth * scale,
            upperArmBottomWidth: params.upperArmBottomWidth * scale,
            upperArmLength: params.upperArmLength * scale,
            forearmTopWidth: params.forearmTopWidth * scale,
            forearmBottomWidth: params.forearmBottomWidth * scale,
            forearmLength: params.forearmLength * scale,
            armAngle: params.armAngle, // angles stay the same
            elbowAngle: params.elbowAngle, // angles stay the same
            thighTopWidth: params.thighTopWidth * scale,
            thighBottomWidth: params.thighBottomWidth * scale,
            thighLength: params.thighLength * scale,
            shinTopWidth: params.shinTopWidth * scale,
            shinBottomWidth: params.shinBottomWidth * scale,
            shinLength: params.shinLength * scale,
            legAngle: params.legAngle, // angles stay the same
            fillDensity: params.fillDensity, // density stays the same
            palette: params.palette
        };
    }

    generateBodyParts(params) {
        const parts = {};

        // Convert percentage-based params to pixels
        const scale = this.canvasSize / 100;
        const scaledParams = this.scaleParams(params, scale);

        // 1. TORSO (anchor)
        const torsoTop = scaledParams.torsoY;
        const torsoBottom = torsoTop + scaledParams.torsoHeight;
        parts.torso = this.createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.torsoTopWidth, scaledParams.torsoBottomWidth,
            scaledParams.torsoHeight,
            0
        );
        
        // 2. NECK
        parts.neck = this.createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.neckWidth, scaledParams.neckWidth,
            -scaledParams.neckHeight,
            0
        );

        // 3. HEAD
        parts.head = this.createTrapezoid(
            this.centerX, torsoTop - scaledParams.neckHeight,
            scaledParams.headWidth, scaledParams.headWidth,
            -scaledParams.headHeight,
            0
        );

        // 4. LEFT ARM
        const leftShoulderX = this.centerX - scaledParams.torsoTopWidth / 2;

        parts.leftUpperArm = this.createTrapezoid(
            leftShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            scaledParams.armAngle
        );

        const upperArmEnd = this.getTrapezoidBottom(parts.leftUpperArm);

        parts.leftForearm = this.createTrapezoid(
            upperArmEnd.x, upperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            scaledParams.armAngle + scaledParams.elbowAngle
        );

        // 5. RIGHT ARM
        const rightShoulderX = this.centerX + scaledParams.torsoTopWidth / 2;

        parts.rightUpperArm = this.createTrapezoid(
            rightShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            -scaledParams.armAngle
        );

        const rightUpperArmEnd = this.getTrapezoidBottom(parts.rightUpperArm);

        parts.rightForearm = this.createTrapezoid(
            rightUpperArmEnd.x, rightUpperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            -scaledParams.armAngle - scaledParams.elbowAngle
        );

        // 6. LEFT LEG
        const leftHipX = this.centerX - scaledParams.torsoBottomWidth / 2;

        parts.leftThigh = this.createTrapezoid(
            leftHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            scaledParams.legAngle
        );

        const thighEnd = this.getTrapezoidBottom(parts.leftThigh);
        const remainingShinLength = this.groundY - thighEnd.y;

        parts.leftShin = this.createTrapezoid(
            thighEnd.x, thighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            remainingShinLength,
            0
        );

        // 7. RIGHT LEG
        const rightHipX = this.centerX + scaledParams.torsoBottomWidth / 2;

        parts.rightThigh = this.createTrapezoid(
            rightHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            -scaledParams.legAngle
        );

        const rightThighEnd = this.getTrapezoidBottom(parts.rightThigh);
        const rightRemainingShinLength = this.groundY - rightThighEnd.y;

        parts.rightShin = this.createTrapezoid(
            rightThighEnd.x, rightThighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
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
