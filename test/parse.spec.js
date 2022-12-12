import { parse } from '../lib/index.js';

describe('semver', () => {
    describe('parse', () => {
        it('is a function', () => {
            expect(typeof parse).toEqual('function');
        });

        it('returns an object', () => {
            expect(typeof parse()).toEqual('object');
        });

        describe('when passed v1.0.0', () => {
            it('returns the major version property', () => {
                expect(parse('v1.0.0').major).toEqual(1);
            });

            it('returns the minor version property', () => {
                expect(parse('v1.0.0').minor).toEqual(0);
            });

            it('returns the patch version property', () => {
                expect(parse('v1.0.0').patch).toEqual(0);
            });
        });

        describe('when passed 0.3.2', () => {
            it('returns the major version property', () => {
                expect(parse('0.3.2').major).toEqual(0);
            });

            it('returns the minor version property', () => {
                expect(parse('0.3.2').minor).toEqual(3);
            });

            it('returns the patch version property', () => {
                expect(parse('0.3.2').patch).toEqual(2);
            });
        });

        describe('when passed v1.5.2-beta.2+fe523', () => {
            it('returns the major version property', () => {
                expect(parse('v1.5.2-beta.2+fe523').major).toEqual(1);
            });

            it('returns the minor version property', () => {
                expect(parse('v1.5.2-beta.2+fe523').minor).toEqual(5);
            });

            it('returns the patch version property', () => {
                expect(parse('v1.5.2-beta.2+fe523').patch).toEqual(2);
            });

            it('returns the preRelease property', () => {
                expect(parse('v1.5.2-beta.2+fe523').preRelease).toEqual('beta.2');
            });

            it('returns the build property', () => {
                expect(parse('v1.5.2-beta.2+fe523').build).toEqual('fe523');
            });
        });

        describe('when passed 5.0.1+exp.sha.5114f85', () => {
            const VERSION = '5.0.1+exp.sha.5114f85';

            it('returns the major version property', () => {
                expect(parse(VERSION).major).toEqual(5);
            });

            it('returns the minor version property', () => {
                expect(parse(VERSION).minor).toEqual(0);
            });

            it('returns the patch version property', () => {
                expect(parse(VERSION).patch).toEqual(1);
            });

            it('returns an empty preRelease property', () => {
                expect(parse(VERSION).preRelease).toEqual('');
            });

            it('returns the build property', () => {
                expect(parse(VERSION).build).toEqual('exp.sha.5114f85');
            });
        });
    });
});
