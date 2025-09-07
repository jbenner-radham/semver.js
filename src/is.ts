import isPrerelease from './is-prerelease.js';
import parse from './parse.js';

class Comparator {
  #version = '';

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

  gt(version: string): boolean {
    return this.greaterThan(version);
  }

  greaterThanOrEqualTo(version: string): boolean {
    return this.greaterThan(version) || this.equalTo(version);
  }

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

  lt(version: string): boolean {
    return this.lessThan(version);
  }

  lessThanOrEqualTo(version: string): boolean {
    return this.lessThan(version) || this.equalTo(version);
  }

  lte(version: string): boolean {
    return this.lessThanOrEqualTo(version);
  }

  stable(): boolean {
    const { major } = parse(this.#version);

    return major > 0;
  }

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

export default function is(version: string): Comparator {
  return new Comparator(version);
}
