import { getCompositeSpecifiers, isCompositeSpecifier, normalizeSpecifier } from '../src/does.js';
import { describe, expect, it } from 'vitest';

describe('getCompositeSpecifiers', () => {
  it('returns a hyphenated range as a single specifier', () => {
    expect(getCompositeSpecifiers('1.0.0 - 5.0.0')).toEqual(['1.0.0 - 5.0.0']);
  });

  it('collapses whitespace on a hyphenated range', () => {
    expect(getCompositeSpecifiers('1.0.0   -   5.0.0')).toEqual(['1.0.0 - 5.0.0']);
  });

  it('returns two specifiers for a greater than and less than or equal to range', () => {
    expect(getCompositeSpecifiers('>1.0.0 <=5.0.0')).toEqual(['>1.0.0', '<=5.0.0']);
  });

  it('collapses whitespace on a greater than and less than or equal to range', () => {
    expect(getCompositeSpecifiers('> 1.0.0 <= 5.0.0')).toEqual(['>1.0.0', '<=5.0.0']);
  });

  it('returns two specifiers for a caret and less than or equal to range', () => {
    expect(getCompositeSpecifiers('^1.0.0 <=1.1.0')).toEqual(['^1.0.0', '<=1.1.0']);
  });

  it('returns two specifiers for a tilde and less than or equal to range', () => {
    expect(getCompositeSpecifiers('~1.0.0 <=1.1.0')).toEqual(['~1.0.0', '<=1.1.0']);
  });

  it('returns three specifiers for tilde, gt, and lte comparators', () => {
    const actual = getCompositeSpecifiers('~1.0.0 >1.0.0 <=1.1.0');
    const expected = ['~1.0.0', '>1.0.0', '<=1.1.0'];

    expect(actual).toEqual(expected);
  });
});

describe('isCompositeSpecifier', () => {
  it('returns false for a hyphenated range', () => {
    expect(isCompositeSpecifier('1.0.0 - 5.0.0')).toBe(false);
  });

  it('returns false for a hyphenated range with extra spaces', () => {
    expect(isCompositeSpecifier('1.0.0   -   5.0.0')).toBe(false);
  });

  it('returns true for a greater than and less than or equal range', () => {
    expect(isCompositeSpecifier('>1.0.0 <=5.0.0')).toBe(true);
  });

  it('returns true for a greater than and less than or equal range with spacing', () => {
    expect(isCompositeSpecifier('> 1.0.0 <= 5.0.0')).toBe(true);
  });
});

describe('normalizeSpecifier', () => {
  it('removes the trailing space on a greater than or equal to comparator', () => {
    expect(normalizeSpecifier('>= 1.0.0')).toEqual('>=1.0.0');
  });

  it('removes the trailing space on a less than comparator', () => {
    expect(normalizeSpecifier('<  1.0.0')).toEqual('<1.0.0');
  });

  it('removes the trailing space on a caret comparator', () => {
    expect(normalizeSpecifier('^     1.0.0')).toEqual('^1.0.0');
  });

  it('removes the trailing space on a tilde comparator', () => {
    expect(normalizeSpecifier('~ 1.0.0')).toEqual('~1.0.0');
  });

  it('normalizes the whitespace on hyphenated ranges', () => {
    expect(normalizeSpecifier('1.0.0   -   5.5.5')).to.toEqual('1.0.0 - 5.5.5');
  });
});
