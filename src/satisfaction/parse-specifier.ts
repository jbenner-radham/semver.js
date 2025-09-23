import {
  VALID_PRERELEASE_AND_BUILD_CHARS,
  VALID_SPECIFIER_COMPARATOR_CHARS,
  VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS
} from '../constants';
import type { VersionComparator } from '../types';
import { isEmptyString, trim } from '../util';
import ensureValidComparator from './ensure-valid-comparator';
import {
  getLogicalAndSpecifiers,
  getLogicalOrSpecifiers,
  isHyphenatedRange,
  isLogicalOrSpecifier
} from './util';
import VersionClause from './version-clause';
import VersionRange from './version-range';

function parseHyphenatedRange(value: string): VersionRange {
  type State = 'initialization'
    | 'is-in-major'
    | 'is-in-minor'
    | 'is-in-patch'
    | 'is-in-prerelease'
    | 'is-in-build'
    | 'is-in-space'
    | 'is-in-hyphen'
    | 'is-in-hyphen-trailing-space';

  const buffer = {
    lower: {
      major: '',
      minor: '',
      patch: '',
      prerelease: '',
      build: ''
    },
    upper: {
      major: '',
      minor: '',
      patch: '',
      prerelease: '',
      build: ''
    }
  };
  const chars = [...value.trim()];
  const prereleaseAndBuildStates: State[] = ['is-in-prerelease', 'is-in-build'];
  const versionCoreStates: State[] = ['is-in-major', 'is-in-minor', 'is-in-patch'];
  let doNotBufferChar = false;
  let isInBound: 'lower' | 'upper' = 'lower';
  let state: State = 'initialization';

  chars.forEach(char => {
    const isVersionNumberOrXChar = VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char);

    if (state === 'initialization') {
      if (!isVersionNumberOrXChar) {
        throw new TypeError(
          `The character "${char}" is not valid at the start of a hyphenated range specifier`
        );
      }

      state = 'is-in-major';
    } else if (char === ' ') {
      switch (state) {
        case 'is-in-hyphen':
          state = 'is-in-hyphen-trailing-space';
          break;
        case 'is-in-hyphen-trailing-space':
          if (isInBound === 'lower') {
            doNotBufferChar = true;
            isInBound = 'upper';
            state = 'initialization';
          } else {
            throw new TypeError(`The "${value}" hyphenated range specifier is invalid`);
          }
          break;
        case 'is-in-space':
          doNotBufferChar = true;
          break;
        default:
          doNotBufferChar = true;
          state = 'is-in-space';
      }
    } else if (char === '.') {
      switch (state) {
        case 'is-in-major':
          doNotBufferChar = true;
          state = 'is-in-minor';
          break;
        case 'is-in-minor':
          doNotBufferChar = true;
          state = 'is-in-patch';
          break;
        case 'is-in-prerelease':
        case 'is-in-build':
          break;
        default:
          throw new TypeError(
            'A "." character was found in an invalid position for a hyphenated range specifier'
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'is-in-major':
        case 'is-in-minor':
        case 'is-in-patch':
        case 'is-in-prerelease':
          doNotBufferChar = true;
          state = 'is-in-build';
          break;
        default:
          throw new TypeError(
            'A "+" character was found in an invalid position for a hyphenated range specifier'
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'is-in-major':
        case 'is-in-minor':
        case 'is-in-patch':
          doNotBufferChar = true;
          state = 'is-in-prerelease';
          break;
        default:
          throw new TypeError(
            'A "-" character was found in an invalid position for a hyphenated range specifier'
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'is-in-major':
            throw new TypeError(`The "${char}" character is invalid for major versions`);
          case 'is-in-minor':
            throw new TypeError(`The "${char}" character is invalid for minor versions`);
          case 'is-in-patch':
            throw new TypeError(`The "${char}" character is invalid for patch versions`);
        }
      }
    } else if (prereleaseAndBuildStates.includes(state)) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'is-in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
          case 'is-in-build':
            throw new TypeError(`The "${char}" character is invalid for a build`);
        }
      }
    }

    // The state has been updated by this point so we can act on it.
    if (doNotBufferChar) {
      return;
    }

    switch (state) {
      case 'is-in-major':
        buffer[isInBound].major += char;
        break;
      case 'is-in-minor':
        buffer[isInBound].minor += char;
        break;
      case 'is-in-patch':
        buffer[isInBound].patch += char;
        break;
      case 'is-in-prerelease':
        buffer[isInBound].prerelease += char;
        break;
      case 'is-in-build':
        buffer[isInBound].build += char;
        break;
    }
  });

  if (!buffer.upper.major) {
    throw new TypeError('An upper bound for a hyphenated range specifier could not be found');
  }

  if (!buffer.lower.major) {
    throw new TypeError('A lower bound for a hyphenated range specifier could not be found');
  }

  return new VersionRange({
    lower: new VersionClause({ ...buffer.lower }),
    upper: new VersionClause({ ...buffer.upper })
  });
}

