import Satisfier from './satisfaction/satisfier';

export default function does(version: string): Satisfier {
  return new Satisfier(version);
}
