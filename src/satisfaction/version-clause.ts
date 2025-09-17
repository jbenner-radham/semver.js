import { NORMALIZED_X_RANGE_CHAR, VALID_X_RANGE_CHARS } from '../constants';
import isIntLike from '../is-int-like';
import type { VersionComparator, VersionNumberOrXRange } from '../types';
import ensureValidComparator from './ensure-valid-comparator';

export default class VersionClause {
  readonly #comparator: VersionComparator;

  readonly #major: VersionNumberOrXRange;

  readonly #minor: VersionNumberOrXRange;

  readonly #patch: VersionNumberOrXRange;

  readonly #prerelease: string;

  readonly #build: string;

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

  get build(): string {
    return this.#build;
  }

  #normalizeComparator(value: VersionComparator | ''): VersionComparator {
    return !value.length ? '=' : value as VersionComparator;
  }

  #normalizeNumberOrXRange(value: number | string): VersionNumberOrXRange {
    if (isIntLike(value)) {
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
    prerelease = '',
    build = ''
  }: {
    comparator?: VersionComparator;
    major: number | string;
    minor?: number | string;
    patch?: number | string;
    prerelease?: string;
    build?: string;
  }) {
    ensureValidComparator(comparator);

    this.#comparator = this.#normalizeComparator(comparator);
    this.#major = this.#normalizeNumberOrXRange(major);
    this.#minor = this.#normalizeNumberOrXRange(minor);
    this.#patch = this.#normalizeNumberOrXRange(patch);
    this.#prerelease = prerelease;
    this.#build = build;
  }
}
