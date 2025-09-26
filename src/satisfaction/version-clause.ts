import { NORMALIZED_X_RANGE_CHAR, VALID_X_RANGE_CHARS } from '../constants';
import type { VersionComparator, VersionNumberOrXRange } from '../types';
import { isIntegerLike } from '../util';
import ensureValidComparator from './ensure-valid-comparator';

export default class VersionClause {
  readonly #comparator: VersionComparator;

  readonly #major: VersionNumberOrXRange;

  readonly #minor: VersionNumberOrXRange;

  readonly #patch: VersionNumberOrXRange;

  readonly #prerelease: string;

  get comparator(): VersionComparator {
    return this.#comparator;
  }

  get major(): VersionNumberOrXRange {
    return this.#major;
  }

  get minor(): VersionNumberOrXRange {
    return this.#minor;
  }

  get patch(): VersionNumberOrXRange {
    return this.#patch;
  }

  get prerelease(): string {
    return this.#prerelease;
  }

  #normalizeComparator(comparator: VersionComparator | ''): VersionComparator {
    return !comparator.length ? '=' : comparator as VersionComparator;
  }

  #normalizeNumberOrXRange(value: number | string): VersionNumberOrXRange {
    if (isIntegerLike(value)) {
      return Number.parseInt(value as string);
    }

    if (VALID_X_RANGE_CHARS.includes(value as string) || value === '') {
      return NORMALIZED_X_RANGE_CHAR;
    }

    throw new TypeError(`The version core value "${value}" is not a number or x range`);
  }

  constructor({
    comparator = '=',
    major,
    minor = '',
    patch = '',
    prerelease = ''
  }: {
    comparator?: VersionComparator;
    major: number | string;
    minor?: number | string;
    patch?: number | string;
    prerelease?: string;
  }) {
    ensureValidComparator(comparator);

    this.#comparator = this.#normalizeComparator(comparator);
    this.#major = this.#normalizeNumberOrXRange(major);
    this.#minor = this.#normalizeNumberOrXRange(minor);
    this.#patch = this.#normalizeNumberOrXRange(patch);
    this.#prerelease = prerelease;
  }

  toString(): string {
    const versionCore = `${this.major}.${this.minor}.${this.patch}`;

    return this.prerelease.length
      ? `${this.comparator}${versionCore}-${this.prerelease}`
      : `${this.comparator}${versionCore}`;
  }

  valueOf(): {
    comparator: VersionComparator;
    major: VersionNumberOrXRange;
    minor: VersionNumberOrXRange;
    patch: VersionNumberOrXRange;
    prerelease: string;
  } {
    return {
      comparator: this.#comparator,
      major: this.#major,
      minor: this.#minor,
      patch: this.#patch,
      prerelease: this.#prerelease
    };
  }
}
