import { describe, expect, it } from 'vitest';
import isIntLike from '../lib/is-int-like.js';

describe('isIntLike', () => {
    it('is a function', () => {
        expect(isIntLike).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
        expect(isIntLike()).toBeTypeOf('boolean');
    });

    it('returns true when passed an integer', () => {
        expect(isIntLike(13)).toBe(true);
    });

    it('returns true when passed a string integer', () => {
        expect(isIntLike('55')).toBe(true);
    });

    it('returns false when passed a float', () => {
        expect(isIntLike(3.14159)).toBe(false);
    });

    it('returns false when passed a string float', () => {
        expect(isIntLike('1.337')).toBe(false);
    });

    it('returns false when passed a word', () => {
        expect(isIntLike('Hello!')).toBe(false);
    });

    it('returns false when passed NaN', () => {
        expect(isIntLike(NaN)).toBe(false);
    });

    it('returns false when passed an array', () => {
        expect(isIntLike([])).toBe(false);
    });

    it('returns false when passed an object', () => {
        expect(isIntLike({})).toBe(false);
    });
});
