// Character Generator
import { createTrapezoid, createJoint, getTrapezoidBottom, isPointInPolygon, distance } from '../utils/math.js';
import { generateRandomPalette, SeededRandom } from '../utils/random.js';
import { processorManager } from './processors/ProcessorManager.js';
import { BODY_PROPORTIONS, ANIMATION } from '../config.js';

export class CharacterGenerator {
    constructor(canvasSize = 50) {
        this.canvasSize = canvasSize;
        this.centerX = this.canvasSize / 2;
        // Canvas floor: bottom pixel. Used by monsters to fill the whole canvas.
        // Note: HumanGenerator overrides this with canvasSize * 0.9 for natural standing pose.
        this.groundY = this.canvasSize - 1;
    }

    generate(params) {
        const bodyParts = this.generateBodyParts(params);
        const heatmap = this.generateHeatmap(bodyParts, params);

        // Generate raw pixels with effects disabled to get clean base
        const rawParams = { ...params, effects: { smoothing: false, lighting: false, outline: false } };
        let pixels = this.generatePixels(heatmap, rawParams);

        // Clone raw pixels before effects (smoothing/outline mutates the array)
        const rawPixels = pixels.map(row => [...row]);

        // Apply all enabled effects via ProcessorManager
        pixels = processorManager.applyAll(pixels, params, this.canvasSize);

        // Name generation is handled by the app or subclass
        const name = params.name || "Unknown";

        return {
            bodyParts,
            heatmap,
            pixels,
            rawPixels, // Export raw pixels
            name,
            params // Store params used
        };
    }

    generateAnimationFrames(params) {
        const frames = [];
        const variations = ANIMATION.baseVariations;

        variations.forEach(variation => {
            const frameParams = { ...params };

            if (frameParams.torsoHeight) {
                frameParams.torsoHeight = frameParams.torsoHeight * (1 + variation);
            }
            if (frameParams.armAngle) {
                frameParams.armAngle = frameParams.armAngle * (1 + variation * 2);
            }

            const char = this.generate(frameParams);
            frames.push(char.pixels);
        });

        return frames;
    }

