import isPrerelease from './is-prerelease.js';
import parse from './parse.js';

class Comparator {
    #version = '';

    constructor(version = '') {
        this.#version = version;
    }

    #getComparableVersionString(version = '') {
        const { major, minor, patch, prerelease } = parse(version);

        return prerelease.length ? `${major}.${minor}.${patch}-${prerelease}` : `${major}.${minor}.${patch}`;
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

        if (
            subject.prerelease.length &&
            comparison.prerelease.length &&
            isPrerelease(subject.prerelease).greaterThan(comparison.prerelease)
        ) {
            return true;
        }

        return false;
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

        return false;
    }

    lessThanOrEqualTo(version = '') {
        return this.lessThan(version) || this.equalTo(version);
    }
}

export default function is(version = '') {
    return new Comparator(version);
}
