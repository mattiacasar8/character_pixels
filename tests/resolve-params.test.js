import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// We need to mock DOM-dependent imports, so import only the class we need
// CharacterGenerator depends on math.js, random.js, ProcessorManager, config.js
// We test resolveParams which only needs SeededRandom
import { SeededRandom } from '../js/utils/random.js';

// Minimal test of the resolveParams logic extracted inline
// (since CharacterGenerator has DOM dependencies via ProcessorManager)
describe('resolveParams logic', () => {
    function resolveParams(rangeParams, existingSeed = null) {
        const seed = existingSeed !== null ? existingSeed : Math.floor(Math.random() * 2147483647);
        const rng = new SeededRandom(seed);
        const resolved = {};

        Object.keys(rangeParams).forEach(key => {
            const value = rangeParams[key];
            if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
                resolved[key] = rng.float(value.min, value.max);
            } else {
                resolved[key] = value;
            }
        });

        // Derive proportional values
        if (resolved.torsoTopWidth !== undefined) {
            resolved.upperArmBottomWidth = resolved.upperArmTopWidth * 0.8;
            resolved.forearmBottomWidth = resolved.forearmTopWidth * 0.7;
            resolved.forearmLength = resolved.upperArmLength;
            resolved.headHeight = resolved.headWidth;
            resolved.thighBottomWidth = resolved.thighTopWidth * 0.8;
            resolved.shinBottomWidth = resolved.shinTopWidth * 0.8;
            if (!resolved.shinLength) resolved.shinLength = 24;
        }

        resolved.seed = seed;
        return resolved;
    }

    it('resolves range objects to values within bounds', () => {
        const params = {
            torsoTopWidth: { min: 10, max: 20 },
            upperArmTopWidth: { min: 3, max: 6 },
            forearmTopWidth: { min: 2, max: 4 },
            upperArmLength: { min: 5, max: 10 },
            headWidth: { min: 8, max: 12 },
            thighTopWidth: { min: 4, max: 8 },
            shinTopWidth: { min: 3, max: 6 },
        };
        const result = resolveParams(params, 42);

        assert.ok(result.torsoTopWidth >= 10 && result.torsoTopWidth <= 20);
        assert.ok(result.upperArmTopWidth >= 3 && result.upperArmTopWidth <= 6);
    });

    it('preserves non-range values as-is', () => {
        const params = {
            torsoTopWidth: 15,
            boolFlag: true,
            stringVal: 'hello',
        };
        const result = resolveParams(params, 42);

        assert.strictEqual(result.torsoTopWidth, 15);
        assert.strictEqual(result.boolFlag, true);
        assert.strictEqual(result.stringVal, 'hello');
    });

    it('derives proportional widths when torsoTopWidth is present', () => {
        const params = {
            torsoTopWidth: 15,
            upperArmTopWidth: 5,
            forearmTopWidth: 4,
            upperArmLength: 8,
            headWidth: 10,
            thighTopWidth: 6,
            shinTopWidth: 5,
        };
        const result = resolveParams(params, 42);

        assert.ok(Math.abs(result.upperArmBottomWidth - 4) < 1e-10);     // 5 * 0.8
        assert.ok(Math.abs(result.forearmBottomWidth - 2.8) < 1e-10);   // 4 * 0.7
        assert.strictEqual(result.forearmLength, 8);                      // = upperArmLength
        assert.strictEqual(result.headHeight, 10);                        // = headWidth
        assert.ok(Math.abs(result.thighBottomWidth - 4.8) < 1e-10);     // 6 * 0.8
        assert.ok(Math.abs(result.shinBottomWidth - 4) < 1e-10);         // 5 * 0.8
        assert.strictEqual(result.shinLength, 24);               // default fallback
    });

    it('does not derive values when torsoTopWidth is missing', () => {
        const params = {
            upperArmTopWidth: 5,
        };
        const result = resolveParams(params, 42);

        assert.strictEqual(result.upperArmBottomWidth, undefined);
    });

    it('preserves seed in result', () => {
        const result = resolveParams({}, 12345);
        assert.strictEqual(result.seed, 12345);
    });

    it('is deterministic with same seed', () => {
        const params = {
            torsoTopWidth: { min: 10, max: 20 },
            headWidth: { min: 8, max: 12 },
        };
        const r1 = resolveParams(params, 42);
        const r2 = resolveParams(params, 42);

        assert.strictEqual(r1.torsoTopWidth, r2.torsoTopWidth);
        assert.strictEqual(r1.headWidth, r2.headWidth);
    });
});
