
import { shade, tint } from '../../utils/color.js';

export class AccessoryGenerator {
    constructor() { }

    generateAccessories(rng) {
        const hasNecklace = rng.next() < 0.3; // 30% chance
        let necklace = null;
        if (hasNecklace) {
            necklace = {
                color: rng.next() < 0.5 ? { r: 255, g: 215, b: 0 } : { r: 192, g: 192, b: 192 }, // Gold or Silver
                length: rng.next() < 0.5 ? 'short' : 'long',
                pendant: ['circle', 'diamond', 'square', 'cross', 'gem'][rng.int(0, 4)]
            };
            if (necklace.pendant === 'gem') {
                const gemRoll = rng.next();
                if (gemRoll < 0.33) necklace.pendantColor = { r: 46, g: 204, b: 113 }; // Emerald
                else if (gemRoll < 0.66) necklace.pendantColor = { r: 52, g: 152, b: 219 }; // Sapphire
                else necklace.pendantColor = { r: 231, g: 76, b: 60 }; // Ruby
            }
        }

        // Shoulder Pads (20%)
        const hasShoulderPads = rng.next() < 0.20;
        let shoulderPads = null;
        if (hasShoulderPads) {
            const matRoll = rng.next();
            if (matRoll < 0.4) {
                shoulderPads = { color: { r: 120, g: 80, b: 40 }, material: 'leather' };
            } else if (matRoll < 0.7) {
                shoulderPads = { color: { r: 160, g: 160, b: 165 }, material: 'metal' };
            } else {
                shoulderPads = { color: { r: 80, g: 55, b: 30 }, material: 'darkLeather' };
            }
        }

        // Arm Bands (15%)
        const hasArmBands = rng.next() < 0.15;
        let armBands = null;
        if (hasArmBands) {
            const bandRoll = rng.next();
            if (bandRoll < 0.4) {
                armBands = { color: { r: 200, g: 170, b: 50 }, material: 'gold' };
            } else if (bandRoll < 0.7) {
                armBands = { color: { r: 180, g: 180, b: 190 }, material: 'silver' };
            } else {
                armBands = { color: { r: 180, g: 110, b: 60 }, material: 'copper' };
            }
        }

        // Cloak/Cape (15%)
        const hasCloak = rng.next() < 0.15;
        let cloak = null;
        if (hasCloak) {
            const cloakColors = [
                { r: 100, g: 25, b: 25 },  // Dark red
                { r: 25, g: 35, b: 70 },   // Dark blue
                { r: 65, g: 45, b: 30 },   // Dark brown
                { r: 45, g: 45, b: 50 },   // Charcoal
                { r: 30, g: 55, b: 35 }    // Dark green
            ];
            cloak = {
                color: cloakColors[rng.int(0, cloakColors.length - 1)]
            };
        }

        return { necklace, shoulderPads, armBands, cloak };
    }

    drawAccessories(pixels, accessories, centerX, minY, canvasSize, bodyParts = null) {
        // Cloak drawn first (behind body, fills empty space)
        if (accessories.cloak && bodyParts) {
            this.drawCloak(pixels, accessories.cloak, bodyParts, canvasSize);
        }
        // Shoulder pads drawn on top of body
        if (accessories.shoulderPads && bodyParts) {
            this.drawShoulderPads(pixels, accessories.shoulderPads, bodyParts, pixels.length);
        }
        // Arm bands drawn on top of body
        if (accessories.armBands && bodyParts) {
            this.drawArmBands(pixels, accessories.armBands, bodyParts, pixels.length);
        }
        // Necklace last (on top of everything)
        if (accessories.necklace) {
            this.drawNecklace(pixels, accessories.necklace, centerX, minY, canvasSize);
        }
    }

    drawNecklace(pixels, necklace, centerX, minY, canvasSize) {
        const neckY = minY + 3; // Approx neck base
        const chainColor = necklace.color;

        // Draw Chain
        const chainLength = necklace.length === 'long' ? 10 : 6;
        for (let i = 0; i <= chainLength; i++) {
            const dy = i;
            const dx = Math.floor(i * 0.7);

            // Left side
            if (pixels[neckY + dy] && pixels[neckY + dy][centerX - dx])
                pixels[neckY + dy][centerX - dx] = chainColor;

            // Right side
            if (pixels[neckY + dy] && pixels[neckY + dy][centerX + dx])
                pixels[neckY + dy][centerX + dx] = chainColor;
        }

        // Draw Pendant
        const pendantY = neckY + chainLength;
        const pendantX = centerX;
        const pColor = necklace.pendant === 'gem' ? necklace.pendantColor : chainColor;

        if (pixels[pendantY] && pixels[pendantY][pendantX]) {
            pixels[pendantY][pendantX] = pColor;
            // Simple shapes
            if (necklace.pendant === 'diamond' || necklace.pendant === 'gem') {
                if (pixels[pendantY - 1]) pixels[pendantY - 1][pendantX] = pColor;
                if (pixels[pendantY + 1]) pixels[pendantY + 1][pendantX] = pColor;
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
            } else if (necklace.pendant === 'square') {
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
                if (pixels[pendantY + 1]) {
                    pixels[pendantY + 1][pendantX] = pColor;
                    pixels[pendantY + 1][pendantX - 1] = pColor;
                    pixels[pendantY + 1][pendantX + 1] = pColor;
                }
            } else if (necklace.pendant === 'cross') {
                if (pixels[pendantY + 1]) pixels[pendantY + 1][pendantX] = pColor;
                if (pixels[pendantY + 2]) pixels[pendantY + 2][pendantX] = pColor;
                pixels[pendantY][pendantX - 1] = pColor;
                pixels[pendantY][pendantX + 1] = pColor;
            }
        }
    }

