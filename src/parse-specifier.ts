import {
  PREFERRED_X_RANGE_CHAR,
  VALID_PRERELEASE_AND_BUILD_CHARS, VALID_SPECIFIER_COMPARATOR_CHARS, VALID_SPECIFIER_COMPARATORS,
  VALID_SPECIFIER_VERSION_DIGIT_AND_X_CHARS, VALID_X_RANGE_CHARS
} from './constants';
import { isHyphenatedRangeSpecifier } from './does';
import isIntLike from './is-int-like';

type VersionSpecifierComparator = '<' | '<=' | '=' | '>' | '>=' | '^' | '~';

type VersionSpecifierNumberOrX = number | typeof PREFERRED_X_RANGE_CHAR;

export class VersionSpecifier {
  #comparator: VersionSpecifierComparator | '';

  #major: VersionSpecifierNumberOrX;

  #minor: VersionSpecifierNumberOrX;

  #patch: VersionSpecifierNumberOrX;

  #prerelease: string;

  #build: string;

  get comparator(): VersionSpecifierComparator | '' {
    return this.#comparator;
  }

  get major(): VersionSpecifierNumberOrX {
    return this.#major;
  }

  get minor(): VersionSpecifierNumberOrX {
    return this.#minor;
  }

  get patch(): VersionSpecifierNumberOrX {
    return this.#patch;
  }

  get prerelease(): string {
    return this.#prerelease;
  }

  get build(): string {
    return this.#build;
  }

  #ensureValidComparator(value: string): void {
    if (value.length && !VALID_SPECIFIER_COMPARATORS.includes(value)) {
      throw new TypeError(`The comparator "${value}" is invalid`);
    }
  }

  #normalizeNumberOrX(value: number | string): VersionSpecifierNumberOrX {
    if (isIntLike(value)) {
      return Number.parseInt(value as string);
    }

    if (VALID_X_RANGE_CHARS.includes(value as string) || value === '') {
      return PREFERRED_X_RANGE_CHAR;
    }

    throw new TypeError(`The version core value "${value}" is not a number or x value`);
  }

  constructor({
    comparator = '',
    major,
    minor = '',
    patch = '',
    prerelease = '',
    build = ''
  }: {
    comparator?: string;
    major: number | string;
    minor?: number | string;
    patch?: number | string;
    prerelease?: string;
    build?: string;
  }) {
    this.#ensureValidComparator(comparator);

    this.#comparator = comparator as VersionSpecifierComparator | '';
    this.#major = this.#normalizeNumberOrX(major);
    this.#minor = this.#normalizeNumberOrX(minor);
    this.#patch = this.#normalizeNumberOrX(patch);
    this.#prerelease = prerelease;
    this.#build = build;
  }
}

export class VersionSpecifierRange {
  #lower: VersionSpecifier;

  #upper: VersionSpecifier;

  get lower(): VersionSpecifier {
    return this.#lower;
  }

  get upper(): VersionSpecifier {
    return this.#upper;
  }

  constructor({ lower, upper }: { lower: VersionSpecifier; upper: VersionSpecifier }) {
    this.#lower = lower;
    this.#upper = upper;
  }
}

function parseHyphenatedRangeSpecifier(specifier: string): VersionSpecifierRange {
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
  const chars = [...specifier.trim()];
  const prereleaseAndBuildStates: State[] = ['is-in-prerelease', 'is-in-build'];
  const versionCoreStates: State[] = ['is-in-major', 'is-in-minor', 'is-in-patch'];
  let doNotBufferChar = false;
  let isInBound: 'lower' | 'upper' = 'lower';
  let state: State = 'initialization';

  chars.forEach(char => {
    const isVersionNumberOrXChar = VALID_SPECIFIER_VERSION_DIGIT_AND_X_CHARS.includes(char);

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
            throw new TypeError(`The "${specifier}" hyphenated range specifier is invalid`);
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
      if (!VALID_SPECIFIER_VERSION_DIGIT_AND_X_CHARS.includes(char)) {
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

  return new VersionSpecifierRange({
    lower: new VersionSpecifier({
      major: buffer.lower.major,
      minor: buffer.lower.minor,
      patch: buffer.lower.patch,
      prerelease: buffer.lower.prerelease,
      build: buffer.lower.build
    }),
    upper: new VersionSpecifier({
      major: buffer.upper.major,
      minor: buffer.upper.minor,
      patch: buffer.upper.patch,
      prerelease: buffer.upper.prerelease,
      build: buffer.upper.build
    })
  });
}

function parseNonHyphenatedRangeSpecifier(specifier: string): VersionSpecifier {
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
  let doNotBufferChar = false;
  let state: State = 'initialization';

  chars.forEach(char => {
    if (state === 'initialization') {
      if (VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
        state = 'is-in-comparator';
      } else if (VALID_SPECIFIER_VERSION_DIGIT_AND_X_CHARS.includes(char)) {
        state = 'is-in-major';
      } else if (char === ' ') {
        doNotBufferChar = true;
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
      if (!VALID_SPECIFIER_VERSION_DIGIT_AND_X_CHARS.includes(char)) {
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

  return new VersionSpecifier({
    comparator: buffer.comparator,
    major: buffer.major,
    minor: buffer.minor,
    patch: buffer.patch,
    prerelease: buffer.prerelease,
    build: buffer.build
  });
}

export default function parseSpecifier(value: string): VersionSpecifier | VersionSpecifierRange {
  return isHyphenatedRangeSpecifier(value)
    ? parseHyphenatedRangeSpecifier(value)
    : parseNonHyphenatedRangeSpecifier(value);
}
