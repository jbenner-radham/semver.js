import { isIntegerLike } from '../src/util';
import { describe, expect, it } from 'vitest';

describe('isIntegerLike', () => {
  it('is a function', () => {
    expect(isIntegerLike).toBeTypeOf('function');
  });

  it('returns a boolean', () => {
    expect(isIntegerLike('1')).toBeTypeOf('boolean');
  });

  it('returns true when passed an integer', () => {
    expect(isIntegerLike(13)).toBe(true);
  });

  it('returns true when passed a string integer', () => {
    expect(isIntegerLike('55')).toBe(true);
  });

  it('returns false when passed a float', () => {
    expect(isIntegerLike(3.14159)).toBe(false);
  });

  it('returns false when passed a string float', () => {
    expect(isIntegerLike('1.337')).toBe(false);
  });

  it('returns false when passed a word', () => {
    expect(isIntegerLike('Hello!')).toBe(false);
  });

  it('returns false when passed NaN', () => {
    expect(isIntegerLike(NaN)).toBe(false);
  });

  it('returns false when passed an array', () => {
    expect(isIntegerLike([])).toBe(false);
  });

  it('returns false when passed an object', () => {
    expect(isIntegerLike({})).toBe(false);
  });
});