function parseVersionClause(specifier: string): VersionClause {
  type State = 'initialization'
    | 'is-in-comparator'
    | 'is-in-major'
    | 'is-in-minor'
    | 'is-in-patch'
    | 'is-in-prerelease'
    | 'is-in-build'
    | 'is-in-space';

  const buffer = {
    comparator: '',
    major: '',
    minor: '',
    patch: '',
    prerelease: '',
    build: ''
  };
  const chars = [...specifier.trim()];
  const prereleaseAndBuildStates: State[] = ['is-in-prerelease', 'is-in-build'];
  const versionCoreStates: State[] = ['is-in-major', 'is-in-minor', 'is-in-patch'];
  let state: State = 'initialization';

  chars.forEach(char => {
    let doNotBufferChar = false;

    if (state === 'initialization') {
      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'is-in-comparator';
      } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'is-in-major';
      } else if (char === ' ') {
        doNotBufferChar = true;
      }
    } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'is-in-comparator':
          state = 'is-in-major';
          break;
        case 'is-in-minor':
        case 'is-in-patch':
        case 'is-in-prerelease':
        case 'is-in-build':
          break;
        default:
          throw new TypeError(`Character "${char}" is in an invalid position`);
      }
    } else if (char === '.') {
      switch (state) {
        case 'is-in-major':
          doNotBufferChar = true;
          state = 'is-in-minor';
          break;
        case 'is-in-minor':
          doNotBufferChar = true;
          state = 'is-in-patch';
          break;
        case 'is-in-prerelease':
        case 'is-in-build':
          break;
        default:
          throw new TypeError(
            'A "." character was found in an invalid position for a version specifier'
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'is-in-major':
        case 'is-in-minor':
        case 'is-in-patch':
        case 'is-in-prerelease':
          doNotBufferChar = true;
          state = 'is-in-build';
          break;
        default:
          throw new TypeError(
            'A "+" character was found in an invalid position for a version specifier'
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'is-in-major':
        case 'is-in-minor':
        case 'is-in-patch':
          doNotBufferChar = true;
          state = 'is-in-prerelease';
          break;
        default:
          throw new TypeError(
            'A "-" character was found in an invalid position for a version specifier'
          );
      }
    } else if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      switch (state) {
        case 'is-in-comparator':
          break;
        default:
          throw new TypeError(
            `The "${char}" character is in an invalid position for a version specifier`
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'is-in-major':
            throw new TypeError(`The "${char}" character is invalid for major versions`);
          case 'is-in-minor':
            throw new TypeError(`The "${char}" character is invalid for minor versions`);
          case 'is-in-patch':
            throw new TypeError(`The "${char}" character is invalid for patch versions`);
        }
      }
    } else if (prereleaseAndBuildStates.includes(state)) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'is-in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
          case 'is-in-build':
            throw new TypeError(`The "${char}" character is invalid for a build`);
        }
      }
    }

    // The state has been updated by this point so we can act on it.
    if (doNotBufferChar) {
      return;
    }

    switch (state) {
      case 'is-in-comparator':
        buffer.comparator += char;
        break;
      case 'is-in-major':
        buffer.major += char;
        break;
      case 'is-in-minor':
        buffer.minor += char;
        break;
      case 'is-in-patch':
        buffer.patch += char;
        break;
      case 'is-in-prerelease':
        buffer.prerelease += char;
        break;
      case 'is-in-build':
        buffer.build += char;
        break;
    }
  });

  ensureValidComparator(buffer.comparator);

  return new VersionClause({
    comparator: buffer.comparator as VersionComparator,
    major: buffer.major,
    minor: buffer.minor,
    patch: buffer.patch,
    prerelease: buffer.prerelease,
    build: buffer.build
  });
}

/**
 * Parses a version specifier.
 *
 * @returns A multidimensional array. Each column in a row represents logical AND expressions.
 * And each row represents logical OR expressions. If there is only one row, no logical OR
 * expressions are present.
 */
export default function parseSpecifier(value: string): (VersionClause | VersionRange)[][] {
  const parse = (value: string): VersionClause | VersionRange => {
    return isHyphenatedRange(value)
      ? parseHyphenatedRange(value)
      : parseVersionClause(value);
  };

  if (isLogicalOrSpecifier(value)) {
    const logicalOrSpecifiers = getLogicalOrSpecifiers(value);
    const isInvalidLogicalOr = logicalOrSpecifiers.map(trim).some(isEmptyString);

    if (isInvalidLogicalOr) {
      throw new TypeError(`The specifier "${value}" has one or more invalid logical or operators`);
    }

    return logicalOrSpecifiers.map(logicalOrSpecifier =>
      getLogicalAndSpecifiers(logicalOrSpecifier).map(parse)
    );
  }

  return [getLogicalAndSpecifiers(value).map(parse)];
}
