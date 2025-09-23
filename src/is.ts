import Comparator from './comparison/comparator';
import SpecifierValidator from './specifier-validator';

export default function is(version: string): Comparator {
  return new Comparator(version);
}

is.specifier = function specifierValidatorFactory(specifier: string): SpecifierValidator {
  return new SpecifierValidator(specifier);
};
