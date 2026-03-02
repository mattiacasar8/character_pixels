import { shade, tint } from '../../utils/color.js';

export class ClothingGenerator {
    constructor() { }

    generatePatterns(rng) {
        // Shirt Patterns (8 options)
        const shirtPatternVal = rng.next();
        let shirtPattern = 'none';
        let shirtProps = {};

        if (shirtPatternVal < 0.14) {
            shirtPattern = 'stripes';
            shirtProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (shirtPatternVal < 0.28) {
            shirtPattern = 'checkers';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.shape = 'square';
            else if (sub < 0.66) shirtProps.shape = 'triangle';
            else shirtProps.shape = 'circle';
        } else if (shirtPatternVal < 0.40) {
            shirtPattern = 'buttons';
            const sub = rng.next();
            if (sub < 0.33) shirtProps.align = 'left';
            else if (sub < 0.66) shirtProps.align = 'right';
            else shirtProps.align = 'center';
        } else if (shirtPatternVal < 0.52) {
            shirtPattern = 'tunic';
            shirtProps.long = rng.next() < 0.3;
        } else if (shirtPatternVal < 0.64) {
            shirtPattern = 'cross-stitch';
        } else if (shirtPatternVal < 0.76) {
            shirtPattern = 'diamond';
        } else if (shirtPatternVal < 0.88) {
            shirtPattern = 'v-trim';
        } else {
            shirtPattern = 'collar';
            shirtProps.width = rng.next() < 0.5 ? 'narrow' : 'wide';
        }

        // Pants Patterns (4 options)
        const pantsPatternVal = rng.next();
        let pantsPattern = 'none';
        let pantsProps = {};
        if (pantsPatternVal < 0.20) {
            pantsPattern = 'stripes';
            pantsProps.orientation = rng.next() > 0.5 ? 'vertical' : 'horizontal';
        } else if (pantsPatternVal < 0.35) {
            pantsPattern = 'patches';
        } else if (pantsPatternVal < 0.48) {
            pantsPattern = 'cross-stitch';
        } else if (pantsPatternVal < 0.58) {
            pantsPattern = 'side-stripe';
        }

        return {
            shirt: { pattern: shirtPattern, props: shirtProps },
            pants: { pattern: pantsPattern, props: pantsProps },
            hasPockets: rng.next() < 0.4,
            hasCuts: rng.next() < 0.15
        };
    }

    applyPattern(x, y, color, region, clothingData, centerX, minY, maxY) {
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
                        if ((x % 3) + (y % 3) < 3) finalColor = shade(finalColor, 0.1);
                    } else {
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
                if (Math.abs(x - centerX) <= 2) finalColor = tint(finalColor, 0.15);
                if (y > maxY - 2) finalColor = tint(finalColor, 0.1);
                if (Math.abs(x - centerX) === 0 && y % 6 === 0 && y > minY + 5) {
                    finalColor = shade(finalColor, 0.2);
                }
            } else if (shirt.pattern === 'cross-stitch') {
                // X pattern in 4px grid
                const gx = x % 4;
                const gy = y % 4;
                if ((gx === gy) || (gx === 3 - gy)) {
                    finalColor = shade(finalColor, 0.12);
                }
            } else if (shirt.pattern === 'diamond') {
                // Diamond grid via modular arithmetic
                const dx = Math.abs((x % 6) - 3);
                const dy = Math.abs((y % 6) - 3);
                if (dx + dy <= 2) {
                    finalColor = shade(finalColor, 0.12);
                }
                // Diamond edge highlight
                if (dx + dy === 2) {
                    finalColor = tint(finalColor, 0.08);
                }
            } else if (shirt.pattern === 'v-trim') {
                // V-shaped neckline detail at top of shirt
                const distFromTop = y - minY;
                if (distFromTop < 6) {
                    const vWidth = distFromTop * 0.8;
                    if (Math.abs(x - centerX) <= vWidth) {
                        finalColor = tint(finalColor, 0.18);
                    }
                }
                // Center seam line
                if (Math.abs(x - centerX) === 0 && distFromTop >= 2 && distFromTop < 10) {
                    finalColor = shade(finalColor, 0.1);
                }
            } else if (shirt.pattern === 'collar') {
                // Horizontal band at shirt top
                const distFromTop = y - minY;
                const collarHeight = shirt.props.width === 'wide' ? 4 : 2;
                if (distFromTop < collarHeight) {
                    finalColor = tint(finalColor, 0.2);
                    // Collar edge
                    if (distFromTop === collarHeight - 1) {
                        finalColor = shade(finalColor, 0.08);
                    }
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
                const px = Math.floor(x / 3);
                const py = Math.floor(y / 3);
                const patchHash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
                if ((patchHash - Math.floor(patchHash)) > 0.9) {
                    finalColor = shade(finalColor, 0.2);
                }
            } else if (pants.pattern === 'cross-stitch') {
                const gx = x % 4;
                const gy = y % 4;
                if ((gx === gy) || (gx === 3 - gy)) {
                    finalColor = shade(finalColor, 0.1);
                }
            } else if (pants.pattern === 'side-stripe') {
                // Vertical stripe along outer edges of legs
                const distFromCenter = Math.abs(x - centerX);
                if (distFromCenter >= 3 && distFromCenter <= 5) {
                    finalColor = tint(finalColor, 0.15);
                }
            }
        }

        // Pockets
        if (hasPockets && (region === 'shirt' || region === 'pants')) {
            if (Math.abs(x - centerX) >= 4 && Math.abs(x - centerX) <= 7) {
                if (y >= minY + 20 && y <= minY + 24) {
                    finalColor = shade(finalColor, 0.1);
                }
            }
        }

        // Cuts/Tears
        if (hasCuts && (region === 'shirt' || region === 'pants')) {
            const cutHash = Math.sin(x * 45.123 + y * 91.532) * 12345.678;
            if ((cutHash - Math.floor(cutHash)) > 0.98) {
                finalColor = shade(finalColor, 0.4);
            }
        }

        return finalColor;
    }
}
