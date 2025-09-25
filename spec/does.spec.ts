import does from '../src/does';
import semver from 'semver';
import { describe, expect, it } from 'vitest';

describe('does', () => {
  it('is a function', () => {
    expect(does).toBeTypeOf('function');
  });

  describe('wildcards', () => {
    describe('1.0.0 satisfies a wildcard ([EMPTY STRING])', () => {
      const version = '1.0.0';
      const specifier = '';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.0.0 satisfies a wildcard (*)', () => {
      const version = '1.0.0';
      const specifier = '*';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.0.0 satisfies a wildcard (X)', () => {
      const version = '1.0.0';
      const specifier = 'X';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.0.0 satisfies a wildcard (x)', () => {
      const version = '1.0.0';
      const specifier = 'x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.0.0 satisfies a wildcard version (x.x.x)', () => {
      const version = '1.0.0';
      const specifier = 'x.x.x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('verbatim versions', () => {
    describe('1.0.0 satisfies 1.0.0', () => {
      const version = '1.0.0';
      const specifier = '1.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.3.37 satisfies 1.3.37', () => {
      const version = '1.3.37';
      const specifier = '1.3.37';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('less than (<)', () => {
    describe('1.0.0 satisfies <5', () => {
      const version = '1.0.0';
      const specifier = '<5';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.0.0 satisfies <5.0.0', () => {
      const version = '1.0.0';
      const specifier = '<5.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.3.37 satisfies <1.0.0', () => {
      const version = '1.3.37';
      const specifier = '<1.0.0';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0-beta.1 satisfies <2.0.0', () => {
      const version = '2.0.0-beta.1';
      const specifier = '<2.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0-beta.1 satisfies <2.0', () => {
      const version = '2.0.0-beta.1';
      const specifier = '<2.0';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0-beta.1 satisfies <2.0.0-rc.1', () => {
      const version = '2.0.0-beta.1';
      const specifier = '<2.0.0-rc.1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0-rc.1 satisfies <2.0.0-beta.1', () => {
      const version = '2.0.0-rc.1';
      const specifier = '<2.0.0-beta.1';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('less than or equal to (<=)', () => {
    describe('2.0.0-rc.1 satisfies <=2.0.0-rc.1', () => {
      const version = '2.0.0-rc.1';
      const specifier = '<=2.0.0-rc.1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0-rc.1 satisfies <=2.0.0-rc.2', () => {
      const version = '2.0.0-rc.1';
      const specifier = '<=2.0.0-rc.2';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.999.500 satisfies <=3.0.0', () => {
      const version = '2.999.500';
      const specifier = '<=3.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.999.500 satisfies <=3.0.0-beta.1', () => {
      const version = '2.999.500';
      const specifier = '<=3.0.0-beta.1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('5.5.5 satisfies <=3.3.3', () => {
      const version = '5.5.5';
      const specifier = '<=3.3.3';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('3.1.5 satisfies <=3.1.5-beta.1', () => {
      const version = '3.1.5';
      const specifier = '<=3.1.5-beta.1';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('3.1.5 satisfies <=3.1.6', () => {
      const version = '3.1.5';
      const specifier = '<=3.1.6';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('equal to (=)', () => {
    describe('7.18.1 satisfies =7.18.1', () => {
      const version = '7.18.1';
      const specifier = '=7.18.1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('7.18.1-beta.1 satisfies =7.18.1', () => {
      const version = '7.18.1-beta.1';
      const specifier = '=7.18.1';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('greater than (>)', () => {
    describe('2.0.0 satisfies >1.0.0', () => {
      const version = '2.0.0';
      const specifier = '>1.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0 satisfies >2.0.0-beta.1', () => {
      const version = '2.0.0';
      const specifier = '>2.0.0-beta.1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.8.3 satisfies >2.0.0', () => {
      const version = '2.8.3';
      const specifier = '>2.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.8.3 satisfies >3.0.0', () => {
      const version = '2.8.3';
      const specifier = '>3.0.0';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('greater than or equal to (>=)', () => {
    describe('2.8.3 satisfies >=2.0.0', () => {
      const version = '2.8.3';
      const specifier = '>=2.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.1 satisfies >=2.0.0', () => {
      const version = '2.0.1';
      const specifier = '>=2.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.1.3 satisfies >=2.0.0', () => {
      const version = '2.1.3';
      const specifier = '>=2.0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.1.3 satisfies >=2.1.3', () => {
      const version = '2.1.3';
      const specifier = '>=2.1.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('caret range (^)', () => {
    describe('1.5.6 satisfies ^1.2.3', () => {
      const version = '1.5.6';
      const specifier = '^1.2.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('2.0.0 satisfies ^1.2.3', () => {
      const version = '2.0.0';
      const specifier = '^1.2.3';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.2.94 satisfies ^0.2.3', () => {
      const version = '0.2.94';
      const specifier = '^0.2.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.3.0 satisfies ^0.2.3', () => {
      const version = '0.3.0';
      const specifier = '^0.2.3';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.0.3 satisfies ^0.0.3', () => {
      const version = '0.0.3';
      const specifier = '^0.0.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.0.4 satisfies ^0.0.3', () => {
      const version = '0.0.4';
      const specifier = '^0.0.3';
      const expected = false;

      it('reports false', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.2.3-beta.4 satisfies ^1.2.3-beta.2', () => {
      const version = '1.2.3-beta.4';
      const specifier = '^1.2.3-beta.2';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.0.3-beta satisfies ^0.0.3-beta', () => {
      const version = '0.0.3-beta';
      const specifier = '^0.0.3-beta';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.98.1 satisfies ^1.2.x', () => {
      const version = '1.98.1';
      const specifier = '^1.2.x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.0.32 satisfies ^0.0.x', () => {
      const version = '0.0.32';
      const specifier = '^0.0.x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.0.6 satisfies ^0.0', () => {
      const version = '0.0.6';
      const specifier = '^0.0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.7.5 satisfies ^1.x', () => {
      const version = '1.7.5';
      const specifier = '^1.x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.9.6 satisfies ^0.x', () => {
      const version = '0.9.6';
      const specifier = '^0.x';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });

  describe('tilde range (~)', () => {
    describe('1.2.13 satisfies ~1.2.3', () => {
      const version = '1.2.13';
      const specifier = '~1.2.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.2.13 satisfies ~1.2', () => {
      const version = '1.2.13';
      const specifier = '~1.2';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.9.13 satisfies ~1', () => {
      const version = '1.9.13';
      const specifier = '~1';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.2.99 satisfies ~0.2.3', () => {
      const version = '0.2.99';
      const specifier = '~0.2.3';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.2.99 satisfies ~0.2', () => {
      const version = '0.2.99';
      const specifier = '~0.2';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('0.122.99 satisfies ~0', () => {
      const version = '0.122.99';
      const specifier = '~0';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });

    describe('1.2.3-beta.4 satisfies ~1.2.3-beta.2', () => {
      const version = '1.2.3-beta.4';
      const specifier = '~1.2.3-beta.2';
      const expected = true;

      it('reports true', () => {
        const actual = does(version).satisfy(specifier);

        expect(actual).toBe(expected);
      });

      it('matches the results of the npm semver module', () => {
        const actual = semver.satisfies(version, specifier, { includePrerelease: true });

        expect(actual).toBe(expected);
      });
    });
  });
});
