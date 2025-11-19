// Character Generator - Trapezoid-based system

// Fantasy Color Palettes
const FANTASY_PALETTES = [
    // Gameboy
    [{ r: 15, g: 56, b: 15 }, { r: 48, g: 98, b: 48 }, { r: 139, g: 172, b: 15 }, { r: 155, g: 188, b: 15 }],
    // NES
    [{ r: 124, g: 124, b: 124 }, { r: 0, g: 0, b: 252 }, { r: 0, g: 0, b: 188 }, { r: 68, g: 40, b: 188 }],
    // Pico8
    [{ r: 29, g: 43, b: 83 }, { r: 126, g: 37, b: 83 }, { r: 0, g: 135, b: 81 }, { r: 171, g: 82, b: 54 }],
    // Sepia/RPG
    [{ r: 75, g: 61, b: 68 }, { r: 139, g: 109, b: 156 }, { r: 198, g: 159, b: 165 }, { r: 242, g: 211, b: 171 }],
    // Forest
    [{ r: 34, g: 49, b: 28 }, { r: 74, g: 105, b: 48 }, { r: 134, g: 170, b: 84 }, { r: 194, g: 214, b: 156 }],
    // Desert
    [{ r: 88, g: 48, b: 35 }, { r: 150, g: 91, b: 64 }, { r: 204, g: 142, b: 91 }, { r: 235, g: 205, b: 158 }],
    // Ice
    [{ r: 25, g: 60, b: 88 }, { r: 61, g: 135, b: 177 }, { r: 127, g: 198, b: 222 }, { r: 206, g: 237, b: 245 }],
    // Fire
    [{ r: 66, g: 16, b: 8 }, { r: 131, g: 44, b: 19 }, { r: 212, g: 73, b: 34 }, { r: 243, g: 143, b: 66 }],
    // Arcane
    [{ r: 50, g: 26, b: 81 }, { r: 110, g: 61, b: 139 }, { r: 168, g: 111, b: 193 }, { r: 211, g: 172, b: 230 }],
    // Undead
    [{ r: 38, g: 43, b: 35 }, { r: 72, g: 91, b: 70 }, { r: 133, g: 155, b: 129 }, { r: 178, g: 191, b: 175 }]
];

// Fantasy Name Generator
class NameGenerator {
    constructor() {
        this.prefixes = ['Aer', 'Bal', 'Cael', 'Dor', 'El', 'Fen', 'Gal', 'Hro', 'Ior', 'Kor', 'Lun', 'Mor', 'Nar', 'Oro', 'Pel', 'Quin', 'Ral', 'Syl', 'Thal', 'Ur', 'Val', 'Wyn', 'Xal', 'Yor', 'Zeph'];
        this.suffixes = ['th', 'mar', 'ion', 'or', 'is', 'wen', 'gard', 'mir', 'dor', 'wyn', 'ak', 'ius', 'eon', 'ara', 'iel'];
        this.titles = ['the Brave', 'Sun-shield', 'Storm-walker', 'Shadow-blade', 'Fire-heart', 'Ice-born', 'Sky-seeker', 'Stone-hand', 'Swift-foot', 'Iron-will', 'Moon-eye', 'Star-touched', 'Dawn-bringer', 'Night-walker', 'Wind-rider'];
    }

    generate() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const name = prefix + suffix;

        // 30% chance to add a title
        if (Math.random() < 0.3) {
            const title = this.titles[Math.floor(Math.random() * this.titles.length)];
            return `${name} ${title}`;
        }

        return name;
    }
}

