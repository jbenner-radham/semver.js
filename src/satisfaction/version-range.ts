import VersionClause from './version-clause';

export default class VersionRange {
  readonly #lower: VersionClause;

  readonly #upper: VersionClause;

  get lower(): VersionClause {
    return this.#lower;
  }

  get upper(): VersionClause {
    return this.#upper;
  }

  constructor({ lower, upper }: { lower: VersionClause; upper: VersionClause }) {
    this.#lower = lower;
    this.#upper = upper;
  }
}
