import parseSpecifier from '../src/satisfaction/parse-specifier';
import VersionClause from '../src/satisfaction/version-clause';
import VersionRange from '../src/satisfaction/version-range';
import { describe, expect, it } from 'vitest';

describe('parseSpecifier', () => {
  it('is a function', () => {
    expect(parseSpecifier).toBeTypeOf('function');
  });

  it('returns an array', () => {
    expect(Array.isArray(parseSpecifier('~1.2'))).toBe(true);
  });

  describe('when passed a version clause', () => {
    it('returns a multidimensional array with the corresponding instance', () => {
      // @ts-expect-error A multidimensional array is present.
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance).toBeInstanceOf(VersionClause);
    });

    it('correctly parses the version clause comparator', () => {
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance.comparator).toEqual('~');
    });

    it('correctly parses the version clause major version', () => {
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance.major).toEqual(1);
    });

    it('correctly parses the version clause minor version', () => {
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance.minor).toEqual(2);
    });

    it('correctly parses the version clause patch version', () => {
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance.patch).toEqual('x');
    });

    it('correctly parses the version clause pre-release', () => {
      const [[instance]] = parseSpecifier('~1.2');

      expect(instance.prerelease).toEqual('');
    });
  });

  describe('when passed a hyphen range', () => {
    it('returns a multidimensional array with the corresponding instance', () => {
      const [[instance]] = parseSpecifier('1.0.0 - 2.0.0');

      expect(instance).toBeInstanceOf(VersionRange);
    });
  });
});
