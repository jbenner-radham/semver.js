import {
  HYPHEN_RANGE_OPERATOR,
  LOGICAL_OR_OPERATOR,
  VALID_PRERELEASE_AND_BUILD_CHARS,
  VALID_SPECIFIER_COMPARATOR_CHARS,
  VALID_SPECIFIER_COMPARATORS,
  VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS
} from '../constants';

export function getLogicalAndSpecifiers(value: string): string[] {
  type State = 'initialization'
    | 'is-in-comparator'
    | 'is-in-major'
    | 'is-in-minor'
    | 'is-in-patch'
    | 'is-in-prerelease'
    | 'is-in-build'
    | 'is-in-space'
    | 'is-in-hyphen'
    | 'is-in-hyphen-trailing-space'
    | 'is-in-next-specifier';

  const isInPrereleaseOrBuildState = (state: State): boolean => {
    return ['is-in-prerelease', 'is-in-build'].includes(state);
  };

  const isInVersionCoreState = (state: State): boolean => {
    return ['is-in-major', 'is-in-minor', 'is-in-patch'].includes(state);
  };

  const chars = [...value.trim()];
  const specifiers: string[] = [];
  let buffer = '';
  let state: State = 'initialization';

  chars.forEach(char => {
    if (state === 'initialization') {
      const isComparatorChar = VALID_SPECIFIER_COMPARATOR_CHARS.includes(char);
      const isDigitOrXRangeChar = VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char);

      if (!isComparatorChar && !isDigitOrXRangeChar) {
        throw new TypeError(
          `The character "${char}" is not valid at the start of a version specifier`
        );
      }

      if (isComparatorChar) {
        state = 'is-in-comparator';
      } else if (isDigitOrXRangeChar) {
        state = 'is-in-major';
      }
    } else if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      switch (state) {
        case 'is-in-comparator':
          break;
        case 'is-in-major':
        case 'is-in-minor':
        case 'is-in-patch':
        case 'is-in-prerelease':
        case 'is-in-build':
          throw new TypeError(
            'A comparator must precede a version specifier, not be contained within it'
          );
        case 'is-in-space':
          state = 'is-in-next-specifier';
          break;
        case 'is-in-hyphen':
          throw new TypeError(
            'A comparator cannot immediately follow a hyphen in a version specifier'
          );
        case 'is-in-hyphen-trailing-space':
          throw new TypeError('A comparator cannot be a part of a version range specifier');
        default:
          state = 'is-in-comparator';
          break;
      }
    } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'is-in-comparator':
        case 'is-in-hyphen-trailing-space':
          state = 'is-in-major';
          break;
        case 'is-in-space':
          state = 'is-in-next-specifier';
          break;
      }
    } else if (char === ' ') {
      switch (state) {
        case 'is-in-hyphen':
          state = 'is-in-hyphen-trailing-space';
          break;
        case 'is-in-hyphen-trailing-space':
        case 'is-in-space':
          break;
        default:
          state = 'is-in-space';
      }
    } else if (char === '.') {
      switch (state) {
        case 'is-in-comparator':
          state = 'is-in-major';
          break;
        case 'is-in-major':
          state = 'is-in-minor';
          break;
        case 'is-in-minor':
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
          state = 'is-in-prerelease';
          break;
        case 'is-in-space':
          state = 'is-in-hyphen';
          break;
        default:
          throw new TypeError(
            'A "-" character was found in an invalid position for a version specifier'
          );
      }
    } else if (isInVersionCoreState(state)) {
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
    } else if (isInPrereleaseOrBuildState(state)) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'is-in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
          case 'is-in-build':
            throw new TypeError(`The "${char}" character is invalid for a build`);
        }
      }
    } else if (state === 'is-in-hyphen-trailing-space') {
      if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'is-in-major';
      } else if (char !== ' ') {
        throw new TypeError(`Invalid character "${char}" post hyphen`);
      }
    }

    if (state === 'is-in-next-specifier') {
      specifiers.push(buffer);

      buffer = '';

      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'is-in-comparator';
      } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'is-in-major';
      }
    }

    buffer += char;
  });

  specifiers.push(buffer);

  return specifiers.map(normalizeSpecifier);
}

export function getLogicalOrSpecifiers(value: string): string[] {
  return value.split(LOGICAL_OR_OPERATOR);
}

export function isHyphenRange(value: string): boolean {
  return value.includes(HYPHEN_RANGE_OPERATOR);
}

export function isLogicalOrSpecifier(value: string): boolean {
  return value.includes(LOGICAL_OR_OPERATOR);
}

export function normalizeSpecifier(value: string): string {
  const chars = [...value.trim()];
  let buffer = '';
  let shouldUnconditionallyBuffer = false;

  // Strip whitespace between a comparator and the rest of the version specifier.
  chars.forEach(char => {
    if (shouldUnconditionallyBuffer) {
      buffer += char;

      return;
    }

    if (char === ' ' && VALID_SPECIFIER_COMPARATORS.includes(buffer.trim())) {
      return;
    }

    if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      shouldUnconditionallyBuffer = true;
    }

    buffer += char;
  });

  // Normalize hyphenated ranges to only include a single space of padding.
  return buffer
    .split(' ')
    .filter(component => component !== '')
    .join(' ');
}
