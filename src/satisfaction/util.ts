import {
  HYPHEN_RANGE_OPERATOR,
  LOGICAL_OR_OPERATOR,
  VALID_PRERELEASE_AND_BUILD_CHARS,
  VALID_SPECIFIER_COMPARATOR_CHARS,
  VALID_SPECIFIER_COMPARATORS,
  VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS
} from '../constants';
import { getParsingErrorMessage } from '../util';

export function getLogicalAndSpecifiers(specifier: string): string[] {
  type State = 'initialization'
    | 'in-comparator'
    | 'in-major'
    | 'in-minor'
    | 'in-patch'
    | 'in-prerelease'
    | 'in-space'
    | 'in-hyphen'
    | 'in-hyphen-trailing-space'
    | 'in-next-specifier';

  const chars = [...specifier.trim()];
  const specifiers: string[] = [];
  const versionCoreStates: State[] = ['in-major', 'in-minor', 'in-patch'];
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
        state = 'in-comparator';
      } else if (isDigitOrXRangeChar) {
        state = 'in-major';
      }
    } else if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
          break;
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
          throw new TypeError(
            'A comparator must precede a version specifier, not be contained within it'
          );
        case 'in-space':
          state = 'in-next-specifier';
          break;
        case 'in-hyphen':
          throw new TypeError(
            'A comparator cannot immediately follow a hyphen in a version specifier'
          );
        case 'in-hyphen-trailing-space':
          throw new TypeError('A comparator cannot be a part of a version range specifier');
        default:
          state = 'in-comparator';
          break;
      }
    } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
      switch (state) {
        case 'in-comparator':
        case 'in-hyphen-trailing-space':
          state = 'in-major';
          break;
        case 'in-space':
          state = 'in-next-specifier';
          break;
      }
    } else if (char === ' ') {
      switch (state) {
        case 'in-hyphen':
          state = 'in-hyphen-trailing-space';
          break;
        case 'in-hyphen-trailing-space':
        case 'in-space':
          break;
        default:
          state = 'in-space';
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-comparator':
          state = 'in-major';
          break;
        case 'in-major':
          state = 'in-minor';
          break;
        case 'in-minor':
          state = 'in-patch';
          break;
        case 'in-prerelease':
          break;
        default:
          throw new TypeError(getParsingErrorMessage({ char, state, within: specifier }));
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
          state = 'in-prerelease';
          break;
        case 'in-space':
          state = 'in-hyphen';
          break;
        default:
          throw new TypeError(getParsingErrorMessage({ char, state, within: specifier }));
      }
    } else if (versionCoreStates.includes(state)) {
      if (!VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        switch (state) {
          case 'in-major':
            throw new TypeError(`The "${char}" character is invalid for MAJOR versions`);
          case 'in-minor':
            throw new TypeError(`The "${char}" character is invalid for MINOR versions`);
          case 'in-patch':
            throw new TypeError(`The "${char}" character is invalid for PATCH versions`);
        }
      }
    } else if (state === 'in-prerelease') {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        switch (state) {
          case 'in-prerelease':
            throw new TypeError(`The "${char}" character is invalid for a pre-release`);
        }
      }
    } else if (state === 'in-hyphen-trailing-space') {
      if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'in-major';
      } else if (char !== ' ') {
        throw new TypeError(`Invalid character "${char}" post hyphen`);
      }
    } else {
      throw new TypeError(getParsingErrorMessage({ char, state, within: specifier }));
    }

    if (state === 'in-next-specifier') {
      specifiers.push(buffer);

      buffer = '';

      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'in-comparator';
      } else if (VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS.includes(char)) {
        state = 'in-major';
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
