import isPrerelease from '../src/is-prerelease.js';
import { describe, expect, it } from 'vitest';

describe('isPrerelease', () => {
  it('is a function', () => {
    expect(isPrerelease).toBeTypeOf('function');
  });

  it('returns an object', () => {
    expect(isPrerelease('alpha')).toBeTypeOf('object');
  });

  describe('#equalTo', () => {
    it('is a function', () => {
      expect(isPrerelease('alpha').equalTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(isPrerelease('alpha').equalTo('alpha')).toBeTypeOf('boolean');
    });

    describe('when passed "alpha" to both functions', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha').equalTo('alpha')).toBe(true);
      });
    });

    describe('when passed "alpha" to the first function "alpha.1" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha').equalTo('alpha.1')).toBe(false);
      });
    });

    describe('when passed "alpha.1" to the first function "alpha" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.1').equalTo('alpha')).toBe(false);
      });
    });
  });

  describe('#greaterThan', () => {
    it('is a function', () => {
      expect(isPrerelease('alpha').greaterThan).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(isPrerelease('alpha').greaterThan('alpha')).toBeTypeOf('boolean');
    });

    describe('when passed "alpha" to both functions', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha').greaterThan('alpha')).toBe(false);
      });
    });

    describe('when passed "alpha" to the first function and "alpha.1" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha').greaterThan('alpha.1')).toBe(false);
      });
    });

    describe('when passed "alpha.1" to the first function and "alpha.beta" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.1').greaterThan('alpha.beta')).toBe(false);
      });
    });

    describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.beta').greaterThan('beta')).toBe(false);
      });
    });

    describe('when passed "beta" to the first function and "beta.2" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta').greaterThan('beta.2')).toBe(false);
      });
    });

    describe('when passed "beta.2" to the first function and "beta.11" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta.2').greaterThan('beta.11')).toBe(false);
      });
    });

    describe('when passed "beta.11" to the first function and "rc.1" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta.11').greaterThan('rc.1')).toBe(false);
      });
    });

    describe('when passed "alpha.1" to the first function and "alpha" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha.1').greaterThan('alpha')).toBe(true);
      });
    });

    describe('when passed "alpha.beta" to the first function and "alpha.1" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha.beta').greaterThan('alpha.1')).toBe(true);
      });
    });

    describe('when passed "beta" to the first function and "alpha.beta" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta').greaterThan('alpha.beta')).toBe(true);
      });
    });

    describe('when passed "beta.2" to the first function and "beta" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta.2').greaterThan('beta')).toBe(true);
      });
    });

    describe('when passed "beta.11" to the first function and "beta.2" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta.11').greaterThan('beta.2')).toBe(true);
      });
    });

    describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('rc.1').greaterThan('beta.11')).toBe(true);
      });
    });
  });

  describe('#greaterThanOrEqualTo', () => {
    it('is a function', () => {
      expect(isPrerelease('alpha').greaterThanOrEqualTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(isPrerelease('alpha').greaterThanOrEqualTo('alpha')).toBeTypeOf('boolean');
    });

    describe('when passed "alpha" to both functions', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha').greaterThanOrEqualTo('alpha')).toBe(true);
      });
    });

    describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.beta').greaterThanOrEqualTo('beta')).toBe(false);
      });
    });

    describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('rc.1').greaterThanOrEqualTo('beta.11')).toBe(true);
      });
    });
  });

  describe('#lessThan', () => {
    it('is a function', () => {
      expect(isPrerelease('alpha').lessThan).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(isPrerelease('alpha').lessThan('alpha')).toBeTypeOf('boolean');
    });

    describe('when passed "alpha" to both functions', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha').lessThan('alpha')).toBe(false);
      });
    });

    describe('when passed "alpha" to the first function and "alpha.1" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha').lessThan('alpha.1')).toBe(true);
      });
    });

    describe('when passed "alpha.1" to the first function and "alpha.beta" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha.1').lessThan('alpha.beta')).toBe(true);
      });
    });

    describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha.beta').lessThan('beta')).toBe(true);
      });
    });

    describe('when passed "beta" to the first function and "beta.2" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta').lessThan('beta.2')).toBe(true);
      });
    });

    describe('when passed "beta.2" to the first function and "beta.11" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta.2').lessThan('beta.11')).toBe(true);
      });
    });

    describe('when passed "beta.11" to the first function and "rc.1" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('beta.11').lessThan('rc.1')).toBe(true);
      });
    });

    describe('when passed "alpha.1" to the first function and "alpha" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.1').lessThan('alpha')).toBe(false);
      });
    });

    describe('when passed "alpha.beta" to the first function and "alpha.1" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('alpha.beta').lessThan('alpha.1')).toBe(false);
      });
    });

    describe('when passed "beta" to the first function and "alpha.beta" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta').lessThan('alpha.beta')).toBe(false);
      });
    });

    describe('when passed "beta.2" to the first function and "beta" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta.2').lessThan('beta')).toBe(false);
      });
    });

    describe('when passed "beta.11" to the first function and "beta.2" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta.11').lessThan('beta.2')).toBe(false);
      });
    });

    describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('rc.1').lessThan('beta.11')).toBe(false);
      });
    });
  });

  describe('#lessThanOrEqualTo', () => {
    it('is a function', () => {
      expect(isPrerelease('alpha').lessThanOrEqualTo).toBeTypeOf('function');
    });

    it('returns a boolean', () => {
      expect(isPrerelease('alpha').lessThanOrEqualTo('alpha')).toBeTypeOf('boolean');
    });

    describe('when passed "alpha" to both functions', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha').lessThanOrEqualTo('alpha')).toBe(true);
      });
    });

    describe('when passed "alpha" to the first function and "alpha.1" to the second', () => {
      it('returns true', () => {
        expect(isPrerelease('alpha').lessThanOrEqualTo('alpha.1')).toBe(true);
      });
    });

    describe('when passed "beta.11" to the first function and "beta.2" to the second', () => {
      it('returns false', () => {
        expect(isPrerelease('beta.11').lessThanOrEqualTo('beta.2')).toBe(false);
      });
    });
  });
});