    /**
     * Extract face pixels from a frame's head region for cross-frame consistency.
     * @param {Array} pixels - The 2D pixel array
     * @param {Object} bodyParts - The body parts containing head with points
     * @returns {{ facePixels: Array, headBounds: Object }|null}
     */
    extractFacePixels(pixels, bodyParts) {
        const head = bodyParts.head;
        if (!head || !head.points) return null;

        const xs = head.points.map(p => p.x);
        const ys = head.points.map(p => p.y);
        const headBounds = {
            minX: Math.floor(Math.min(...xs)),
            maxX: Math.ceil(Math.max(...xs)),
            minY: Math.floor(Math.min(...ys)),
            maxY: Math.ceil(Math.max(...ys))
        };

        const facePixels = [];
        for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
            facePixels[y] = [];
            for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                if (y >= 0 && y < this.canvasSize && x >= 0 && x < this.canvasSize) {
                    facePixels[y][x] = pixels[y][x] ? { ...pixels[y][x] } : null;
                }
            }
        }

        return { facePixels, headBounds };
    }

    /**
     * Apply stored face pixels onto a frame with vertical offset (head bobbing).
     * @param {Array} pixels - The target 2D pixel array (mutated in place)
     * @param {Array} facePixels - Previously extracted face pixels
     * @param {Object} headBounds - Bounding box of the head region
     * @param {number} yOffset - Vertical offset for head bobbing
     */
    applyFacePixels(pixels, facePixels, headBounds, yOffset) {
        for (let y = headBounds.minY; y <= headBounds.maxY; y++) {
            for (let x = headBounds.minX; x <= headBounds.maxX; x++) {
                const targetY = y + yOffset;
                if (targetY >= 0 && targetY < this.canvasSize && x >= 0 && x < this.canvasSize) {
                    if (facePixels[y] && facePixels[y][x] !== undefined) {
                        pixels[targetY][x] = facePixels[y][x] ? { ...facePixels[y][x] } : null;
                    }
                }
            }
        }
    }

    reprocess(character, newParams) {
        // Restore from raw pixels
        // Clone again to avoid mutating the stored rawPixels
        if (!character.rawPixels) return character;

        let pixels = character.rawPixels.map(row => [...row]);

        this.removeIsolatedPixels(pixels);

        // Apply all enabled effects via ProcessorManager
        pixels = processorManager.applyAll(pixels, newParams, this.canvasSize);

        // Update character
        character.pixels = pixels;
        return character;
    }

    // Resolve range objects {min, max} to random values
    resolveParams(rangeParams, existingSeed = null) {
        const seed = existingSeed !== null ? existingSeed : Math.floor(Math.random() * 2147483647);
        const rng = new SeededRandom(seed);
        const resolved = {};

        Object.keys(rangeParams).forEach(key => {
            const value = rangeParams[key];

            // If it's a range object, resolve to random value
            if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
                resolved[key] = rng.float(value.min, value.max);
            } else {
                // Otherwise keep the value as-is (e.g., boolean flags, torsoY)
                resolved[key] = value;
            }
        });

        // Derive proportional values: taper limbs toward extremities for natural anatomy
        if (resolved.torsoTopWidth !== undefined) {
            resolved.upperArmBottomWidth = resolved.upperArmTopWidth * 0.8;  // 80% taper
            resolved.forearmBottomWidth = resolved.forearmTopWidth * 0.7;    // 70% taper (more visible on forearms)
            resolved.forearmLength = resolved.upperArmLength;
            resolved.headHeight = resolved.headWidth;                        // Square head
            resolved.thighBottomWidth = resolved.thighTopWidth * 0.8;       // 80% taper
            resolved.shinBottomWidth = resolved.shinTopWidth * 0.8;         // 80% taper
            if (!resolved.shinLength) resolved.shinLength = 24;             // ~48% of canvas height
        }

        // Ensure seed is preserved
        resolved.seed = seed;

        return resolved;
    }

    randomParams() {
        return this.randomParamsInRange('standard');
    }

    randomParamsInRange(preset = 'standard', existingSeed = null) {
        // Use existing seed if provided, otherwise generate a new one
        const seed = existingSeed !== null ? existingSeed : Math.floor(Math.random() * 2147483647);
        const rng = new SeededRandom(seed);

        const ranges = this.getParamRanges(preset);

        return {
            // Torso (anchor)
            torsoTopWidth: rng.float(ranges.torsoTopWidth.min, ranges.torsoTopWidth.max),
            torsoBottomWidth: rng.float(ranges.torsoBottomWidth.min, ranges.torsoBottomWidth.max),
            torsoHeight: rng.float(ranges.torsoHeight.min, ranges.torsoHeight.max),
            torsoY: rng.float(ranges.torsoY.min, ranges.torsoY.max),

            // Neck
            neckWidth: rng.float(ranges.neckWidth.min, ranges.neckWidth.max),
            neckHeight: rng.float(ranges.neckHeight.min, ranges.neckHeight.max),

            // Head
            headWidth: rng.float(ranges.headWidth.min, ranges.headWidth.max),
            headHeight: rng.float(ranges.headHeight.min, ranges.headHeight.max),

            // Arms
            upperArmTopWidth: rng.float(ranges.upperArmTopWidth.min, ranges.upperArmTopWidth.max),
            upperArmBottomWidth: rng.float(ranges.upperArmBottomWidth.min, ranges.upperArmBottomWidth.max),
            upperArmLength: rng.float(ranges.upperArmLength.min, ranges.upperArmLength.max),
            forearmTopWidth: rng.float(ranges.forearmTopWidth.min, ranges.forearmTopWidth.max),
            forearmBottomWidth: rng.float(ranges.forearmBottomWidth.min, ranges.forearmBottomWidth.max),
            forearmLength: rng.float(ranges.forearmLength.min, ranges.forearmLength.max),
            armAngle: rng.float(ranges.armAngle.min, ranges.armAngle.max),
            elbowAngle: rng.float(ranges.elbowAngle.min, ranges.elbowAngle.max),

            // Legs
            thighTopWidth: rng.float(ranges.thighTopWidth.min, ranges.thighTopWidth.max),
            thighBottomWidth: rng.float(ranges.thighBottomWidth.min, ranges.thighBottomWidth.max),
            thighLength: rng.float(ranges.thighLength.min, ranges.thighLength.max),
            shinTopWidth: rng.float(ranges.shinTopWidth.min, ranges.shinTopWidth.max),
            shinBottomWidth: rng.float(ranges.shinBottomWidth.min, ranges.shinBottomWidth.max),
            shinLength: rng.float(ranges.shinLength.min, ranges.shinLength.max),
            legAngle: rng.float(ranges.legAngle.min, ranges.legAngle.max),

            // Generation
            fillDensity: rng.float(ranges.fillDensity.min, ranges.fillDensity.max),
            palette: generateRandomPalette(rng),
            seed: seed
        };
    }

    getParamRanges(preset) {
        // Delegates to centralized BODY_PROPORTIONS config.
        // Subclasses (HumanGenerator, MonsterGenerator) override with their own ranges.
        const baseRanges = { ...BODY_PROPORTIONS.monster.base };

        if (preset && BODY_PROPORTIONS.monster.presets[preset]) {
            return {
                ...baseRanges,
                ...BODY_PROPORTIONS.monster.presets[preset]
            };
        }

        return baseRanges;
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

        // Initialize seeded random
        const rng = new SeededRandom(params.seed);

        // Generate left half, then mirror
        for (let y = 0; y < this.canvasSize; y++) {
            for (let x = 0; x < Math.floor(this.canvasSize / 2); x++) {
                const probability = heatmap[y][x];

                if (probability > 0.1 && rng.float(0, 1) < probability * fillDensity) {
                    const color = params.palette[
                        rng.int(0, params.palette.length - 1)
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

}
