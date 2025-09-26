import parseSpecifier from './satisfaction/parse-specifier';

export default class SpecifierValidator {
  readonly #specifier: string;

  constructor(specifier: string) {
    this.#specifier = specifier;
  }

  valid(): boolean {
    try {
      parseSpecifier(this.#specifier);

      return true;
    } catch (_) {
      return false;
    }
  }
}
