import { is } from '../src/index.js';
import { describe, expect, it } from 'vitest';

describe('is', () => {
  it('is a function', () => {
    expect(is).toBeTypeOf('function');
  });

  it('returns an object', () => {
    expect(is('1.0.0')).toBeTypeOf('object');
  });

  describe('#equalTo', () => {
    it('is a function', () => {
      expect(is('1.0.0').equalTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').equalTo('1.0.0')).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0 to both functions', () => {
      it('returns true', () => {
        expect(is('1.0.0').equalTo('1.0.0')).toBe(true);
      });
    });

    describe('when passed 1.0.0 to the first function and 1.0.0-beta.2 to the second', () => {
      it('returns false', () => {
        expect(is('1.0.0').equalTo('1.0.0-beta.2')).toBe(false);
      });
    });
  });

  describe('#greaterThan', () => {
    it('is a function', () => {
      expect(is('1.0.0').greaterThan).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').greaterThan('1.0.0')).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0 to both functions', () => {
      it('returns false', () => {
        expect(is('1.0.0').greaterThan('1.0.0')).toBe(false);
      });
    });

    describe('when passed 1.0.0 to the first function and 0.1.0 to the second', () => {
      it('returns true', () => {
        expect(is('1.0.0').greaterThan('0.1.0')).toBe(true);
      });
    });

    describe('when passed 0.5.1 to the first function and 0.5.2 to the second', () => {
      it('returns false', () => {
        expect(is('0.5.1').greaterThan('0.5.2')).toBe(false);
      });
    });

    describe('when passed 1.0.0 to the first function and 1.0.0-beta to the second', () => {
      it('returns true', () => {
        expect(is('1.0.0').greaterThan('1.0.0-beta')).toBe(true);
      });
    });

    describe('when passed 1.0.0-beta to the first function and 1.0.0 to the second', () => {
      it('returns false', () => {
        expect(is('1.0.0-beta').greaterThan('1.0.0')).toBe(false);
      });
    });

    describe('when passed 1.0.0-rc.2 to the first function and 1.0.0-beta.11 to the second', () => {
      it('returns true', () => {
        expect(is('1.0.0-rc.2').greaterThan('1.0.0-beta.11')).toBe(true);
      });
    });
  });

  describe('#greaterThanOrEqualTo', () => {
    it('is a function', () => {
      expect(is('1.0.0').greaterThanOrEqualTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').greaterThanOrEqualTo('1.0.0')).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0 to both functions', () => {
      it('returns true', () => {
        expect(is('1.0.0').greaterThanOrEqualTo('1.0.0')).toBe(true);
      });
    });

    describe('when passed 1.0.0 to the first function and 0.1.0 to the second', () => {
      it('returns true', () => {
        expect(is('1.0.0').greaterThanOrEqualTo('0.1.0')).toBe(true);
      });
    });

    describe('when passed 0.5.1 to the first function and 0.5.2 to the second', () => {
      it('returns false', () => {
        expect(is('0.5.1').greaterThan('0.5.2')).toBe(false);
      });
    });
  });

  describe('#lessThan', () => {
    it('is a function', () => {
      expect(is('1.0.0').lessThan).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').lessThan('1.0.0')).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0 to both functions', () => {
      it('returns false', () => {
        expect(is('1.0.0').lessThan('1.0.0')).toBe(false);
      });
    });

    describe('when passed 0.8.2 to the first function and 0.9.0 to the second', () => {
      it('returns true', () => {
        expect(is('0.8.2').lessThan('0.9.0')).toBe(true);
      });
    });

    describe('when passed 1.1.1 to the first function and 1.0.1 to the second', () => {
      it('returns false', () => {
        expect(is('1.1.1').lessThan('1.0.1')).toBe(false);
      });
    });

    describe('when passed 1.0.0 to the first function and 1.0.0-beta to the second', () => {
      it('returns false', () => {
        expect(is('1.0.0').lessThan('1.0.0-beta')).toBe(false);
      });
    });

    describe('when passed 1.0.0-beta to the first function and 1.0.0 to the second', () => {
      it('returns true', () => {
        expect(is('1.0.0-beta').lessThan('1.0.0')).toBe(true);
      });
    });

    describe('when passed 1.0.0-rc.2 to the first function and 1.0.0-beta.11 to the second', () => {
      it('returns false', () => {
        expect(is('1.0.0-rc.2').lessThan('1.0.0-beta.11')).toBe(false);
      });
    });
  });

  describe('#lessThanOrEqualTo', () => {
    it('is a function', () => {
      expect(is('1.0.0').lessThanOrEqualTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').lessThanOrEqualTo('1.0.0')).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0 to both functions', () => {
      it('returns true', () => {
        expect(is('1.0.0').lessThanOrEqualTo('1.0.0')).toBe(true);
      });
    });

    describe('when passed 2.3.3 to the first function and 1.0.1 to the second', () => {
      it('returns false', () => {
        expect(is('2.3.3').lessThanOrEqualTo('1.0.1')).toBe(false);
      });
    });

    describe('when passed 0.1.3 to the first function and 0.5.5 to the second', () => {
      it('returns true', () => {
        expect(is('0.1.3').lessThanOrEqualTo('0.5.5')).toBe(true);
      });
    });
  });

  describe('#stable', () => {
    it('is a function', () => {
      expect(is('1.0.0').stable).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').stable()).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0', () => {
      it('returns true', () => {
        expect(is('1.0.0').stable()).toBe(true);
      });
    });

    describe('when passed 0.1.0', () => {
      it('returns true', () => {
        expect(is('0.1.0').stable()).toBe(false);
      });
    });
  });

  describe('#unstable', () => {
    it('is a function', () => {
      expect(is('0.1.0').unstable).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('0.1.0').unstable()).toBeTypeOf('boolean');
    });

    describe('when passed 0.1.0', () => {
      it('returns true', () => {
        expect(is('0.1.0').unstable()).toBe(true);
      });
    });

    describe('when passed 1.0.0', () => {
      it('returns false', () => {
        expect(is('1.0.0').unstable()).toBe(false);
      });
    });
  });

  describe('#valid', () => {
    it('is a function', () => {
      expect(is('1.0.0').valid).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is('1.0.0').valid()).toBeTypeOf('boolean');
    });

    describe('when passed 1.0.0', () => {
      it('returns true', () => {
        expect(is('1.0.0').valid()).toBe(true);
      });
    });

    describe('when passed 1.0-beta.1', () => {
      it('returns false', () => {
        expect(is('1.0-beta.1').valid()).toBe(false);
      });
    });

    describe('when passed 1.0.0-beta.1-beta.2', () => {
      it('returns false', () => {
        expect(is('1.0.0-beta.1-beta.2').valid()).toBe(false);
      });
    });

    describe('when passed a.0.0', () => {
      it('returns false', () => {
        expect(is('a.0.0').valid()).toBe(false);
      });
    });

    describe('when passed 1', () => {
      it('returns false', () => {
        expect(is('1').valid()).toBe(false);
      });
    });

    describe('when passed 1.0', () => {
      it('returns false', () => {
        expect(is('1.0').valid()).toBe(false);
      });
    });

    describe('when passed 1.0.0.0', () => {
      it('returns false', () => {
        expect(is('1.0.0.0').valid()).toBe(false);
      });
    });
  });

  describe('#specifier.valid', () => {
    it('is a function', () => {
      expect(is.specifier('^1.x').valid).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(is.specifier('^1.x').valid()).toBeTypeOf('boolean');
    });

    it('returns true for ^1.x', () => {
      expect(is.specifier('^1.x').valid()).toBe(true);
    });

    it('returns true for ~1.2.3', () => {
      expect(is.specifier('~1.2.3').valid()).toBe(true);
    });

    it('returns true for 1.2.3 - 2.3.4', () => {
      expect(is.specifier('1.2.3 - 2.3.4').valid()).toBe(true);
    });

    it('returns false for 1.x-beta.2 - 2.2.6', () => {
      expect(is.specifier('1.x-beta.2 - 2.2.6').valid()).toBe(false);
    });

    it('returns false for ~1.0.0.0', () => {
      expect(is.specifier('~1.0.0.0').valid()).toBe(false);
    });
  });
});
