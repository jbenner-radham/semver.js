import { ASCII_SORT_ORDER } from '../constants';
import parsePrerelease from '../parse-prerelease';
import { isInteger, isString } from '../util';

export default class PrereleaseComparator {
  readonly #prerelease: string;

  constructor(prerelease: string) {
    this.#prerelease = prerelease;
  }

  equalTo(prerelease: string) {
    return this.#prerelease === prerelease;
  }

  greaterThan(prerelease: string) {
    if (!this.#prerelease.length && prerelease.length) {
      return true;
    } else if (this.#prerelease.length && !prerelease.length) {
      return false;
    }

    const subject = parsePrerelease(this.#prerelease);
    const comparison = parsePrerelease(prerelease);
    const longestIdentifierLength = Math.max(subject.length, comparison.length);

    for (let identifierIndex = 0; identifierIndex < longestIdentifierLength; ++identifierIndex) {
      const subjectIdentifier = subject[identifierIndex];
      const comparisonIdentifier = comparison[identifierIndex];

      // If the identifiers are the same continue to the next one.
      if (subjectIdentifier === comparisonIdentifier) {
        continue;
      }

      // > Identifiers consisting of only digits are compared numerically.
      if (isInteger(subjectIdentifier) && isInteger(comparisonIdentifier)) {
        return subjectIdentifier > comparisonIdentifier;
      }

      // > Identifiers with letters or hyphens are compared lexically in ASCII sort order.
      if (isString(subjectIdentifier) && isString(comparisonIdentifier)) {
        const subjectIdentifierChars = [...subjectIdentifier];
        const comparisonIdentifierChars = [...comparisonIdentifier];
        const longestCharLength = Math.max(
          subjectIdentifierChars.length,
          comparisonIdentifierChars.length
        );

        for (let charIndex = 0; charIndex < longestCharLength; ++charIndex) {
          const subjectChar = subjectIdentifierChars[charIndex];
          const comparisonChar = comparisonIdentifierChars[charIndex];

          if (subjectChar !== undefined && comparisonChar === undefined) {
            return true;
          }

          if (subjectChar === undefined && comparisonChar !== undefined) {
            return false;
          }

          const subjectSortIndex = ASCII_SORT_ORDER.indexOf(subjectChar!);
          const comparisonSortIndex = ASCII_SORT_ORDER.indexOf(comparisonChar!);

          if (subjectSortIndex === comparisonSortIndex) {
            continue;
          }

          return subjectSortIndex > comparisonSortIndex;
        }
      }

      // > Numeric identifiers always have lower precedence than non-numeric identifiers.
      if (isString(subjectIdentifier) && isInteger(comparisonIdentifier)) {
        return true;
      }

      if (isInteger(subjectIdentifier) && isString(comparisonIdentifier)) {
        return false;
      }

      // > A larger set of pre-release fields has a higher precedence than a smaller set, if all of
      // > the preceding identifiers are equal.
      if (subjectIdentifier !== undefined && comparisonIdentifier === undefined) {
        return true;
      }

      if (subjectIdentifier === undefined && comparisonIdentifier !== undefined) {
        return false;
      }
    }

    return false;
  }

  greaterThanOrEqualTo(prerelease: string) {
    return this.greaterThan(prerelease) || this.equalTo(prerelease);
  }

  lessThan(prerelease: string) {
    return !this.equalTo(prerelease) && !this.greaterThan(prerelease);
  }

  lessThanOrEqualTo(prerelease: string) {
    return this.lessThan(prerelease) || this.equalTo(prerelease);
  }
}
