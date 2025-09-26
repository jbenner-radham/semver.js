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
  isHyphenRange,
  isLogicalOrSpecifier
} from './util';
import VersionClause from './version-clause';
import VersionRange from './version-range';

function parseHyphenRange(specifier: string): VersionRange {
  type State = 'initialization'
    | 'in-major'
    | 'in-minor'
    | 'in-patch'
    | 'in-prerelease'
    | 'in-space'
    | 'in-hyphen'
    | 'in-hyphen-trailing-space';

  const buffer = {
    lower: {
      major: '',
      minor: '',
      patch: '',
      prerelease: ''
    },
    upper: {
      major: '',
      minor: '',
      patch: '',
      prerelease: ''
    }
  };
  const chars = [...specifier.trim()];
  const versionCoreStates: State[] = ['in-major', 'in-minor', 'in-patch'];
  let isInBound: 'lower' | 'upper' = 'lower';
  let state: State = 'initialization';

  chars.forEach(char => {
    let doNotBuffer = false;

    if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'initialization':
          state = 'in-major';
          break;
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === ' ') {
      switch (state) {
        case 'initialization':
        case 'in-space':
          doNotBuffer = true;
          break;
        case 'in-hyphen':
        case 'in-hyphen-trailing-space':
          if (isInBound === 'lower') {
            doNotBuffer = true;
            isInBound = 'upper';
            state = 'initialization';
          } else {
            throw new TypeError(
              `A "${char}" character was found in an invalid position in the "${state}" state` +
              ` while parsing "${specifier}"`
            );
          }
          break;
        default:
          doNotBuffer = true;
          state = 'in-space';
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-major':
          doNotBuffer = true;
          state = 'in-minor';
          break;
        case 'in-minor':
          doNotBuffer = true;
          state = 'in-patch';
          break;
        case 'in-prerelease':
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'in-patch':
        case 'in-prerelease':
          throw new TypeError(`Build metadata found in "${specifier}"`);
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-patch':
          doNotBuffer = true;
          state = 'in-prerelease';
          break;
        case 'in-space':
          doNotBuffer = true;
          state = 'in-hyphen';
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'in-major':
            throw new TypeError(
              `The "${char}" character is invalid for MAJOR versions in "${specifier}"`
            );
          case 'in-minor':
            throw new TypeError(
              `The "${char}" character is invalid for MINOR versions in "${specifier}"`
            );
          case 'in-patch':
            throw new TypeError(
              `The "${char}" character is invalid for PATCH versions in "${specifier}"`
            );
        }
      }
    } else if (state === 'in-prerelease') {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'in-prerelease':
            throw new TypeError(
              `The "${char}" character is invalid for a pre-release in "${specifier}"`
            );
        }
      }
    }

    if (doNotBuffer) {
      return;
    }

    // The state has been updated by this point so we can act on it.
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
      default:
        throw new TypeError(`In invalid state "${state}" in "${specifier}"`);
    }
  });

  if (!buffer.upper.major) {
    throw new TypeError(
      `An upper bound for a hyphen range specifier could not be found in "${specifier}"`
    );
  }

  if (!buffer.lower.major) {
    throw new TypeError(
      `A lower bound for a hyphen range specifier could not be found in "${specifier}"`
    );
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
  const versionCoreStates: State[] = ['in-major', 'in-minor', 'in-patch'];
  let state: State = 'initialization';

  chars.forEach(char => {
    let doNotBuffer = false;

    if (state === 'initialization') {
      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'in-comparator';
      } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'in-major';
      } else if (char === ' ') {
        doNotBuffer = true;
      }
    } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
          state = 'in-major';
          break;
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-major':
          doNotBuffer = true;
          state = 'in-minor';
          break;
        case 'in-minor':
          doNotBuffer = true;
          state = 'in-patch';
          break;
        case 'in-prerelease':
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          throw new TypeError(`Build metadata found in "${specifier}"`);
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
          doNotBuffer = true;
          state = 'in-prerelease';
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
          break;
        default:
          throw new TypeError(
            `A "${char}" character was found in an invalid position in the "${state}" state while` +
            ` parsing "${specifier}"`
          );
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'in-major':
            throw new TypeError(
              `The "${char}" character is invalid for MAJOR versions in "${specifier}"
            `);
          case 'in-minor':
            throw new TypeError(
              `The "${char}" character is invalid for MINOR versions in "${specifier}"`
            );
          case 'in-patch':
            throw new TypeError(
              `The "${char}" character is invalid for PATCH versions in "${specifier}"`
            );
        }
      }
    } else if (state === 'in-prerelease') {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'in-prerelease':
            throw new TypeError(
              `The "${char}" character is invalid for a pre-release in "${specifier}"`
            );
        }
      }
    }

    if (doNotBuffer) {
      return;
    }

    // The state has been updated by this point so we can act on it.
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
      default:
        throw new TypeError(`In invalid state "${state}" in "${specifier}"`);
    }
  });

  ensureValidComparator(buffer.comparator);

  return new VersionClause({
    ...buffer,
    comparator: buffer.comparator as VersionComparator
  });
}

/**
 * Parses a version specifier.
 *
 * @returns A multidimensional array. Each column in a row represents logical AND expressions.
 * And each row represents logical OR expressions. If there is only one row, no logical OR
 * expressions are present.
 */
export default function parseSpecifier(specifier: string): (VersionClause | VersionRange)[][] {
  const parse = (value: string): VersionClause | VersionRange => {
    return isHyphenRange(value)
      ? parseHyphenRange(value)
      : parseVersionClause(value);
  };

  let specifiers: (VersionClause | VersionRange)[][] = [[]];

  if (isLogicalOrSpecifier(specifier)) {
    const logicalOrSpecifiers = getLogicalOrSpecifiers(specifier);
    const isInvalidLogicalOr = logicalOrSpecifiers.map(trim).some(isEmptyString);

    if (isInvalidLogicalOr) {
      throw new TypeError(
        `The specifier "${specifier}" has one or more invalid logical OR operators`
      );
    }

    specifiers = logicalOrSpecifiers.map(logicalOrSpecifier =>
      getLogicalAndSpecifiers(logicalOrSpecifier).map(parse)
    );
  } else {
    specifiers = [getLogicalAndSpecifiers(specifier).map(parse)];
  }

  specifiers.forEach(logicalAndSpecifiers => {
    let clauseIsPresent = false;
    let rangeIsPresent = false;

    logicalAndSpecifiers.forEach(logicalAndSpecifier => {
      if (logicalAndSpecifier instanceof VersionClause) {
        clauseIsPresent = true;
      } else if (logicalAndSpecifier instanceof VersionRange) {
        rangeIsPresent = true;
      } else {
        const type = Object.getPrototypeOf(logicalAndSpecifier).constructor.name;

        throw new TypeError(
          `Invalid instance of type "${type}" encountered while parsing "${specifier}"`
        );
      }
    });

    if (clauseIsPresent && rangeIsPresent) {
      throw new TypeError(
        `Both a version clause and hyphen range are grouped by an AND operator in "${specifier}"`
      );
    }
  });

  return specifiers;
}
