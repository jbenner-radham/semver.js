import SemanticVersion from '../src/semantic-version';
import { describe, expect, it } from 'vitest';

describe('SemanticVersion', () => {
  it('is a class', () => {
    expect(SemanticVersion).toBeTypeOf('function');
  });

  it('has a major property', () => {
    const major = 1;
    const version = new SemanticVersion({ major, minor: 0, patch: 0 });

    expect(version.major).toEqual(major);
  });

  it('has a minor property', () => {
    const minor = 0;
    const version = new SemanticVersion({ major: 1, minor, patch: 0 });

    expect(version.minor).toEqual(minor);
  });

  it('has a patch property', () => {
    const patch = 0;
    const version = new SemanticVersion({ major: 1, minor: 0, patch });

    expect(version.patch).toEqual(patch);
  });

  it('has a prerelease property', () => {
    const prerelease = 'beta.2';
    const version = new SemanticVersion({ major: 1, minor: 0, patch: 0, prerelease });

    expect(version.prerelease).toEqual(prerelease);
  });

  it('has a prerelease property which defaults to an empty string', () => {
    const version = new SemanticVersion({ major: 1, minor: 0, patch: 0 });

    expect(version.prerelease).toEqual('');
  });

  it('has a build property', () => {
    const build = 'fe523';
    const version = new SemanticVersion({ major: 1, minor: 0, patch: 0, build });

    expect(version.build).toEqual(build);
  });

  it('has a build property which defaults to an empty string', () => {
    const version = new SemanticVersion({ major: 1, minor: 0, patch: 0 });

    expect(version.build).toEqual('');
  });

  it('has a versionCore property', () => {
    const major = 1;
    const minor = 3;
    const patch = 37;
    const prerelease = 'beta.2';
    const build = 'fe523';
    const version = new SemanticVersion({ major, minor, patch, prerelease, build });

    expect(version.versionCore).toEqual(`${major}.${minor}.${patch}`);
  });

  describe('.toString()', () => {
    it('outputs as a string when passed a version core with a prerelease and build', () => {
      const major = 1;
      const minor = 3;
      const patch = 37;
      const prerelease = 'beta.2';
      const build = 'fe523';
      const version = new SemanticVersion({ major, minor, patch, prerelease, build });

      expect(version.toString()).toEqual(`${major}.${minor}.${patch}-${prerelease}+${build}`);
    });

    it('outputs as a string when passed a version core with a prerelease', () => {
      const major = 1;
      const minor = 3;
      const patch = 37;
      const prerelease = 'beta.2';
      const version = new SemanticVersion({ major, minor, patch, prerelease });

      expect(version.toString()).toEqual(`${major}.${minor}.${patch}-${prerelease}`);
    });

    it('outputs as a string when passed a version core with a build', () => {
      const major = 1;
      const minor = 3;
      const patch = 37;
      const build = 'fe523';
      const version = new SemanticVersion({ major, minor, patch, build });

      expect(version.toString()).toEqual(`${major}.${minor}.${patch}+${build}`);
    });

    it('outputs as a string when passed a version core', () => {
      const major = 1;
      const minor = 3;
      const patch = 37;
      const version = new SemanticVersion({ major, minor, patch });

      expect(version.toString()).toEqual(`${major}.${minor}.${patch}`);
    });
  });
});
