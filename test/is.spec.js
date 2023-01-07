import { describe, expect, it } from '@jest/globals';
import { is } from '../lib/index.js';

describe('is', () => {
    it('is a function', () => {
        expect(is).toBeFunction();
    });

    it('returns an object', () => {
        expect(is('1.0.0')).toBeObject();
    });

    describe('#equalTo', () => {
        it('is a function', () => {
            expect(is('1.0.0').equalTo).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(is('1.0.0').equalTo('1.0.0')).toBeBoolean();
        });

        describe('when passed 1.0.0 to both functions', () => {
            it('returns true', () => {
                expect(is('1.0.0').equalTo('1.0.0')).toBeTrue();
            });
        });

        describe('when passed 1.0.0 to the first function and 1.0.0-beta.2 to the second', () => {
            it('returns false', () => {
                expect(is('1.0.0').equalTo('1.0.0-beta.2')).toBeFalse();
            });
        });
    });

    describe('#greaterThan', () => {
        it('is a function', () => {
            expect(is('1.0.0').greaterThan).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(is('1.0.0').greaterThan('1.0.0')).toBeBoolean();
        });

        describe('when passed 1.0.0 to both functions', () => {
            it('returns false', () => {
                expect(is('1.0.0').greaterThan('1.0.0')).toBeFalse();
            });
        });

        describe('when passed 1.0.0 to the first function and 0.1.0 to the second', () => {
            it('returns true', () => {
                expect(is('1.0.0').greaterThan('0.1.0')).toBeTrue();
            });
        });

        describe('when passed 0.5.1 to the first function and 0.5.2 to the second', () => {
            it('returns false', () => {
                expect(is('0.5.1').greaterThan('0.5.2')).toBeFalse();
            });
        });

        describe('when passed 1.0.0 to the first function and 1.0.0-beta to the second', () => {
            it('returns true', () => {
                expect(is('1.0.0').greaterThan('1.0.0-beta')).toBeTrue();
            });
        });

        describe('when passed 1.0.0-beta to the first function and 1.0.0 to the second', () => {
            it('returns false', () => {
                expect(is('1.0.0-beta').greaterThan('1.0.0')).toBeFalse();
            });
        });

        describe('when passed 1.0.0-rc.2 to the first function and 1.0.0-beta.11 to the second', () => {
            it('returns true', () => {
                expect(is('1.0.0-rc.2').greaterThan('1.0.0-beta.11')).toBeTrue();
            });
        });
    });

    describe('#greaterThanOrEqualTo', () => {
        it('is a function', () => {
            expect(is('1.0.0').greaterThanOrEqualTo).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(is('1.0.0').greaterThanOrEqualTo('1.0.0')).toBeBoolean();
        });

        describe('when passed 1.0.0 to both functions', () => {
            it('returns true', () => {
                expect(is('1.0.0').greaterThanOrEqualTo('1.0.0')).toBeTrue();
            });
        });

        describe('when passed 1.0.0 to the first function and 0.1.0 to the second', () => {
            it('returns true', () => {
                expect(is('1.0.0').greaterThanOrEqualTo('0.1.0')).toBeTrue();
            });
        });

        describe('when passed 0.5.1 to the first function and 0.5.2 to the second', () => {
            it('returns false', () => {
                expect(is('0.5.1').greaterThan('0.5.2')).toBeFalse();
            });
        });
    });

    describe('#lessThan', () => {
        it('is a function', () => {
            expect(is('1.0.0').lessThan).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(is('1.0.0').lessThan('1.0.0')).toBeBoolean();
        });

        describe('when passed 1.0.0 to both functions', () => {
            it('returns false', () => {
                expect(is('1.0.0').lessThan('1.0.0')).toBeFalse();
            });
        });

        describe('when passed 0.8.2 to the first function and 0.9.0 to the second', () => {
            it('returns true', () => {
                expect(is('0.8.2').lessThan('0.9.0')).toBeTrue();
            });
        });

        describe('when passed 1.1.1 to the first function and 1.0.1 to the second', () => {
            it('returns false', () => {
                expect(is('1.1.1').lessThan('1.0.1')).toBeFalse();
            });
        });
    });

    describe('#lessThanOrEqualTo', () => {
        it('is a function', () => {
            expect(is('1.0.0').lessThanOrEqualTo).toBeFunction();
        });

        it('returns a boolean', () => {
            expect(is('1.0.0').lessThanOrEqualTo('1.0.0')).toBeBoolean();
        });

        describe('when passed 1.0.0 to both functions', () => {
            it('returns true', () => {
                expect(is('1.0.0').lessThanOrEqualTo('1.0.0')).toBeTrue();
            });
        });

        describe('when passed 2.3.3 to the first function and 1.0.1 to the second', () => {
            it('returns false', () => {
                expect(is('2.3.3').lessThanOrEqualTo('1.0.1')).toBeFalse();
            });
        });

        describe('when passed 0.1.3 to the first function and 0.5.5 to the second', () => {
            it('returns true', () => {
                expect(is('0.1.3').lessThanOrEqualTo('0.5.5')).toBeTrue();
            });
        });
    });
});