    drawShoulderPads(pixels, shoulderPads, bodyParts, gridSize) {
        const color = shoulderPads.color;
        const highlight = tint(color, 0.25);
        const shadow = shade(color, 0.2);

        for (const armKey of ['leftUpperArm', 'rightUpperArm']) {
            const arm = bodyParts[armKey];
            if (!arm || !arm.center) continue;

            // arm.center is the top-center pivot (shoulder point)
            const sx = Math.round(arm.center.x);
            const sy = Math.round(arm.center.y);

            // Draw a small pad: 3px wide, 3px tall at the shoulder
            for (let dy = 0; dy <= 2; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const px = sx + dx;
                    const py = sy + dy;
                    if (py >= 0 && py < gridSize && px >= 0 && px < gridSize) {
                        if (pixels[py][px]) {
                            pixels[py][px] = dy === 0 ? highlight : (dy === 2 ? shadow : color);
                        }
                    }
                }
            }
        }
    }

    drawArmBands(pixels, armBands, bodyParts, gridSize) {
        const color = armBands.color;
        const highlight = tint(color, 0.3);

        for (const armKey of ['leftForearm', 'rightForearm']) {
            const arm = bodyParts[armKey];
            if (!arm || !arm.center || !arm.bottomCenter) continue;

            // Mid-point of the forearm
            const midX = Math.round((arm.center.x + arm.bottomCenter.x) / 2);
            const midY = Math.round((arm.center.y + arm.bottomCenter.y) / 2);

            // Draw a horizontal band: 3px wide, 2px tall
            for (let dy = 0; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const px = midX + dx;
                    const py = midY + dy;
                    if (py >= 0 && py < gridSize && px >= 0 && px < gridSize) {
                        if (pixels[py][px]) {
                            pixels[py][px] = dy === 0 ? highlight : color;
                        }
                    }
                }
            }
        }
    }

    drawCloak(pixels, cloak, bodyParts, canvasSize) {
        const color = cloak.color;
        const edgeColor = shade(color, 0.25);

        const torso = bodyParts.torso;
        if (!torso || !torso.points) return;

        // points: [topLeft, topRight, bottomRight, bottomLeft]
        const topLeft = torso.points[0];
        const topRight = torso.points[1];
        const bottomRight = torso.points[2];
        const bottomLeft = torso.points[3];

        const startY = Math.round(topLeft.y);
        const torsoBottomY = Math.round(bottomLeft.y);
        // Cloak extends 8px below the torso
        const endY = Math.min(canvasSize - 2, torsoBottomY + 8);
        const totalHeight = torsoBottomY - startY;

        for (let y = startY; y <= endY; y++) {
            let leftEdgeX, rightEdgeX;

            if (y <= torsoBottomY && totalHeight > 0) {
                // Interpolate along torso edges
                const t = (y - startY) / totalHeight;
                leftEdgeX = Math.round(topLeft.x + (bottomLeft.x - topLeft.x) * t);
                rightEdgeX = Math.round(topRight.x + (bottomRight.x - topRight.x) * t);
            } else {
                // Below torso - continue from bottom edge
                leftEdgeX = Math.round(bottomLeft.x);
                rightEdgeX = Math.round(bottomRight.x);
            }

            // Draw 2-3 cloak pixels outside each body edge
            const cloakWidth = 2 + Math.floor(((y - startY) / Math.max(1, endY - startY)) * 2);

            for (let dx = 1; dx <= cloakWidth; dx++) {
                const lx = leftEdgeX - dx;
                const rx = rightEdgeX + dx;

                if (y >= 0 && y < canvasSize) {
                    // Left side - only draw in empty space
                    if (lx >= 0 && lx < canvasSize && !pixels[y][lx]) {
                        pixels[y][lx] = dx === 1 ? edgeColor : color;
                    }
                    // Right side - only draw in empty space
                    if (rx >= 0 && rx < canvasSize && !pixels[y][rx]) {
                        pixels[y][rx] = dx === 1 ? edgeColor : color;
                    }
                }
            }
        }
    }

    /**
     * Helper: compare two {r,g,b} colors by value
     */
    _colorsMatch(a, b) {
        return a && b && a.r === b.r && a.g === b.g && a.b === b.b;
    }

    drawBelt(pixels, centerX, canvasSize, colors) {
        if (!colors) return;

        // Scan only the vertical band where shirt/pants transition occurs (center ± 30%)
        const scanStart = Math.max(1, Math.floor(canvasSize * 0.3));
        const scanEnd = Math.min(canvasSize - 1, Math.ceil(canvasSize * 0.7));
        const xStart = Math.max(0, Math.floor(centerX - canvasSize * 0.25));
        const xEnd = Math.min(canvasSize, Math.ceil(centerX + canvasSize * 0.25));

        for (let y = scanStart; y < scanEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                if (pixels[y][x] && pixels[y + 1] && pixels[y + 1][x]) {
                    const c1 = pixels[y][x];
                    const c2 = pixels[y + 1][x];
                    if (this._colorsMatch(c1, colors.shirt) && this._colorsMatch(c2, colors.pants)) {
                        pixels[y][x] = { r: 50, g: 30, b: 20 };
                    }
                }
            }
        }
    }
}
