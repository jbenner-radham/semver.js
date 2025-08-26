import isPrerelease from './is-prerelease.js';
import parse from './parse.js';
import parsePrerelease from './parse-prerelease.js';

class Comparator {
  #version = '';

  constructor(version = '') {
    this.#version = version;
  }

  #getComparableVersionString(version = '') {
    // > Build metadata MUST be ignored when determining version precedence.
    const { major, minor, patch, prerelease } = parse(version);

    return prerelease.length
      ? `${major}.${minor}.${patch}-${prerelease}`
      : `${major}.${minor}.${patch}`;
  }

  equalTo(version = '') {
    const subject = this.#getComparableVersionString(this.#version);
    const comparison = this.#getComparableVersionString(version);

    return subject === comparison;
  }

  greaterThan(version = '') {
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

  greaterThanOrEqualTo(version = '') {
    return this.greaterThan(version) || this.equalTo(version);
  }

  lessThan(version = '') {
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

  lessThanOrEqualTo(version = '') {
    return this.lessThan(version) || this.equalTo(version);
  }

  stable() {
    const { major } = parse(this.#version);

    return major > 0;
  }

  unstable() {
    const { major } = parse(this.#version);

    return major === 0;
  }

  valid() {
    try {
      const subject = parse(this.#version);

      if (subject.prerelease.length) {
        parsePrerelease(subject.prerelease);
      }

      return (
        typeof subject.major === 'number' &&
                !Number.isNaN(subject.major) &&
                typeof subject.minor === 'number' &&
                !Number.isNaN(subject.minor) &&
                typeof subject.patch === 'number' &&
                !Number.isNaN(subject.patch)
      );
    } catch (_) {
      return false;
    }
  }
}

export default function is(version = '') {
  return new Comparator(version);
}