const nameGenerator = new NameGenerator();

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
        const name = nameGenerator.generate();

        return {
            bodyParts,
            heatmap,
            final,
            params,
            name
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
        // 70% chance to use preset palette, 30% chance for random
        if (Math.random() < 0.7) {
            // Use a fantasy palette
            const paletteIndex = Math.floor(Math.random() * FANTASY_PALETTES.length);
            return [...FANTASY_PALETTES[paletteIndex]]; // Return a copy
        } else {
            // Generate random palette
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

        // 8. JOINTS (circles at articulation points)
        parts.leftElbow = this.createJoint(parts.leftUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.rightElbow = this.createJoint(parts.rightUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.leftKnee = this.createJoint(parts.leftThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.rightKnee = this.createJoint(parts.rightThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.leftShoulder = this.createJoint(parts.leftUpperArm.center, scaledParams.upperArmTopWidth / 2);
        parts.rightShoulder = this.createJoint(parts.rightUpperArm.center, scaledParams.upperArmTopWidth / 2);

        // 9. HANDS (small trapezoids at forearm ends)
        const leftHandStart = parts.leftForearm.bottomCenter;
        const leftHandAngle = scaledParams.armAngle + scaledParams.elbowAngle;
        parts.leftHand = this.createTrapezoid(
            leftHandStart.x, leftHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            leftHandAngle
        );

        const rightHandStart = parts.rightForearm.bottomCenter;
        const rightHandAngle = -scaledParams.armAngle - scaledParams.elbowAngle;
        parts.rightHand = this.createTrapezoid(
            rightHandStart.x, rightHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            rightHandAngle
        );

        // 10. FEET (small trapezoids at shin ends)
        const leftFootStart = parts.leftShin.bottomCenter;
        parts.leftFoot = this.createTrapezoid(
            leftFootStart.x, leftFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        const rightFootStart = parts.rightShin.bottomCenter;
        parts.rightFoot = this.createTrapezoid(
            rightFootStart.x, rightFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        return parts;
    }

    createJoint(center, radius) {
        return {
            type: 'circle',
            center: center,
            radius: radius
        };
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
            if (part.type === 'circle') {
                this.fillHeatmapForCircle(heatmap, part);
            } else {
                this.fillHeatmapForTrapezoid(heatmap, part);
            }
        });

        return heatmap;
    }

    fillHeatmapForCircle(heatmap, circle) {
        const { center, radius } = circle;
        const minX = Math.max(0, Math.floor(center.x - radius));
        const maxX = Math.min(this.canvasSize, Math.ceil(center.x + radius));
        const minY = Math.max(0, Math.floor(center.y - radius));
        const maxY = Math.min(this.canvasSize, Math.ceil(center.y + radius));

        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const dx = x - center.x;
                const dy = y - center.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= radius) {
                    const intensity = Math.max(0, 1 - (dist / radius) * 0.3);
                    heatmap[y][x] = Math.max(heatmap[y][x], intensity);
                }
            }
        }
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

        // Apply smoothing if enabled
        if (params.enableSmoothing !== false) {
            this.applySmoothing(pixels, params.palette);
        }

        // Apply outline if enabled
        if (params.showOutline !== false) {
            this.applyOutline(pixels, params.palette);
        }

        return pixels;
    }

    applySmoothing(pixels, palette) {
        // Cellular automata: fill empty cells surrounded by many filled neighbors
        const toFill = [];

        for (let y = 1; y < this.canvasSize - 1; y++) {
            for (let x = 1; x < this.canvasSize - 1; x++) {
                if (pixels[y][x] === null) {
                    // Count filled neighbors (Moore neighborhood - 8 cells)
                    let filledCount = 0;
                    const neighborColors = [];

                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            if (pixels[y + dy][x + dx]) {
                                filledCount++;
                                neighborColors.push(pixels[y + dy][x + dx]);
                            }
                        }
                    }

                    // Fill if more than 4 neighbors are filled
                    if (filledCount > 4) {
                        // Use the most common neighbor color
                        const color = this.getMostCommonColor(neighborColors) || palette[0];
                        toFill.push({ x, y, color });
                    }
                }
            }
        }

        // Apply fills
        toFill.forEach(({ x, y, color }) => {
            pixels[y][x] = color;
        });
    }

    applyOutline(pixels, palette) {
        // Add dark outline around sprites
        const outlineColor = { r: 20, g: 20, b: 20 }; // Dark outline
        const toOutline = [];

        for (let y = 1; y < this.canvasSize - 1; y++) {
            for (let x = 1; x < this.canvasSize - 1; x++) {
                if (pixels[y][x] !== null) {
                    // Check orthogonal neighbors (up, down, left, right)
                    const neighbors = [
                        { dy: -1, dx: 0 }, // up
                        { dy: 1, dx: 0 },  // down
                        { dy: 0, dx: -1 }, // left
                        { dy: 0, dx: 1 }   // right
                    ];

                    neighbors.forEach(({ dy, dx }) => {
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && ny < this.canvasSize && nx >= 0 && nx < this.canvasSize) {
                            if (pixels[ny][nx] === null) {
                                toOutline.push({ x: nx, y: ny });
                            }
                        }
                    });
                }
            }
        }

        // Apply outline (don't overwrite existing pixels)
        toOutline.forEach(({ x, y }) => {
            if (pixels[y][x] === null) {
                pixels[y][x] = outlineColor;
            }
        });
    }

    getMostCommonColor(colors) {
        if (colors.length === 0) return null;

        // Simple frequency count
        const colorMap = new Map();
        colors.forEach(color => {
            const key = `${color.r},${color.g},${color.b}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        });

        let maxCount = 0;
        let mostCommon = colors[0];
        colorMap.forEach((count, key) => {
            if (count > maxCount) {
                maxCount = count;
                const [r, g, b] = key.split(',').map(Number);
                mostCommon = { r, g, b };
            }
        });

        return mostCommon;
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
