export default function isIntLike(value: unknown): boolean {
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
