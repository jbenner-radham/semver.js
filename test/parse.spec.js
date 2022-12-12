import { describe, expect, it } from '@jest/globals';
import { parse } from '../lib/index.js';

describe('parse', () => {
    it('is a function', () => {
        expect(parse).toBeFunction();
    });

    it('returns an object', () => {
        expect(parse()).toBeObject();
    });

    describe('when passed v1.0.0', () => {
        const VERSION = 'v1.0.0';

        it('returns the major version property', () => {
            expect(parse(VERSION).major).toEqual(1);
        });

        it('returns the minor version property', () => {
            expect(parse(VERSION).minor).toEqual(0);
        });

        it('returns the patch version property', () => {
            expect(parse(VERSION).patch).toEqual(0);
        });

        it('returns an empty preRelease property', () => {
            expect(parse(VERSION).preRelease).toEqual('');
        });

        it('returns an empty build property', () => {
            expect(parse(VERSION).build).toEqual('');
        });
    });

    describe('when passed 0.3.2', () => {
        const VERSION = '0.3.2';

        it('returns the major version property', () => {
            expect(parse(VERSION).major).toEqual(0);
        });

        it('returns the minor version property', () => {
            expect(parse(VERSION).minor).toEqual(3);
        });

        it('returns the patch version property', () => {
            expect(parse(VERSION).patch).toEqual(2);
        });

        it('returns an empty preRelease property', () => {
            expect(parse(VERSION).preRelease).toEqual('');
        });

        it('returns an empty build property', () => {
            expect(parse(VERSION).build).toEqual('');
        });
    });

    describe('when passed 1.0.5-rc.1', () => {
        const VERSION = '1.0.5-rc.1';

        it('returns the major version property', () => {
            expect(parse(VERSION).major).toEqual(1);
        });

        it('returns the minor version property', () => {
            expect(parse(VERSION).minor).toEqual(0);
        });

        it('returns the patch version property', () => {
            expect(parse(VERSION).patch).toEqual(5);
        });

        it('returns the preRelease property', () => {
            expect(parse(VERSION).preRelease).toEqual('rc.1');
        });

        it('returns an empty build property', () => {
            expect(parse(VERSION).build).toEqual('');
        });
    });

    describe('when passed v1.5.2-beta.2+fe523', () => {
        const VERSION = 'v1.5.2-beta.2+fe523';

        it('returns the major version property', () => {
            expect(parse(VERSION).major).toEqual(1);
        });

        it('returns the minor version property', () => {
            expect(parse(VERSION).minor).toEqual(5);
        });

        it('returns the patch version property', () => {
            expect(parse(VERSION).patch).toEqual(2);
        });

        it('returns the preRelease property', () => {
            expect(parse(VERSION).preRelease).toEqual('beta.2');
        });

        it('returns the build property', () => {
            expect(parse(VERSION).build).toEqual('fe523');
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
