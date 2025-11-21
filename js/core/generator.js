// Character Generator
import { createTrapezoid, createJoint, getTrapezoidBottom, isPointInPolygon, distance } from '../utils/math.js';
import { randomFloat, randomInt, generateRandomPalette } from '../utils/random.js';
import { nameGenerator } from '../utils/name-generator.js';
import { PARAM_CONFIG } from '../config.js';

export class CharacterGenerator {
    constructor(canvasSize = 50) {
        this.canvasSize = canvasSize;
        this.centerX = this.canvasSize / 2;
        this.groundY = this.canvasSize - 2;
    }

    generate(params) {
        const bodyParts = this.generateBodyParts(params);
        const heatmap = this.generateHeatmap(bodyParts, params);
        // 7. Generate Pixels
        let pixels = this.generatePixels(heatmap, params);

        // Store raw pixels for reprocessing (before smoothing/outline)
        // We need to clone it because applySmoothing/Outline mutates the array
        const rawPixels = pixels.map(row => [...row]);

        this.removeIsolatedPixels(pixels);

        // Apply smoothing if enabled
        if (params.enableSmoothing) {
            this.applySmoothing(pixels, params.palette);
        }

        // Apply outline if enabled
        if (params.showOutline) {
            this.applyOutline(pixels, params.palette);
        }

        const name = nameGenerator.generate();

        return {
            bodyParts,
            heatmap,
            pixels,
            rawPixels, // Export raw pixels
            name,
            params // Store params used
        };
    }

    reprocess(character, newParams) {
        // Restore from raw pixels
        // Clone again to avoid mutating the stored rawPixels
        const pixels = character.rawPixels.map(row => [...row]);

        this.removeIsolatedPixels(pixels);

        if (newParams.enableSmoothing) {
            this.applySmoothing(pixels, character.params.palette);
        }

        if (newParams.showOutline) {
            this.applyOutline(pixels, character.params.palette);
        }

        // Update character
        character.pixels = pixels;
        return character;
    }

    // Resolve range objects {min, max} to random values
    resolveParams(rangeParams) {
        const resolved = {};

        Object.keys(rangeParams).forEach(key => {
            const value = rangeParams[key];

            // If it's a range object, resolve to random value
            if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
                resolved[key] = randomFloat(value.min, value.max);
            } else {
                // Otherwise keep the value as-is (e.g., boolean flags, torsoY)
                resolved[key] = value;
            }
        });

        // Add derived values that depend on resolved values
        if (resolved.torsoTopWidth) {
            resolved.upperArmBottomWidth = resolved.upperArmTopWidth * 0.8;
            resolved.forearmBottomWidth = resolved.forearmTopWidth * 0.7;
            resolved.forearmLength = resolved.upperArmLength;
            resolved.headHeight = resolved.headWidth;
            resolved.thighBottomWidth = resolved.thighTopWidth * 0.8;
            resolved.shinBottomWidth = resolved.shinTopWidth * 0.8;
            resolved.shinLength = 24; // Fixed at 24%
        }

