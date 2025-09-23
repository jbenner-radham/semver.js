import { VALID_PRERELEASE_AND_BUILD_CHARS, VALID_VERSION_INTEGER_CHARS } from './constants';
import parseBuild from './parse-build';
import parsePrerelease from './parse-prerelease';
import SemanticVersion from './semantic-version';

export default function parse(version: string): SemanticVersion {
  type State = 'initialization'
    | 'in-major'
    | 'in-minor'
    | 'in-patch'
    | 'in-prerelease'
    | 'in-build';

  let state: State = 'initialization';
  const buffer = {
    major: '',
    minor: '',
    patch: '',
    prerelease: '',
    build: ''
  };
  const errors: TypeError[] = [];
  const normalizedVersion = version.startsWith('v')
    ? version.replace('v', '')
    : version;
  const chars = [...normalizedVersion];

  chars.forEach(char => {
    let doNotBuffer = false;

    if (VALID_VERSION_INTEGER_CHARS.includes(char)) {
      switch (state) {
        case 'initialization':
          state = 'in-major';
          break;
        case 'in-major':
        case 'in-minor':
        case 'in-patch':
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          doNotBuffer = true;
          errors.push(
            new TypeError(
              `Digit character "${char}" is in an invalid position in the "${state}" state`
            )
          );
      }
    } else if (char === '.') {
      switch (state) {
        case 'in-major':
          doNotBuffer = true;
          state = 'in-minor';
          break;
        case 'in-minor':
          doNotBuffer = true;
          state = 'in-patch';
          break;
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          doNotBuffer = true;
          errors.push(
            new TypeError(
              `A "." character was found in an invalid position in the "${state}" state`
            )
          );
      }
    } else if (char === '-') {
      switch (state) {
        case 'in-patch':
          doNotBuffer = true;
          state = 'in-prerelease';
          break;
        default:
          doNotBuffer = true;
          errors.push(
            new TypeError(
              `A "-" character was found in an invalid position in the "${state}" state`
            )
          );
      }
    } else if (char === '+') {
      switch (state) {
        case 'in-patch':
        case 'in-prerelease':
          doNotBuffer = true;
          state = 'in-build';
          break;
        default:
          doNotBuffer = true;
          errors.push(
            new TypeError(
              `A "+" character was found in an invalid position in the "${state}" state`
            )
          );
      }
    } else if (VALID_PRERELEASE_AND_BUILD_CHARS.includes(char)) {
      switch (state) {
        case 'in-prerelease':
        case 'in-build':
          break;
        default:
          doNotBuffer = true;
          errors.push(
            new TypeError(
              `A "${char}" character was found in an invalid position in the "${state}" state`
            )
          );
      }
    } else {
      doNotBuffer = true;
      errors.push(
        new TypeError(
          `A "${char}" character was found in an invalid position in the "${state}" state`
        )
      );
    }

    if (doNotBuffer) {
      return;
    }

    switch (state) {
      case 'in-major':
        buffer.major += char;
        break;
      case 'in-minor':
        buffer.minor += char;
        break;
      case 'in-patch':
        buffer.patch += char;
        break;
      case 'in-prerelease':
        buffer.prerelease += char;
        break;
      case 'in-build':
        buffer.build += char;
        break;
      default:
        errors.push(new TypeError(`In invalid state "${state}"`));
    }
  });

  if (buffer.prerelease.length > 0) {
    try {
      parsePrerelease(buffer.prerelease);
    } catch (error) {
      if (error instanceof AggregateError) {
        errors.push(...error.errors);
      } else if (error instanceof TypeError) {
        errors.push(error);
      }
    }
  }

  if (buffer.build.length > 0) {
    try {
      parseBuild(buffer.build);
    } catch (error) {
      if (error instanceof AggregateError) {
        errors.push(...error.errors);
      } else if (error instanceof TypeError) {
        errors.push(error);
      }
    }
  }

  if (errors.length === 1) {
    const [error] = errors;

    throw error;
  }

  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      `Multiple TypeErrors were encountered when parsing the version "${version}"`
    );
  }

  return new SemanticVersion({
    ...buffer,
    major: Number.parseInt(buffer.major),
    minor: Number.parseInt(buffer.minor),
    patch: Number.parseInt(buffer.patch)
  });
}
