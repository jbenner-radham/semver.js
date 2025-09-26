import { getLogicalAndSpecifiers, normalizeSpecifier } from '../../src/satisfaction/util';
import { describe, expect, it } from 'vitest';

describe('getLogicalAndSpecifiers', () => {
  it('retrieves two version clauses', () => {
    expect(getLogicalAndSpecifiers('>1.0.0 <=2.0.0')).toEqual(['>1.0.0', '<=2.0.0']);
  });

  it('retrieves three version clauses', () => {
    const actual = getLogicalAndSpecifiers('~1.0.0 >1.0.0 <=1.1.0');
    const expected = ['~1.0.0', '>1.0.0', '<=1.1.0'];

    expect(actual).toEqual(expected);
  });

  it('extracts a version range', () => {
    expect(getLogicalAndSpecifiers('1.0.0 - 2.0.0')).toEqual(['1.0.0 - 2.0.0']);
  });

  it('extracts an invalid combination of a version clause and a range', () => {
    const actual = getLogicalAndSpecifiers('~1.0.0 1.0.0 - 2.0.0');
    const expected = ['~1.0.0', '1.0.0 - 2.0.0'];

    expect(actual).toEqual(expected);
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
