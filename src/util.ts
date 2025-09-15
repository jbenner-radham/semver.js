export function isEmptyString(value: string): boolean {
  return value === '';
}

export function trim(value: string): string {
  return value.trim();
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
