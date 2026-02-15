import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SeededRandom, hash } from '../js/utils/random.js';

describe('SeededRandom', () => {
    it('produces deterministic output for the same seed', () => {
        const rng1 = new SeededRandom(42);
        const rng2 = new SeededRandom(42);
        const seq1 = [rng1.next(), rng1.next(), rng1.next()];
        const seq2 = [rng2.next(), rng2.next(), rng2.next()];
        assert.deepStrictEqual(seq1, seq2);
    });

    it('produces different output for different seeds', () => {
        const rng1 = new SeededRandom(42);
        const rng2 = new SeededRandom(99);
        assert.notStrictEqual(rng1.next(), rng2.next());
    });

    it('next() returns values in [0, 1)', () => {
        const rng = new SeededRandom(123);
        for (let i = 0; i < 100; i++) {
            const val = rng.next();
            assert.ok(val >= 0, `Expected >= 0, got ${val}`);
            assert.ok(val < 1, `Expected < 1, got ${val}`);
        }
    });

    it('float(min, max) returns values in [min, max)', () => {
        const rng = new SeededRandom(456);
        for (let i = 0; i < 100; i++) {
            const val = rng.float(10, 20);
            assert.ok(val >= 10, `Expected >= 10, got ${val}`);
            assert.ok(val < 20, `Expected < 20, got ${val}`);
        }
    });

    it('int(min, max) returns integers in [min, max]', () => {
        const rng = new SeededRandom(789);
        for (let i = 0; i < 100; i++) {
            const val = rng.int(5, 10);
            assert.ok(Number.isInteger(val), `Expected integer, got ${val}`);
            assert.ok(val >= 5, `Expected >= 5, got ${val}`);
            assert.ok(val <= 10, `Expected <= 10, got ${val}`);
        }
    });
});

describe('hash', () => {
    it('produces deterministic output', () => {
        const h1 = hash(10, 20, 42);
        const h2 = hash(10, 20, 42);
        assert.strictEqual(h1, h2);
    });

    it('returns values in [0, 1)', () => {
        for (let i = 0; i < 100; i++) {
            const val = hash(i, i * 2, 42);
            assert.ok(val >= 0, `Expected >= 0, got ${val}`);
            assert.ok(val < 1, `Expected < 1, got ${val}`);
        }
    });

    it('different inputs produce different outputs', () => {
        const h1 = hash(1, 2, 42);
        const h2 = hash(3, 4, 42);
        assert.notStrictEqual(h1, h2);
    });
});
