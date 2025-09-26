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
      const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

      expect(instance).toBeInstanceOf(VersionRange);
    });

    describe('the instance in the returned multidimensional array', () => {
      it('has a lower bound', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower).toBeInstanceOf(VersionClause);
      });

      it('has a lower bound with a comparator', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower.comparator).toEqual('=');
      });

      it('has a lower bound with a major version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower.major).toEqual(1);
      });

      it('has a lower bound with a minor version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower.minor).toEqual(0);
      });

      it('has a lower bound with a patch version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower.patch).toEqual(0);
      });

      it('has a lower bound with a pre-release', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).lower.prerelease).toEqual('rc.1');
      });

      it('has an upper bound', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect(instance.upper).toBeInstanceOf(VersionClause);
      });

      it('has an upper bound with a major version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).upper.major).toEqual(2);
      });

      it('has an upper bound with a minor version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).upper.minor).toEqual(0);
      });

      it('has an upper bound with a patch version', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).upper.patch).toEqual(0);
      });

      it('has an upper bound with a pre-release', () => {
        const [[instance]] = parseSpecifier('1.0.0-rc.1 - 2.0.0');

        expect((instance satisfies VersionRange).upper.prerelease).toEqual('');
      });
    });
  });
});
