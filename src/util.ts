export function getParsingErrorMessage({ char, state, within }: {
  char: string;
  state: string;
  within: string;
}): string {
  return `A "${char}" character was found in an invalid position in the "${state}" state while` +
    ` parsing "${within}"`;
}

export function isEmptyString(value: string): boolean {
  return value === '';
}

export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

export function isIntegerLike(value: unknown): boolean {
  if (Number.isNaN(value)) {
    return false;
  }

  const parsedInt = Number.parseInt(value as string);

  // Handle floats in a string.
  if (typeof value === 'string' && `${parsedInt}` !== value) {
    return false;
  }

  // Handle floats.
  if (typeof value === 'number' && parsedInt !== value) {
    return false;
  }

  return !Number.isNaN(parsedInt);
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function trim(value: string): string {
  return value.trim();
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
