import { VALID_SPECIFIER_COMPARATORS } from '../constants';
import type { VersionComparator } from '../types';

export default function ensureValidComparator(value: string): value is VersionComparator {
  if (value.length && !VALID_SPECIFIER_COMPARATORS.includes(value)) {
    throw new TypeError(`The comparator "${value}" is invalid`);
  }

  return true;
}
