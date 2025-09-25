import { NORMALIZED_X_RANGE_CHAR } from '../constants';
import isPrerelease from '../is-prerelease';
import parse from '../parse';
import SemanticVersion from '../semantic-version';
import { isNumber } from '../util';
import parseSpecifier from './parse-specifier';
import VersionClause from './version-clause';
import VersionRange from './version-range';

export default class Satisfier {
  #version: SemanticVersion;

  constructor(version: string) {
    this.#version = parse(version);
  }

  #inCaretRange(clause: VersionClause): boolean {
    const lowerClause = clause;

    // > Allows changes that do not modify the left-most non-zero element in the
    // > `[major, minor, patch]` tuple. In other words, this allows patch and minor updates for
    // > versions `1.0.0` and above, patch updates for versions `0.X >=0.1.0`, and no updates for
    // > versions `0.0.X`.
    //
    // > A missing `minor` and `patch` values will desugar to zero, but also allow flexibility
    // > within those values, even if the major version is zero.
    // > - `^1.x` := `>=1.0.0 <2.0.0-0`
    // > - `^0.x` := `>=0.0.0 <1.0.0-0`
    if (
      isNumber(clause.major) &&
      (clause.major !== 0 ||
        (clause.major === 0 && clause.minor === NORMALIZED_X_RANGE_CHAR))
    ) {
      const exclusiveUpperClause = new VersionClause({
        major: clause.major + 1,
        minor: 0,
        patch: 0,
        prerelease: '0'
      });

      return this.#isGreaterThanOrEqualTo(clause) && this.#isLessThan(exclusiveUpperClause);
    }

    // > When parsing caret ranges, a missing `patch` value desugars to the number `0`, but will
    // > allow flexibility within that value, even if the major and minor versions are both `0`.
    // > - `^1.2.x` := `>=1.2.0 <2.0.0-0`
    // > - `^0.0.x` := `>=0.0.0 <0.1.0-0`
    // > - `^0.0` := `>=0.0.0 <0.1.0-0`
    if (
      isNumber(clause.minor) &&
      (clause.minor !== 0 || clause.patch === NORMALIZED_X_RANGE_CHAR)
    ) {
      const exclusiveUpperClause = new VersionClause({
        major: clause.major,
        minor: clause.minor + 1,
        patch: 0,
        prerelease: '0'
      });

      return this.#isGreaterThanOrEqualTo(lowerClause) && this.#isLessThan(exclusiveUpperClause);
    }

    const exclusiveUpperClause = new VersionClause({
      major: clause.major,
      minor: clause.minor,
      patch: clause.patch === NORMALIZED_X_RANGE_CHAR ? clause.patch : clause.patch + 1,
      prerelease: '0'
    });

