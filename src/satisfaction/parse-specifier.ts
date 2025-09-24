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
    | 'in-major'
    | 'in-minor'
    | 'in-patch'
    | 'in-prerelease'
    | 'in-build'
    | 'in-space'
    | 'in-hyphen'
    | 'in-hyphen-trailing-space';

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
  const prereleaseAndBuildStates: State[] = ['in-prerelease', 'in-build'];
  const versionCoreStates: State[] = ['in-major', 'in-minor', 'in-patch'];
  let isInBound: 'lower' | 'upper' = 'lower';
  let state: State = 'initialization';

  chars.forEach(char => {
    let doNotBufferChar = false;
    const isVersionNumberOrXChar = VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char);

    // if (state === 'initialization') {
    //   if (!isVersionNumberOrXChar && !(isInBound === 'upper' && char === ' ')) {
    //     throw new TypeError(
    //       `The character "${char}" is not valid at the start of a hyphenated range specifier`
    //     );
    //   }
    //
    //   state = 'in-major';
    if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'initialization':
          state = 'in-major';
          break;
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          throw new TypeError(
            `Character "${char}" is in an invalid position in the "${state}" state`
          );
      }
    } else if (char === ' ') {
      switch (state) {
        case 'initialization':
        case 'in-space':
          doNotBufferChar = true;
          break;
        case 'in-hyphen':
        case 'in-hyphen-trailing-space':
          if (isInBound === 'lower') {
            doNotBufferChar = true;
            isInBound = 'upper';
            state = 'initialization';
          } else {
            throw new TypeError(`The "${value}" hyphen range specifier is invalid`);
          }
          break;
        default:
          doNotBufferChar = true;
          state = 'in-space';
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-major':
          doNotBufferChar = true;
          state = 'in-minor';
          break;
        case 'in-minor':
          doNotBufferChar = true;
          state = 'in-patch';
          break;
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          throw new TypeError(
            'A "." character was found in an invalid position for a hyphenated range specifier'
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          doNotBufferChar = true;
          state = 'in-build';
          break;
        default:
          throw new TypeError(
            'A "+" character was found in an invalid position for a hyphenated range specifier'
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-patch':
          doNotBufferChar = true;
          state = 'in-prerelease';
          break;
        case 'in-space':
          doNotBufferChar = true;
          state = 'in-hyphen';
          break;
        default:
          throw new TypeError(
            `A "-" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${value}"`
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'in-major':
            throw new TypeError(`The "${char}" character is invalid for major versions`);
          case 'in-minor':
            throw new TypeError(`The "${char}" character is invalid for minor versions`);
          case 'in-patch':
            throw new TypeError(`The "${char}" character is invalid for patch versions`);
        }
      }
    } else if (prereleaseAndBuildStates.includes(state)) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
          case 'in-build':
            throw new TypeError(`The "${char}" character is invalid for a build`);
        }
      }
    }

    // The state has been updated by this point so we can act on it.
    if (doNotBufferChar) {
      return;
    }

    switch (state) {
      case 'in-major':
        buffer[isInBound].major += char;
        break;
      case 'in-minor':
        buffer[isInBound].minor += char;
        break;
      case 'in-patch':
        buffer[isInBound].patch += char;
        break;
      case 'in-prerelease':
        buffer[isInBound].prerelease += char;
        break;
      case 'in-build':
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
    | 'in-comparator'
    | 'in-major'
    | 'in-minor'
    | 'in-patch'
    | 'in-prerelease'
    | 'in-build'
    | 'in-space';

  const buffer = {
    comparator: '',
    major: '',
    minor: '',
    patch: '',
    prerelease: '',
    build: ''
  };
  const chars = [...specifier.trim()];
  const prereleaseAndBuildStates: State[] = ['in-prerelease', 'in-build'];
  const versionCoreStates: State[] = ['in-major', 'in-minor', 'in-patch'];
  let state: State = 'initialization';

  chars.forEach(char => {
    let doNotBufferChar = false;

    if (state === 'initialization') {
      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'in-comparator';
      } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'in-major';
      } else if (char === ' ') {
        doNotBufferChar = true;
      }
    } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
          state = 'in-major';
          break;
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          throw new TypeError(`Character "${char}" is in an invalid position`);
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-major':
          doNotBufferChar = true;
          state = 'in-minor';
          break;
        case 'in-minor':
          doNotBufferChar = true;
          state = 'in-patch';
          break;
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          throw new TypeError(
            'A "." character was found in an invalid position for a version specifier'
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          doNotBufferChar = true;
          state = 'in-build';
          break;
        default:
          throw new TypeError(
            'A "+" character was found in an invalid position for a version specifier'
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
          doNotBufferChar = true;
          state = 'in-prerelease';
          break;
        default:
          throw new TypeError(
            'A "-" character was found in an invalid position for a version specifier'
          );
      }
    } else if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
          break;
        default:
          throw new TypeError(
            `The "${char}" character is in an invalid position for a version specifier`
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'in-major':
            throw new TypeError(`The "${char}" character is invalid for major versions`);
          case 'in-minor':
            throw new TypeError(`The "${char}" character is invalid for minor versions`);
          case 'in-patch':
            throw new TypeError(`The "${char}" character is invalid for patch versions`);
        }
      }
    } else if (prereleaseAndBuildStates.includes(state)) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
          case 'in-build':
            throw new TypeError(`The "${char}" character is invalid for a build`);
        }
      }
    }

    // The state has been updated by this point so we can act on it.
    if (doNotBufferChar) {
      return;
    }

    switch (state) {
      case 'in-comparator':
        buffer.comparator += char;
        break;
      case 'in-major':
        buffer.major += char;
        break;
      case 'in-minor':
        buffer.minor += char;
        break;
      case 'in-patch':
        buffer.patch += char;
        break;
      case 'in-prerelease':
        buffer.prerelease += char;
        break;
      case 'in-build':
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
      throw new TypeError(`The specifier "${value}" has one or more invalid logical OR operators`);
    }

    return logicalOrSpecifiers.map(logicalOrSpecifier =>
      getLogicalAndSpecifiers(logicalOrSpecifier).map(parse)
    );
  }

  return [getLogicalAndSpecifiers(value).map(parse)];
}