        return resolved;
    }

    randomParams() {
        return this.randomParamsInRange('standard');
    }

    randomParamsInRange(preset = 'standard') {
        const ranges = this.getParamRanges(preset);

        return {
            // Torso (anchor)
            torsoTopWidth: randomFloat(ranges.torsoTopWidth.min, ranges.torsoTopWidth.max),
            torsoBottomWidth: randomFloat(ranges.torsoBottomWidth.min, ranges.torsoBottomWidth.max),
            torsoHeight: randomFloat(ranges.torsoHeight.min, ranges.torsoHeight.max),
            torsoY: randomFloat(ranges.torsoY.min, ranges.torsoY.max),

            // Neck
            neckWidth: randomFloat(ranges.neckWidth.min, ranges.neckWidth.max),
            neckHeight: randomFloat(ranges.neckHeight.min, ranges.neckHeight.max),

            // Head
            headWidth: randomFloat(ranges.headWidth.min, ranges.headWidth.max),
            headHeight: randomFloat(ranges.headHeight.min, ranges.headHeight.max),

            // Arms
            upperArmTopWidth: randomFloat(ranges.upperArmTopWidth.min, ranges.upperArmTopWidth.max),
            upperArmBottomWidth: randomFloat(ranges.upperArmBottomWidth.min, ranges.upperArmBottomWidth.max),
            upperArmLength: randomFloat(ranges.upperArmLength.min, ranges.upperArmLength.max),
            forearmTopWidth: randomFloat(ranges.forearmTopWidth.min, ranges.forearmTopWidth.max),
            forearmBottomWidth: randomFloat(ranges.forearmBottomWidth.min, ranges.forearmBottomWidth.max),
            forearmLength: randomFloat(ranges.forearmLength.min, ranges.forearmLength.max),
            armAngle: randomFloat(ranges.armAngle.min, ranges.armAngle.max),
            elbowAngle: randomFloat(ranges.elbowAngle.min, ranges.elbowAngle.max),

            // Legs
            thighTopWidth: randomFloat(ranges.thighTopWidth.min, ranges.thighTopWidth.max),
            thighBottomWidth: randomFloat(ranges.thighBottomWidth.min, ranges.thighBottomWidth.max),
            thighLength: randomFloat(ranges.thighLength.min, ranges.thighLength.max),
            shinTopWidth: randomFloat(ranges.shinTopWidth.min, ranges.shinTopWidth.max),
            shinBottomWidth: randomFloat(ranges.shinBottomWidth.min, ranges.shinBottomWidth.max),
            shinLength: randomFloat(ranges.shinLength.min, ranges.shinLength.max),
            legAngle: randomFloat(ranges.legAngle.min, ranges.legAngle.max),

            // Generation
            fillDensity: randomFloat(ranges.fillDensity.min, ranges.fillDensity.max),
            palette: generateRandomPalette()
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
                return {
                    ...baseRanges,
                    torsoHeight: { min: 24, max: 30 },
                    torsoY: { min: 24, max: 32 },
                    thighLength: { min: 12, max: 20 },
                    shinLength: { min: 16, max: 24 }
                };

            case 'tall':
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
        parts.torso = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.torsoTopWidth, scaledParams.torsoBottomWidth,
            scaledParams.torsoHeight,
            0
        );

        // 2. NECK
        parts.neck = createTrapezoid(
            this.centerX, torsoTop,
            scaledParams.neckWidth, scaledParams.neckWidth,
            -scaledParams.neckHeight,
            0
        );

        // 3. HEAD
        parts.head = createTrapezoid(
            this.centerX, torsoTop - scaledParams.neckHeight,
            scaledParams.headWidth, scaledParams.headWidth,
            -scaledParams.headHeight,
            0
        );

        // Symmetrical by default (mirrored)
        const leftShoulderAngle = scaledParams.armAngle;
        const leftForearmAngle = scaledParams.armAngle + scaledParams.elbowAngle;

        const rightShoulderAngle = -scaledParams.armAngle;
        const rightForearmAngle = -scaledParams.armAngle - scaledParams.elbowAngle;


        // 4. LEFT ARM
        const leftShoulderX = this.centerX - scaledParams.torsoTopWidth / 2;

        parts.leftUpperArm = createTrapezoid(
            leftShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            leftShoulderAngle
        );

        const upperArmEnd = getTrapezoidBottom(parts.leftUpperArm);

        parts.leftForearm = createTrapezoid(
            upperArmEnd.x, upperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            leftForearmAngle
        );

        // 5. RIGHT ARM
        const rightShoulderX = this.centerX + scaledParams.torsoTopWidth / 2;

        parts.rightUpperArm = createTrapezoid(
            rightShoulderX, torsoTop,
            scaledParams.upperArmTopWidth, scaledParams.upperArmBottomWidth,
            scaledParams.upperArmLength,
            rightShoulderAngle
        );

        const rightUpperArmEnd = getTrapezoidBottom(parts.rightUpperArm);

        parts.rightForearm = createTrapezoid(
            rightUpperArmEnd.x, rightUpperArmEnd.y,
            scaledParams.forearmTopWidth, scaledParams.forearmBottomWidth,
            scaledParams.forearmLength,
            rightForearmAngle
        );

        // 6. LEFT LEG
        const leftHipX = this.centerX - scaledParams.torsoBottomWidth / 2;

        parts.leftThigh = createTrapezoid(
            leftHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            scaledParams.legAngle
        );

        const thighEnd = getTrapezoidBottom(parts.leftThigh);
        const remainingShinLength = this.groundY - thighEnd.y;

        parts.leftShin = createTrapezoid(
            thighEnd.x, thighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            remainingShinLength,
            0
        );

        // 7. RIGHT LEG
        const rightHipX = this.centerX + scaledParams.torsoBottomWidth / 2;

        parts.rightThigh = createTrapezoid(
            rightHipX, torsoBottom,
            scaledParams.thighTopWidth, scaledParams.thighBottomWidth,
            scaledParams.thighLength,
            -scaledParams.legAngle
        );

        const rightThighEnd = getTrapezoidBottom(parts.rightThigh);
        const rightRemainingShinLength = this.groundY - rightThighEnd.y;

        parts.rightShin = createTrapezoid(
            rightThighEnd.x, rightThighEnd.y,
            scaledParams.shinTopWidth, scaledParams.shinBottomWidth,
            rightRemainingShinLength,
            0
        );

        // 8. JOINTS (circles at articulation points)
        parts.leftElbow = createJoint(parts.leftUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.rightElbow = createJoint(parts.rightUpperArm.bottomCenter, scaledParams.upperArmBottomWidth / 2);
        parts.leftKnee = createJoint(parts.leftThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.rightKnee = createJoint(parts.rightThigh.bottomCenter, scaledParams.thighBottomWidth / 2);
        parts.leftShoulder = createJoint(parts.leftUpperArm.center, scaledParams.upperArmTopWidth / 2);
        parts.rightShoulder = createJoint(parts.rightUpperArm.center, scaledParams.upperArmTopWidth / 2);

        // 9. HANDS (small trapezoids at forearm ends)
        const leftHandStart = parts.leftForearm.bottomCenter;
        const leftHandAngle = leftForearmAngle;
        parts.leftHand = createTrapezoid(
            leftHandStart.x, leftHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            leftHandAngle
        );

        const rightHandStart = parts.rightForearm.bottomCenter;
        const rightHandAngle = rightForearmAngle;
        parts.rightHand = createTrapezoid(
            rightHandStart.x, rightHandStart.y,
            scaledParams.forearmBottomWidth * 1.2,
            scaledParams.forearmBottomWidth * 0.8,
            scaledParams.forearmBottomWidth * 1.5,
            rightHandAngle
        );

        // 10. FEET (small trapezoids at shin ends)
        const leftFootStart = parts.leftShin.bottomCenter;
        parts.leftFoot = createTrapezoid(
            leftFootStart.x, leftFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        const rightFootStart = parts.rightShin.bottomCenter;
        parts.rightFoot = createTrapezoid(
            rightFootStart.x, rightFootStart.y,
            scaledParams.shinBottomWidth,
            scaledParams.shinBottomWidth * 1.2,
            scaledParams.shinBottomWidth * 0.8,
            90 // horizontal feet
        );

        return parts;
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
            const d = distance(centroid, p);
            maxDistFromCenter = Math.max(maxDistFromCenter, d);
        });

        // Fill pixels ONLY inside trapezoid
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const point = { x, y };

                // Only fill if inside shape
                if (isPointInPolygon(point, trap.points)) {
                    // Distance from center of shape
                    const distFromCenter = distance(point, centroid);

                    // Intensity: 1.0 at center, decays toward edges
                    const intensity = Math.max(0, 1 - (distFromCenter / maxDistFromCenter) * 0.5);

                    heatmap[y][x] = Math.max(heatmap[y][x], intensity);
                }
            }
        }
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

    removeIsolatedPixels(pixels) {
        const toRemove = [];
        const size = pixels.length;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (pixels[y][x]) {
                    let neighborCount = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            if (pixels[y + dy] && pixels[y + dy][x + dx]) neighborCount++;
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

    applySmoothing(pixels, palette) {
        // Cellular automata: fill empty cells surrounded by many filled neighbors
        const toFill = [];
        const size = pixels.length;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (pixels[y][x] === null) {
                    // Count filled neighbors (Moore neighborhood - 8 cells)
                    let filledCount = 0;
                    const neighborColors = [];

                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            if (pixels[y + dy] && pixels[y + dy][x + dx]) {
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
        const size = pixels.length;

        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
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
                        if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
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
}
