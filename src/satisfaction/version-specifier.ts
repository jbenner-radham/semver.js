import type { VersionSpecifierType } from '../types';
import VersionClause from './version-clause';
import VersionRange from './version-range';

export default class VersionSpecifier {
  readonly #type: VersionSpecifierType;

  readonly #value: VersionClause | VersionRange;

  get type(): VersionSpecifierType {
    return this.#type;
  }

  get value(): VersionClause | VersionRange {
    return this.#value;
  }

  static from(value: VersionClause | VersionRange): VersionSpecifier {
    return new VersionSpecifier(value);
  }

  constructor(value: VersionClause | VersionRange) {
    if (value instanceof VersionClause) {
      this.#type = 'clause';
    } else if (value instanceof VersionRange) {
      this.#type = 'range';
    } else {
      throw new TypeError('Invalid instance type passed to VersionSpecifier');
    }

    this.#value = value;
  }
}
