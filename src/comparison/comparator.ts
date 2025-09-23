import isPrerelease from '../is-prerelease';
import parse from '../parse';

export default class Comparator {
  readonly #version: string;

  constructor(version: string) {
    this.#version = version;
  }

  #getComparableVersionString(version: string): string {
    // > Build metadata MUST be ignored when determining version precedence.
    const { major, minor, patch, prerelease } = parse(version);

    return prerelease.length
      ? `${major}.${minor}.${patch}-${prerelease}`
      : `${major}.${minor}.${patch}`;
  }

  equalTo(version: string): boolean {
    const subject = this.#getComparableVersionString(this.#version);
    const comparison = this.#getComparableVersionString(version);

    return subject === comparison;
  }

  /**
   * Shorthand convenience method for `.equalTo(...)`.
   */
  eq(version: string): boolean {
    return this.equalTo(version);
  }

  greaterThan(version: string): boolean {
    const subject = parse(this.#version);
    const comparison = parse(version);

    if (subject.major > comparison.major) {
      return true;
    }

    if (subject.minor > comparison.minor) {
      return true;
    }

    if (subject.patch > comparison.patch) {
      return true;
    }

    if (!subject.prerelease.length && comparison.prerelease.length) {
      return true;
    }

    return Boolean(
      subject.prerelease.length &&
      comparison.prerelease.length &&
      isPrerelease(subject.prerelease).greaterThan(comparison.prerelease)
    );
  }

  /**
   * Shorthand convenience method for `.greaterThan(...)`.
   */
  gt(version: string): boolean {
    return this.greaterThan(version);
  }

  greaterThanOrEqualTo(version: string): boolean {
    return this.greaterThan(version) || this.equalTo(version);
  }

  /**
   * Shorthand convenience method for `.greaterThanOrEqualTo(...)`.
   */
  gte(version: string): boolean {
    return this.greaterThanOrEqualTo(version);
  }

  lessThan(version: string): boolean {
    const subject = parse(this.#version);
    const comparison = parse(version);

    if (subject.major < comparison.major) {
      return true;
    }

    if (subject.minor < comparison.minor) {
      return true;
    }

    if (subject.patch < comparison.patch) {
      return true;
    }

    if (subject.prerelease.length && !comparison.prerelease.length) {
      return true;
    }

    return Boolean(
      subject.prerelease.length &&
      comparison.prerelease.length &&
      isPrerelease(subject.prerelease).lessThan(comparison.prerelease)
    );
  }

  /**
   * Shorthand convenience method for `.lessThan(...)`.
   */
  lt(version: string): boolean {
    return this.lessThan(version);
  }

  lessThanOrEqualTo(version: string): boolean {
    return this.lessThan(version) || this.equalTo(version);
  }

  /**
   * Shorthand convenience method for `.lessThanOrEqualTo(...)`.
   */
  lte(version: string): boolean {
    return this.lessThanOrEqualTo(version);
  }

  /**
   * Is the major version greater than zero.
   */
  stable(): boolean {
    const { major } = parse(this.#version);

    return major > 0;
  }

  /**
   * Is the major version equal to zero.
   */
  unstable(): boolean {
    const { major } = parse(this.#version);

    return major === 0;
  }

  valid(): boolean {
    try {
      const subject = parse(this.#version);

      return (
        !Number.isNaN(subject.major) &&
        !Number.isNaN(subject.minor) &&
        !Number.isNaN(subject.patch)
      );
    } catch (_) {
      return false;
    }
  }
}
