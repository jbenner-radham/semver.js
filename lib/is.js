import parse from './parse.js';

class Comparator {
    #version = '';

    constructor(version = '') {
        this.#version = version;
    }

    #getComparableVersionString(version = '') {
        const { major, minor, patch, preRelease } = parse(version);

        return preRelease.length ? `${major}.${minor}.${patch}-${preRelease}` : `${major}.${minor}.${patch}`;
    }

    equalTo(version = '') {
        const subject = this.#getComparableVersionString(this.#version);
        const comparison = this.#getComparableVersionString(version);

        return subject === comparison;
    }

    greaterThan(version = '') {
        const initial = parse(this.#version);
        const comparison = parse(version);

        if (initial.major > comparison.major) {
            return true;
        }

        if (initial.minor > comparison.minor) {
            return true;
        }

        if (initial.patch > comparison.patch) {
            return true;
        }

        return false;
    }

    greaterThanOrEqualTo(version = '') {
        return this.greaterThan(version) || this.equalTo(version);
    }
}

export default function is(version = '') {
    return new Comparator(version);
}