    return this.#isGreaterThanOrEqualTo(lowerClause) && this.#isLessThan(exclusiveUpperClause);
  }

  #inHyphenRange(range: VersionRange): boolean {
    return this.#isGreaterThanOrEqualTo(range.lower) || this.#isLessThanOrEqualTo(range.upper);
  }

  #inTildeRange(clause: VersionClause): boolean {
    const lowerClause = clause;

    // > Allows patch-level changes if a minor version is specified on the comparator.
    if (typeof clause.minor === 'number') {
      const exclusiveUpperClause = new VersionClause({
        major: clause.major,
        minor: clause.minor + 1,
        patch: 0,
        prerelease: '0'
      });

      return this.#isGreaterThanOrEqualTo(lowerClause) && this.#isLessThan(exclusiveUpperClause);
    }

    // > Allows minor-level changes if not.
    const exclusiveUpperClause = new VersionClause({
      major: clause.major === NORMALIZED_X_RANGE_CHAR ? clause.major : clause.major + 1,
      minor: 0,
      patch: 0,
      prerelease: '0'
    });

    return this.#isGreaterThanOrEqualTo(lowerClause) && this.#isLessThan(exclusiveUpperClause);
  }

  #isClauseSatisfied(clause: VersionClause): boolean {
    switch (clause.comparator) {
      case '<':
        return this.#isLessThan(clause);
      case '<=':
        return this.#isLessThanOrEqualTo(clause);
      case '=':
        return this.#isEqualTo(clause);
      case '>':
        return this.#isGreaterThan(clause);
      case '>=':
        return this.#isGreaterThanOrEqualTo(clause);
      case '^':
        return this.#inCaretRange(clause);
      case '~':
        return this.#inTildeRange(clause);
      default:
        throw new TypeError(`Invalid comparator "${clause.comparator}"`);
    }
  }

  #isEqualTo(clause: VersionClause): boolean {
    if (this.#isWildcard(clause)) {
      return true;
    }

    const satisfiesMajor =
      this.#version.major === clause.major || clause.major === NORMALIZED_X_RANGE_CHAR;
    const satisfiesMinor =
      this.#version.minor === clause.minor || clause.minor === NORMALIZED_X_RANGE_CHAR;
    const satisfiesPatch =
      this.#version.patch === clause.patch || clause.patch === NORMALIZED_X_RANGE_CHAR;
    const satisfiesPrerelease = this.#version.prerelease === clause.prerelease;

    return (
      satisfiesMajor &&
      satisfiesMinor &&
      satisfiesPatch &&
      satisfiesPatch &&
      satisfiesPrerelease
    );
  }

  #isGreaterThan(clause: VersionClause): boolean {
    if (
      this.#version.major === clause.major &&
      this.#version.minor === clause.minor &&
      this.#version.patch === clause.patch &&
      (this.#version.prerelease.length > 0 || clause.prerelease.length > 0)
    ) {
      return isPrerelease(this.#version.prerelease).greaterThan(clause.prerelease);
    }

    if (typeof clause.major === 'number' && this.#version.major > clause.major) {
      return true;
    } else if (clause.major === NORMALIZED_X_RANGE_CHAR || this.#version.major < clause.major) {
      return false;
    }

    if (typeof clause.minor === 'number' && this.#version.minor > clause.minor) {
      return true;
    } else if (clause.minor === NORMALIZED_X_RANGE_CHAR || this.#version.minor < clause.minor) {
      return false;
    }

    if (typeof clause.patch === 'number' && this.#version.patch > clause.patch) {
      return true;
    } else if (clause.patch === NORMALIZED_X_RANGE_CHAR || this.#version.patch < clause.patch) {
      return false;
    }

    throw new TypeError('Should not reach the end of method');
  }

  #isGreaterThanOrEqualTo(clause: VersionClause): boolean {
    return this.#isEqualTo(clause) || this.#isGreaterThan(clause);
  }

  #isLessThan(clause: VersionClause): boolean {
    if (
      this.#version.major === clause.major &&
      this.#version.minor === clause.minor &&
      this.#version.patch === clause.patch &&
      (this.#version.prerelease.length > 0 || clause.prerelease.length > 0)
    ) {
      return isPrerelease(this.#version.prerelease).lessThan(clause.prerelease);
    }

    if (typeof clause.major === 'number' && this.#version.major < clause.major) {
      return true;
    } else if (clause.major === NORMALIZED_X_RANGE_CHAR || this.#version.major > clause.major) {
      return false;
    }

    if (typeof clause.minor === 'number' && this.#version.minor < clause.minor) {
      return true;
    } else if (clause.minor === NORMALIZED_X_RANGE_CHAR || this.#version.minor > clause.minor) {
      return false;
    }

    if (typeof clause.patch === 'number' && this.#version.patch < clause.patch) {
      return true;
    } else if (clause.patch === NORMALIZED_X_RANGE_CHAR || this.#version.patch > clause.patch) {
      return false;
    }

    throw new TypeError('Should not reach the end of method');
  }

  #isLessThanOrEqualTo(clause: VersionClause): boolean {
    return this.#isEqualTo(clause) || this.#isLessThan(clause);
  }

  #isWildcard(clause: VersionClause): boolean {
    const { major, minor, patch } = clause;
    const versions = [major, minor, patch];

    return versions.every(version => version === NORMALIZED_X_RANGE_CHAR);
  }

  satisfy(specifier: string): boolean {
    const specifiers = parseSpecifier(specifier);
    const satisfactions = specifiers.map(logicalAndSpecifiers => {
      return logicalAndSpecifiers.every(specifier => {
        if (specifier instanceof VersionClause) {
          return this.#isClauseSatisfied(specifier);
        } else if (specifier instanceof VersionRange) {
          return this.#inHyphenRange(specifier);
        }
      });
    });

    return satisfactions.some(satisfaction => satisfaction);
  }
}
