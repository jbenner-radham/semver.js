import { VALID_PRERELEASE_AND_BUILD_CHARS } from './constants.js';
import { isIntegerLike } from './util';

export default function parsePrerelease(value: string): (number | string)[] {
  const chars = [...value];
  const errors = [];

  chars.forEach(char => {
    if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
      errors.push(new TypeError(`The character "${char}" is not a valid pre-release character`));
    }
  });

  const identifiers = value.split('.');

  if (identifiers.includes('')) {
    errors.push(new TypeError(`Pre-release identifiers must not be empty`));
  }

  if (identifiers.some(identifier => isIntegerLike(identifier) && identifier.startsWith('0'))) {
    errors.push(new TypeError('Pre-release numeric identifiers must not include leading zeroes'));
  }

  if (errors.length === 1) {
    const [error] = errors;

    throw error;
  }

  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      `Multiple TypeErrors were encountered when parsing the pre-release "${value}"`
    );
  }

  return identifiers.map(identifier =>
    isIntegerLike(identifier) ? Number.parseInt(identifier) : identifier
  );
}
