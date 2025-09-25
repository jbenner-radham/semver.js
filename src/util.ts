export function isEmptyString(value: string): boolean {
  return value === '';
}

export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
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
