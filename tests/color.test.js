import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { shade, tint, hexToRgb, getMostCommonColor } from '../js/utils/color.js';

describe('shade', () => {
    it('darkens a color by the given percentage', () => {
        const result = shade({ r: 200, g: 100, b: 50 }, 0.5);
        assert.deepStrictEqual(result, { r: 100, g: 50, b: 25 });
    });

    it('returns black when percent is 1.0', () => {
        const result = shade({ r: 200, g: 100, b: 50 }, 1.0);
        assert.deepStrictEqual(result, { r: 0, g: 0, b: 0 });
    });

    it('returns the same color when percent is 0', () => {
        const result = shade({ r: 200, g: 100, b: 50 }, 0);
        assert.deepStrictEqual(result, { r: 200, g: 100, b: 50 });
    });

    it('never goes below 0', () => {
        const result = shade({ r: 10, g: 5, b: 1 }, 0.9);
        assert.ok(result.r >= 0);
        assert.ok(result.g >= 0);
        assert.ok(result.b >= 0);
    });

    it('rounds to integers', () => {
        const result = shade({ r: 100, g: 100, b: 100 }, 0.33);
        assert.strictEqual(result.r, Math.round(100 * 0.67));
        assert.strictEqual(typeof result.r, 'number');
        assert.ok(Number.isInteger(result.r));
    });
});

describe('tint', () => {
    it('lightens a color by the given percentage', () => {
        const result = tint({ r: 0, g: 0, b: 0 }, 0.5);
        assert.deepStrictEqual(result, { r: 128, g: 128, b: 128 });
    });

    it('returns white when percent is 1.0', () => {
        const result = tint({ r: 0, g: 0, b: 0 }, 1.0);
        assert.deepStrictEqual(result, { r: 255, g: 255, b: 255 });
    });

    it('returns the same color when percent is 0', () => {
        const result = tint({ r: 100, g: 150, b: 200 }, 0);
        assert.deepStrictEqual(result, { r: 100, g: 150, b: 200 });
    });

    it('never exceeds 255', () => {
        const result = tint({ r: 250, g: 250, b: 250 }, 0.9);
        assert.ok(result.r <= 255);
        assert.ok(result.g <= 255);
        assert.ok(result.b <= 255);
    });

    it('rounds to integers', () => {
        const result = tint({ r: 100, g: 100, b: 100 }, 0.33);
        assert.ok(Number.isInteger(result.r));
    });
});

describe('hexToRgb', () => {
    it('parses 6-digit hex with hash', () => {
        assert.deepStrictEqual(hexToRgb('#ff0000'), { r: 255, g: 0, b: 0 });
    });

    it('parses 6-digit hex without hash', () => {
        assert.deepStrictEqual(hexToRgb('00ff00'), { r: 0, g: 255, b: 0 });
    });

    it('parses mixed case', () => {
        assert.deepStrictEqual(hexToRgb('#FFaaCC'), { r: 255, g: 170, b: 204 });
    });

    it('returns black for invalid hex', () => {
        const result = hexToRgb('not-a-color');
        assert.deepStrictEqual(result, { r: 0, g: 0, b: 0 });
    });

    it('returns black for empty string', () => {
        const result = hexToRgb('');
        assert.deepStrictEqual(result, { r: 0, g: 0, b: 0 });
    });
});

describe('getMostCommonColor', () => {
    it('returns the most common color in a 3x3 neighborhood', () => {
        const red = { r: 255, g: 0, b: 0 };
        const blue = { r: 0, g: 0, b: 255 };
        const pixels = [
            [red, red, red],
            [red, blue, red],
            [red, blue, red]
        ];
        const result = getMostCommonColor(pixels, 1, 1, 3);
        assert.deepStrictEqual(result, red);
    });

    it('returns null for empty neighborhood', () => {
        const pixels = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        const result = getMostCommonColor(pixels, 1, 1, 3);
        assert.strictEqual(result, null);
    });
});
