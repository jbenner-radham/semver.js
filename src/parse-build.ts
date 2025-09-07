import { VALID_PRERELEASE_AND_BUILD_CHARS } from './constants.js';
import isIntLike from './is-int-like.js';

export default function parseBuild(value: string): (number | string)[] {
  const chars = [...value];
  const errors: TypeError[] = [];

  chars.forEach(char => {
    if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
      errors.push(new TypeError(`The character "${char}" is not a valid build character`));
    }
  });

  const identifiers = value.split('.');

  if (identifiers.includes('')) {
    errors.push(new TypeError(`Build identifiers must not be empty`));
  }

  if (errors.length === 1) {
    const [error] = errors;

    throw error;
  }

  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      `Multiple TypeErrors were encountered when parsing the build "${value}"`
    );
  }

  return identifiers.map(identifier =>
    isIntLike(identifier) ? Number.parseInt(identifier) : identifier
  );
}
