import does from '../src/does';
import { describe, expect, it } from 'vitest';

// describe('getCompositeSpecifiers', () => {
//   it('returns a hyphenated range as a single specifier', () => {
//     expect(getCompositeSpecifiers('1.0.0 - 5.0.0')).toEqual(['1.0.0 - 5.0.0']);
//   });
//
//   it('collapses whitespace on a hyphenated range', () => {
//     expect(getCompositeSpecifiers('1.0.0   -   5.0.0')).toEqual(['1.0.0 - 5.0.0']);
//   });
//
//   it('returns two specifiers for a greater than and less than or equal to range', () => {
//     expect(getCompositeSpecifiers('>1.0.0 <=5.0.0')).toEqual(['>1.0.0', '<=5.0.0']);
//   });
//
//   it('collapses whitespace on a greater than and less than or equal to range', () => {
//     expect(getCompositeSpecifiers('> 1.0.0 <= 5.0.0')).toEqual(['>1.0.0', '<=5.0.0']);
//   });
//
//   it('returns two specifiers for a caret and less than or equal to range', () => {
//     expect(getCompositeSpecifiers('^1.0.0 <=1.1.0')).toEqual(['^1.0.0', '<=1.1.0']);
//   });
//
//   it('returns two specifiers for a tilde and less than or equal to range', () => {
//     expect(getCompositeSpecifiers('~1.0.0 <=1.1.0')).toEqual(['~1.0.0', '<=1.1.0']);
//   });
//
//   it('returns three specifiers for tilde, gt, and lte comparators', () => {
//     const actual = getCompositeSpecifiers('~1.0.0 >1.0.0 <=1.1.0');
//     const expected = ['~1.0.0', '>1.0.0', '<=1.1.0'];
//
//     expect(actual).toEqual(expected);
//   });
// });

// describe('isCompositeSpecifier', () => {
//   it('returns false for a hyphenated range', () => {
//     expect(isCompositeSpecifier('1.0.0 - 5.0.0')).toBe(false);
//   });
//
//   it('returns false for a hyphenated range with extra spaces', () => {
//     expect(isCompositeSpecifier('1.0.0   -   5.0.0')).toBe(false);
//   });
//
//   it('returns true for a greater than and less than or equal range', () => {
//     expect(isCompositeSpecifier('>1.0.0 <=5.0.0')).toBe(true);
//   });
//
//   it('returns true for a greater than and less than or equal range with spacing', () => {
//     expect(isCompositeSpecifier('> 1.0.0 <= 5.0.0')).toBe(true);
//   });
// });

describe('does', () => {
  it('is a function', () => {
    expect(does).toBeTypeOf('function');
  });

  describe('wildcards', () => {
    it('satisfies a wildcard ([EMPTY STRING])', () => {
      expect(does('1.0.0').satisfy('')).toBe(true);
    });

    it('satisfies a wildcard (*)', () => {
      expect(does('1.0.0').satisfy('*')).toBe(true);
    });

    it('satisfies a wildcard (X)', () => {
      expect(does('1.0.0').satisfy('X')).toBe(true);
    });

    it('satisfies a wildcard (x)', () => {
      expect(does('1.0.0').satisfy('x')).toBe(true);
    });

    it('satisfies a wildcard version', () => {
      expect(does('1.0.0').satisfy('x.x.x')).toBe(true);
    });

    it('satisfies a version verbatim', () => {
      expect(does('1.0.0').satisfy('1.0.0')).toBe(true);
    });

    it('satisfies a version with an equality comparator', () => {
      expect(does('1.0.0').satisfy('=1.0.0')).toBe(true);
    });
  });

  describe('less than (<)', () => {
    it('reports that 1.0.0 satisfies <5', () => {
      expect(does('1.0.0').satisfy('<5')).toBe(true);
    });

    it('reports that 1.0.0 satisfies <5.0.0', () => {
      expect(does('1.0.0').satisfy('<5.0.0')).toBe(true);
    });

    it('reports that 1.3.37 does not satisfy <1.0.0', () => {
      expect(does('1.3.37').satisfy('<1.0.0')).toBe(false);
    });

    it.only('reports that 2.0.0-beta.1 satisfies <2.0.0', () => {
      expect(does('2.0.0-beta.1').satisfy('<2.0.0')).toBe(true);
    });

    it('reports that 2.0.0-beta.1 does not satisfy <2.0', () => {
      expect(does('2.0.0-beta.1').satisfy('<2.0')).toBe(false);
    });

    it('reports that 2.0.0 satisfies >2.0.0-beta1', () => {
      expect(does('2.0.0').satisfy('>2.0.0-beta1')).toBe(false);
    });

    it('reports that 2.0.0-beta.1 satisfies <2.0.0-rc.1', () => {
      expect(does('2.0.0-beta.1').satisfy('<2.0.0-rc.1')).toBe(true);
    });

    it('reports that 2.0.0-rc.1 does not satisfy <2.0.0-beta.1', () => {
      expect(does('2.0.0-rc.1').satisfy('<2.0.0-beta.1')).toBe(false);
    });
  });
});
