import { VALID_SPECIFIER_COMPARATOR_CHARS } from './constants';

export default function stripSpecifierPrefixOperator(specifier: string): string {
  const chars = [...specifier];
  let buffer = '';
  let isBeforeVersion = true;

  for (const char of chars) {
    if (isBeforeVersion && VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      continue;
    }

    if (isBeforeVersion && !VALID_SPECIFIER_COMPARATOR_CHARS.includes(char)) {
      isBeforeVersion = false;
    }

    if (!isBeforeVersion) {
      buffer += char;
    }
  }

  return buffer;
}
