
export class ClothingGenerator {
    constructor() { }

    generatePatterns(rng) {
        // Shirt Patterns
        const shirtPatternVal = rng.next();
        let shirtPattern = 'none';
        let shirtProps = {};

        if (shirtPatternVal < 0.25) {
            shirtPattern = 'stripes';
            shirtProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (shirtPatternVal < 0.5) {
            shirtPattern = 'checkers';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.shape = 'square';
            else if (sub < 0.66) shirtProps.shape = 'triangle';
            else shirtProps.shape = 'circle';
        } else if (shirtPatternVal < 0.75) {
            shirtPattern = 'buttons';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.align = 'left';
            else if (sub < 0.66) shirtProps.align = 'right';
            else shirtProps.align = 'center';
        } else {
            shirtPattern = 'tunic';
            shirtProps.long = rng.next() < 0.3; // 30% chance of long tunic/robe
        }

        // Pants Patterns
        const pantsPatternVal = rng.next();
        let pantsPattern = 'none';
        let pantsProps = {};
        if (pantsPatternVal < 0.3) {
            pantsPattern = 'stripes';
            pantsProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (pantsPatternVal < 0.5) {
            pantsPattern = 'patches';
        }

        return {
            shirt: { pattern: shirtPattern, props: shirtProps },
            pants: { pattern: pantsPattern, props: pantsProps },
            hasPockets: rng.next() < 0.4,
            hasCuts: rng.next() < 0.15
        };
    }

    applyPattern(x, y, color, region, clothingData, centerX, minY, maxY) {
        // Helpers
        const shade = (c, percent) => ({ r: Math.max(0, c.r * (1 - percent)), g: Math.max(0, c.g * (1 - percent)), b: Math.max(0, c.b * (1 - percent)) });
        const tint = (c, percent) => ({ r: Math.min(255, c.r + (255 - c.r) * percent), g: Math.min(255, c.g + (255 - c.r) * percent), b: Math.min(255, c.b + (255 - c.b) * percent) });

        let finalColor = color;
        const { shirt, pants, hasPockets, hasCuts } = clothingData;

        if (region === 'shirt') {
            if (shirt.pattern === 'stripes') {
                if (shirt.props.orientation === 'horizontal') {
                    if (y % 4 === 0) finalColor = shade(finalColor, 0.15);
                } else {
                    if (x % 4 === 0) finalColor = shade(finalColor, 0.15);
                }
            } else if (shirt.pattern === 'checkers') {
                const cx = Math.floor(x / 3);
                const cy = Math.floor(y / 3);
                const isCheck = (cx + cy) % 2 === 0;

                if (isCheck) {
                    if (shirt.props.shape === 'square') {
                        finalColor = shade(finalColor, 0.1);
                    } else if (shirt.props.shape === 'triangle') {
                        // Diagonal split
                        if ((x % 3) + (y % 3) < 3) finalColor = shade(finalColor, 0.1);
                    } else {
                        // Circle/Dot (center of 3x3)
                        if (x % 3 === 1 && y % 3 === 1) finalColor = shade(finalColor, 0.2);
                    }
                }
            } else if (shirt.pattern === 'buttons') {
                let btnX = centerX;
                if (shirt.props.align === 'left') btnX -= 3;
                if (shirt.props.align === 'right') btnX += 3;

                if (Math.abs(x - btnX) <= 1) {
                    finalColor = shade(finalColor, 0.1); // Placket
                    if (y % 5 === 0 && y > minY + 5) finalColor = tint(finalColor, 0.3); // Button
                }
            } else if (shirt.pattern === 'tunic') {
                // Vertical trim (lighter center)
                if (Math.abs(x - centerX) <= 2) finalColor = tint(finalColor, 0.15);
                // Bottom trim
                if (y > maxY - 2) finalColor = tint(finalColor, 0.1);

                // Tunic buttons
                if (Math.abs(x - centerX) === 0 && y % 6 === 0 && y > minY + 5) {
                    finalColor = shade(finalColor, 0.2); // Dark buttons
                }
            }
        } else if (region === 'pants') {
            if (pants.pattern === 'stripes') {
                if (pants.props.orientation === 'vertical') {
                    if (x % 3 === 0) finalColor = shade(finalColor, 0.1);
                } else {
                    if (y % 3 === 0) finalColor = shade(finalColor, 0.1);
                }
            } else if (pants.pattern === 'patches') {
                // 3x3 patches
                const px = Math.floor(x / 3);
                const py = Math.floor(y / 3);
                const patchHash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
                if ((patchHash - Math.floor(patchHash)) > 0.9) {
                    finalColor = shade(finalColor, 0.2);
                }
            }
        }

        // Pockets
        if (hasPockets && (region === 'shirt' || region === 'pants')) {
            // Simple side pockets - logic was specifically at hip level in main loop
            // For simplicity, we might need to know if we are in 'pocket area'.
            // The original code:
            // if (Math.abs(x - this.centerX) >= 4 && Math.abs(x - this.centerX) <= 7) {
            //    if (y >= minY + 20 && y <= minY + 24) { ... }
            // }
            // We'll trust the caller or handle it here if we have context.
            // Let's pass minY into the function.

            // Pockets usually on pants or lower shirt (tunic)
            // Let's stick to original logic:
            if (Math.abs(x - centerX) >= 4 && Math.abs(x - centerX) <= 7) {
                if (y >= minY + 20 && y <= minY + 24) {
                    finalColor = shade(finalColor, 0.1);
                }
            }
        }

        // Cuts/Tears (Global on clothes)
        if (hasCuts && (region === 'shirt' || region === 'pants')) {
            const cutHash = Math.sin(x * 45.123 + y * 91.532) * 12345.678;
            if ((cutHash - Math.floor(cutHash)) > 0.98) {
                finalColor = shade(finalColor, 0.4);
            }
        }

        return finalColor;
    }
}
