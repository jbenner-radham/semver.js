import isIntLike from './is-int-like.js';
import { VALID_PRE_RELEASE_AND_BUILD_CHARS } from './constants.js';

export default function parse(value = '') {
    const status = {
        atMajor: true,
        atMinor: false,
        atPatch: false,
        atPreRelease: false,
        atBuild: false // eslint-disable-line sort-keys
    };
    const parsed = {
        major: '',
        minor: '',
        patch: '',
        preRelease: '',
        build: '' // eslint-disable-line sort-keys
    };
    const errors = [];
    const chars = [...(value.startsWith('v') ? value.replace('v', '') : value)];

    chars.forEach(char => {
        if (status.atMajor && char !== '.') {
            if (!isIntLike(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid MAJOR version character`));
                return;
            }

            parsed.major += char;
            return;
        }

        if (status.atMajor && char === '.') {
            status.atMajor = false;
            status.atMinor = true;
            return;
        }

        if (status.atMinor && char !== '.') {
            if (!isIntLike(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid MINOR version character`));
                return;
            }

            parsed.minor += char;
            return;
        }

        if (status.atMinor && char === '.') {
            status.atMinor = false;
            status.atPatch = true;
            return;
        }

        if (status.atPatch && char === '-') {
            status.atPatch = false;
            status.atPreRelease = true;
            return;
        }

        if (status.atPatch && char === '+') {
            status.atPatch = false;
            status.atBuild = true;
            return;
        }

        if (status.atPatch && char !== '.') {
            if (!isIntLike(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid PATCH version character`));
                return;
            }

            parsed.patch += char;
            return;
        }

        if (status.atPreRelease && char !== '+') {
            if (!VALID_PRE_RELEASE_AND_BUILD_CHARS.includes(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid pre-release character`));
                return;
            }

            parsed.preRelease += char;
            return;
        }

        if (status.atPreRelease && char === '+') {
            status.atPreRelease = false;
            status.atBuild = true;
            return;
        }

        if (status.atBuild) {
            if (!VALID_PRE_RELEASE_AND_BUILD_CHARS.includes(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid build character`));
                return;
            }

            parsed.build += char;
            return;
        }
    });

    if (errors.length === 1) {
        const [error] = errors;

        throw error;
    }

    if (errors.length > 1) {
        throw new AggregateError(errors, `Multiple TypeErrors were encountered when parsing the version ${value}`);
    }

    parsed.major = Number.parseInt(parsed.major);
    parsed.minor = Number.parseInt(parsed.minor);
    parsed.patch = Number.parseInt(parsed.patch);

    return parsed;
}
