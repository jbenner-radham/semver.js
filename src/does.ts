import {
  VALID_SPECIFIER_COMPARATOR_CHARS,
  VALID_SPECIFIER_COMPARATORS,
  VALID_SPECIFIER_VERSION_CORE_CHARS
} from './constants';
import is from './is';
import { normalizeSpecifier } from './satisfaction/util';
import stripSpecifierPrefixOperator from './strip-specifier-prefix-operator';

function isAnySpecifier(specifier: string): boolean {
  return specifier === '*' || specifier === '';
}

// export function isCompositeSpecifier(specifier: string): boolean {
//   type State = 'initialization'
//     | 'is-in-prefix-operator'
//     | 'is-in-version-core'
//     | 'is-in-prerelease'
//     | 'is-in-build'
//     | 'is-in-whitespace'
//     | 'is-in-hyphen'
//     | 'is-in-hyphen-whitespace';
//
//   const chars = [...specifier.trim()];
//   let count = 0;
//   let state: State = 'initialization';
//
//   chars.forEach(char => {
//     if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
//       state = 'is-in-prefix-operator';
//     } else if (VALID_SPECIFIER_VERSION_CORE_CHARS.includes(char)) {
//       if (['initialization', 'is-in-whitespace', 'is-in-prefix-operator'].includes(state)) {
//         count++;
//       }
//
//       state = 'is-in-version-core';
//     } else if (char === ' ') {
//       switch (state) {
//         case 'is-in-hyphen-whitespace':
//           break;
//         case 'is-in-hyphen':
//           state = 'is-in-hyphen-whitespace';
//           break;
//         default:
//           state = 'is-in-whitespace';
//       }
//     } else if (char === '-') {
//       switch (state) {
//         case 'is-in-version-core':
//           state = 'is-in-prerelease';
//           break;
//         case 'is-in-whitespace':
//           state = 'is-in-hyphen';
//           break;
//         default:
//           throw new TypeError('Hyphen in invalid position in version specifier');
//       }
//     } else if (char === '+') {
//       state = 'is-in-build';
//     }
//   });
//
//   return count > 1;
// }

export function getCompositeSpecifiers(specifier: string): string[] {
  type State = 'initialization'
    | 'is-in-prefix-operator'
    | 'is-in-version-core'
    | 'is-in-prerelease'
    | 'is-in-build'
    | 'is-in-whitespace'
    | 'is-in-hyphen'
    | 'is-in-hyphen-whitespace';

  const chars = [...specifier.trim()];
  const specifiers: string[] = [];
  let buffer = '';
  let state: State = 'initialization';

  chars.forEach(char => {
    if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      if (state === 'is-in-whitespace') {
        specifiers.push(buffer);

        buffer = '';
      }

      state = 'is-in-prefix-operator';
    } else if (VALID_SPECIFIER_VERSION_CORE_CHARS.includes(char)) {
      const isBufferASpecifierPrefix = (): boolean => {
        const chars = [...buffer.trim()];

        return chars.every(char => VALID_SPECIFIER_COMPARATOR_CHARS.includes(char));
      };

      if (state === 'is-in-whitespace' && !isBufferASpecifierPrefix()) {
        specifiers.push(buffer);

        buffer = '';
      }

      state = 'is-in-version-core';
    } else if (char === ' ') {
      switch (state) {
        case 'is-in-hyphen-whitespace':
          break;
        case 'is-in-hyphen':
          state = 'is-in-hyphen-whitespace';
          break;
        case 'is-in-whitespace':
          break;
        default:
          state = 'is-in-whitespace';
      }
    } else if (char === '-') {
      switch (state) {
        case 'is-in-version-core':
          state = 'is-in-prerelease';
          break;
        case 'is-in-whitespace':
          state = 'is-in-hyphen';
          break;
        default:
          throw new TypeError('Hyphen in invalid position in version specifier');
      }
    } else if (char === '+') {
      state = 'is-in-build';
    }

    if (char !== ' ' || (char === ' ' && !buffer.endsWith(' '))) {
      buffer += char;
    }
  });

  if (buffer.length) {
    specifiers.push(buffer);
  }

  // return specifiers.map(specifier => specifier.trim());
  return specifiers.map(normalizeSpecifier);
}

export function isCompositeSpecifier(specifier: string): boolean {
  return getCompositeSpecifiers(specifier).length > 1;
}

function isEqualSpecifier(specifier: string): boolean {
  if (is(specifier).valid()) {
    return true;
  }

  return specifier.startsWith('=') && is(specifier.replace('=', '')).valid();
}

export function isHyphenatedRangeSpecifier(specifier: string): boolean {
  const hyphen = ' - ';

  return !specifier.startsWith(hyphen) && !specifier.endsWith(hyphen) && specifier.includes(hyphen);
}

function getLogicalOrSpecifiers(specifier: string): string[] {
  return specifier.split('||').map(specifier => specifier.trim());
}

class Satisfier {
  #version: string;

  constructor(version: string) {
    this.#version = version;
  }

  satisfy(specifier: string) {
    if (isAnySpecifier(specifier)) {
      return true;
    }

    if (isEqualSpecifier(specifier)) {
      const specifiedVersion = stripSpecifierPrefixOperator(specifier);

      return is(this.#version).equalTo(specifiedVersion);
    }
  }
}
