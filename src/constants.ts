/**
 * @see https://semver.org/spec/v2.0.0.html#spec-item-11
 */
export const ASCII_SORT_ORDER = [
  '-',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

export const LOGICAL_OR_OPERATOR = '||';

export const HYPHEN_RANGE_OPERATOR = ' - ';

export const NORMALIZED_X_RANGE_CHAR = 'x';

/**
 * The implemented SemVer specification version.
 */
export const SPEC_VERSION = '2.0.0';

/**
 * @see https://semver.org/spec/v2.0.0.html#backusnaur-form-grammar-for-valid-semver-versions
 */
export const VALID_PRERELEASE_AND_BUILD_CHARS = [
  '.',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

export const VALID_SPECIFIER_COMPARATORS = [
  '<',
  '<=',
  '=',
  '>',
  '>=',
  '^',
  '~'
];

export const VALID_SPECIFIER_COMPARATOR_CHARS = [
  '<',
  '=',
  '>',
  '^',
  '~'
];

export const VALID_SPECIFIER_VERSION_CORE_CHARS = [
  '*',
  '.',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'X',
  'x'
];

export const VALID_SPECIFIER_DIGIT_AND_X_RANGE_CHARS =
  VALID_SPECIFIER_VERSION_CORE_CHARS.filter(char => char !== '.');

export const VALID_VERSION_DIGIT_CHARS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
];

export const VALID_X_RANGE_CHARS = [
  '*',
  'X',
  'x'
];
