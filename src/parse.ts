import { VALID_PRERELEASE_AND_BUILD_CHARS } from './constants.js';
import isIntLike from './is-int-like.js';

export default function parse(value = '') {
  const status = {
    atMajor: true,
    atMinor: false,
    atPatch: false,
    atPrerelease: false,
    atBuild: false
  };
  const buffer = {
    major: '',
    minor: '',
    patch: '',
    prerelease: '',
    build: ''
  };
  const errors: TypeError[] = [];
  const chars = [...(value.startsWith('v') ? value.replace('v', '') : value)];

  chars.forEach(char => {
    if (status.atMajor && char !== '.') {
      if (!isIntLike(char)) {
        errors.push(
          new TypeError(`The character "${char}" is not a valid MAJOR version character`)
        );

        return;
      }

      buffer.major += char;

      return;
    }

    if (status.atMajor && char === '.') {
      status.atMajor = false;
      status.atMinor = true;

      return;
    }

    if (status.atMinor && char !== '.') {
      if (!isIntLike(char)) {
        errors.push(
          new TypeError(`The character "${char}" is not a valid MINOR version character`)
        );

        return;
      }

      buffer.minor += char;

      return;
    }

    if (status.atMinor && char === '.') {
      status.atMinor = false;
      status.atPatch = true;

      return;
    }

    if (status.atPatch && char === '-') {
      status.atPatch = false;
      status.atPrerelease = true;

      return;
    }

    if (status.atPatch && char === '+') {
      status.atPatch = false;
      status.atBuild = true;

      return;
    }

    if (status.atPatch && char !== '.') {
      if (!isIntLike(char)) {
        errors.push(
          new TypeError(`The character "${char}" is not a valid PATCH version character`)
        );

        return;
      }

      buffer.patch += char;

      return;
    }

    if (status.atPrerelease && char !== '+') {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        errors.push(new TypeError(`The character "${char}" is not a valid pre-release character`));

        return;
      }

      buffer.prerelease += char;

      return;
    }

    if (status.atPrerelease && char === '+') {
      status.atPrerelease = false;
      status.atBuild = true;

      return;
    }

    if (status.atBuild) {
      if (!VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
        errors.push(new TypeError(`The character "${char}" is not a valid build character`));

        return;
      }

      buffer.build += char;

      return;
    }
  });

  if (errors.length === 1) {
    const [error] = errors;

    throw error;
  }

  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      `Multiple TypeErrors were encountered when parsing the version ${value}`
    );
  }

  return {
    ...buffer,
    major: Number.parseInt(buffer.major),
    minor: Number.parseInt(buffer.minor),
    patch: Number.parseInt(buffer.patch),
    versionCore: `${buffer.major}.${buffer.minor}.${buffer.patch}`
  };
}
