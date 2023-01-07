import { describe, expect, it } from '@jest/globals';
import isPrerelease from '../lib/is-prerelease.js';

describe('isPrerelease', () => {
    it('is a function', () => {
        expect(isPrerelease).toBeFunction();
    });

    it('returns an object', () => {
        expect(isPrerelease('alpha')).toBeObject();
    });

    describe('#equalTo', () => {
        it('is a function', () => {
            expect(isPrerelease('alpha').equalTo).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(isPrerelease('alpha').equalTo('alpha')).toBeBoolean();
        });

        describe('when passed "alpha" to both functions', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha').equalTo('alpha')).toBeTrue();
            });
        });

        describe('when passed "alpha" to the first function "alpha.1" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha').equalTo('alpha.1')).toBeFalse();
            });
        });

        describe('when passed "alpha.1" to the first function "alpha" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.1').equalTo('alpha')).toBeFalse();
            });
        });
    });

    describe('#greaterThan', () => {
        it('is a function', () => {
            expect(isPrerelease('alpha').greaterThan).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(isPrerelease('alpha').greaterThan('alpha')).toBeBoolean();
        });

        describe('when passed "alpha" to both functions', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha').greaterThan('alpha')).toBeFalse();
            });
        });

        describe('when passed "alpha" to the first function and "alpha.1" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha').greaterThan('alpha.1')).toBeFalse();
            });
        });

        describe('when passed "alpha.1" to the first function and "alpha.beta" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.1').greaterThan('alpha.beta')).toBeFalse();
            });
        });

        describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.beta').greaterThan('beta')).toBeFalse();
            });
        });

        describe('when passed "beta" to the first function and "beta.2" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta').greaterThan('beta.2')).toBeFalse();
            });
        });

        describe('when passed "beta.2" to the first function and "beta.11" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta.2').greaterThan('beta.11')).toBeFalse();
            });
        });

        describe('when passed "beta.11" to the first function and "rc.1" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta.11').greaterThan('rc.1')).toBeFalse();
            });
        });

        describe('when passed "alpha.1" to the first function and "alpha" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha.1').greaterThan('alpha')).toBeTrue();
            });
        });

        describe('when passed "alpha.beta" to the first function and "alpha.1" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha.beta').greaterThan('alpha.1')).toBeTrue();
            });
        });

        describe('when passed "beta" to the first function and "alpha.beta" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta').greaterThan('alpha.beta')).toBeTrue();
            });
        });

        describe('when passed "beta.2" to the first function and "beta" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta.2').greaterThan('beta')).toBeTrue();
            });
        });

        describe('when passed "beta.11" to the first function and "beta.2" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta.11').greaterThan('beta.2')).toBeTrue();
            });
        });

        describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('rc.1').greaterThan('beta.11')).toBeTrue();
            });
        });
    });

    describe('#greaterThanOrEqualTo', () => {
        it('is a function', () => {
            expect(isPrerelease('alpha').greaterThanOrEqualTo).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(isPrerelease('alpha').greaterThanOrEqualTo('alpha')).toBeBoolean();
        });

        describe('when passed "alpha" to both functions', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha').greaterThanOrEqualTo('alpha')).toBeTrue();
            });
        });

        describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.beta').greaterThanOrEqualTo('beta')).toBeFalse();
            });
        });

        describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('rc.1').greaterThanOrEqualTo('beta.11')).toBeTrue();
            });
        });
    });

    describe('#lessThan', () => {
        it('is a function', () => {
            expect(isPrerelease('alpha').lessThan).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(isPrerelease('alpha').lessThan('alpha')).toBeBoolean();
        });

        describe('when passed "alpha" to both functions', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha').lessThan('alpha')).toBeFalse();
            });
        });

        describe('when passed "alpha" to the first function and "alpha.1" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha').lessThan('alpha.1')).toBeTrue();
            });
        });

        describe('when passed "alpha.1" to the first function and "alpha.beta" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha.1').lessThan('alpha.beta')).toBeTrue();
            });
        });

        describe('when passed "alpha.beta" to the first function and "beta" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('alpha.beta').lessThan('beta')).toBeTrue();
            });
        });

        describe('when passed "beta" to the first function and "beta.2" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta').lessThan('beta.2')).toBeTrue();
            });
        });

        describe('when passed "beta.2" to the first function and "beta.11" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta.2').lessThan('beta.11')).toBeTrue();
            });
        });

        describe('when passed "beta.11" to the first function and "rc.1" to the second', () => {
            it('returns true', () => {
                expect(isPrerelease('beta.11').lessThan('rc.1')).toBeTrue();
            });
        });

        describe('when passed "alpha.1" to the first function and "alpha" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.1').lessThan('alpha')).toBeFalse();
            });
        });

        describe('when passed "alpha.beta" to the first function and "alpha.1" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('alpha.beta').lessThan('alpha.1')).toBeFalse();
            });
        });

        describe('when passed "beta" to the first function and "alpha.beta" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta').lessThan('alpha.beta')).toBeFalse();
            });
        });

        describe('when passed "beta.2" to the first function and "beta" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta.2').lessThan('beta')).toBeFalse();
            });
        });

        describe('when passed "beta.11" to the first function and "beta.2" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('beta.11').lessThan('beta.2')).toBeFalse();
            });
        });

        describe('when passed "rc.1" to the first function and "beta.111" to the second', () => {
            it('returns false', () => {
                expect(isPrerelease('rc.1').lessThan('beta.11')).toBeFalse();
            });
        });
    });
});
