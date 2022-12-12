export function isInt(value) {
    const parsedInt = Number.parseInt(value);

    return !Number.isNaN(parsedInt);
}

export function clean(value) {
    const chars = [...value];
    const isValidChar = char => char === '.' || isInt(char);

    return chars.filter(isValidChar).join('');
}

export function parse(value = '') {
    const validPreReleaseAndBuildChars = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'x',
        '-',
        '.'
    ];
    const status = {
        atMajor: true,
        atMinor: false,
        atPatch: false,
        atPreRelease: false,
        atBuild: false // eslint-disable-line sort-keys
    };
    const parsed = {
        major: '',
        minor: '',
        patch: '',
        preRelease: '',
        build: '' // eslint-disable-line sort-keys
    };
    const errors = [];
    const chars = [...(value.startsWith('v') ? value.replace('v', '') : value)];

    chars.forEach(char => {
        if (status.atMajor && char !== '.') {
            if (!isInt(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid MAJOR version character`));
                return;
            }

            parsed.major += char;
            return;
        }

        if (status.atMajor && char === '.') {
            status.atMajor = false;
            status.atMinor = true;
            return;
        }

        if (status.atMinor && char !== '.') {
            if (!isInt(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid MINOR version character`));
                return;
            }

            parsed.minor += char;
            return;
        }

        if (status.atMinor && char === '.') {
            status.atMinor = false;
            status.atPatch = true;
            return;
        }

        if (status.atPatch && char === '-') {
            status.atPatch = false;
            status.atPreRelease = true;
            return;
        }

        if (status.atPatch && char === '+') {
            status.atPatch = false;
            status.atBuild = true;
            return;
        }

        if (status.atPatch && char !== '.') {
            if (!isInt(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid PATCH version character`));
                return;
            }

            parsed.patch += char;
            return;
        }

        if (status.atPreRelease && char !== '+') {
            if (!validPreReleaseAndBuildChars.includes(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid pre-release character`));
                return;
            }

            parsed.preRelease += char;
            return;
        }

        if (status.atPreRelease && char === '+') {
            status.atPreRelease = false;
            status.atBuild = true;
            return;
        }

        if (status.atBuild) {
            if (!validPreReleaseAndBuildChars.includes(char)) {
                errors.push(new TypeError(`The character "${char}" is not a valid build character`));
                return;
            }

            parsed.build += char;
            return;
        }
    });

    if (errors.length === 1) {
        const [error] = errors;

        throw new error();
    }

    if (errors.length > 1) {
        throw new AggregateError(errors, 'Multiple TypeErrors were encountered');
    }

    parsed.major = Number.parseInt(parsed.major);
    parsed.minor = Number.parseInt(parsed.minor);
    parsed.patch = Number.parseInt(parsed.patch);

    return parsed;
}
