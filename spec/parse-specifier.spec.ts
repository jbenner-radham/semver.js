import parseSpecifier from '../src/satisfaction/parse-specifier';
import { describe, expect, it } from 'vitest';

describe('parseSpecifier', () => {
  it('is a function', () => {
    expect(parseSpecifier).toBeTypeOf('function');
  });
});
