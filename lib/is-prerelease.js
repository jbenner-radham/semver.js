import { ASCII_SORT_ORDER } from './constants.js';
import parsePrerelease from './parse-prerelease';

function getLongestLength(a = [], b = []) {
    if (a.length === b.length) {
        return a.length;
    }

    if (a.length > b.length) {
        return a.length;
    }

    return b.length;
}

/**
 * Determine if a value is a string.
 *
 * @param {*} value
 * @returns {value is string}
 */
function isString(value) {
    return typeof value === 'string';
}

class PrereleaseComparator {
    #version = '';

    constructor(version = '') {
        this.#version = version;
    }

    equalTo(version = '') {
        return this.#version === version;
    }

    greaterThan(version = '') {
        const subject = parsePrerelease(this.#version);
        const comparison = parsePrerelease(version);
        const longestIdentifierLength = getLongestLength(subject, comparison);

        for (let identifierIndex = 0; identifierIndex < longestIdentifierLength; ++identifierIndex) {
            const subjectIdentifier = subject[identifierIndex];
            const comparisonIdentifier = comparison[identifierIndex];

            // If the identifiers are the same continue to the next one.
            if (subjectIdentifier === comparisonIdentifier) {
                continue;
            }

            // > Identifiers consisting of only digits are compared numerically.
            if (Number.isInteger(subjectIdentifier) && Number.isInteger(comparisonIdentifier)) {
                return subjectIdentifier > comparisonIdentifier;
            }

            // > Identifiers with letters or hyphens are compared lexically in ASCII sort order.
            if (isString(subjectIdentifier) && isString(comparisonIdentifier)) {
                const subjectIdentifierChars = [...subjectIdentifier];
                const comparisonIdentifierChars = [...comparisonIdentifier];
                const longestCharLength = getLongestLength(subjectIdentifierChars, comparisonIdentifierChars);

                for (let charIndex = 0; charIndex < longestCharLength; ++charIndex) {
                    const subjectChar = subjectIdentifierChars[charIndex];
                    const comparisonChar = comparisonIdentifierChars[charIndex];

                    if (subjectChar !== undefined && comparisonChar === undefined) {
                        return true;
                    }

                    if (subjectChar === undefined && comparisonChar !== undefined) {
                        return false;
                    }

                    const subjectSortIndex = ASCII_SORT_ORDER.indexOf(subjectChar);
                    const comparisonSortIndex = ASCII_SORT_ORDER.indexOf(comparisonChar);

                    if (subjectSortIndex === comparisonSortIndex) {
                        continue;
                    }

                    return subjectSortIndex > comparisonSortIndex;
                }
            }

            // > Numeric identifiers always have lower precedence than non-numeric identifiers.
            if (isString(subjectIdentifier) && Number.isInteger(comparisonIdentifier)) {
                return true;
            }

            if (Number.isInteger(subjectIdentifier) && isString(comparisonIdentifier)) {
                return false;
            }

            // > A larger set of pre-release fields has a higher precedence than a smaller set, if all of the preceding
            // > identifiers are equal.
            if (subjectIdentifier !== undefined && comparisonIdentifier === undefined) {
                return true;
            }

            if (subjectIdentifier === undefined && comparisonIdentifier !== undefined) {
                return false;
            }
        }

        return false;
    }

    greaterThanOrEqualTo(version = '') {
        return this.greaterThan(version) || this.equalTo(version);
    }
}

export default function isPrerelease(version = '') {
    return new PrereleaseComparator(version);
}
