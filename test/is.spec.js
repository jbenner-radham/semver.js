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
            it('returns true', () => {
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
    });
});
