export default class SemanticVersion {
  readonly #major: number;

  readonly #minor: number;

  readonly #patch: number;

  readonly #prerelease: string;

  readonly #build: string;

  get major(): number {
    return this.#major;
  }

  get minor(): number {
    return this.#minor;
  }

  get patch(): number {
    return this.#patch;
  }

  get prerelease(): string {
    return this.#prerelease;
  }

  get build(): string {
    return this.#build;
  }

  get versionCore(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  constructor({
    major,
    minor,
    patch,
    prerelease = '',
    build = ''
  }: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    build?: string;
  }) {
    this.#major = major;
    this.#minor = minor;
    this.#patch = patch;
    this.#prerelease = prerelease;
    this.#build = build;
  }

  toString(): string {
    if (this.prerelease.length && this.build.length) {
      return `${this.versionCore}-${this.prerelease}+${this.build}`;
    }

    if (this.prerelease.length && !this.build.length) {
      return `${this.versionCore}-${this.prerelease}`;
    }

    if (!this.prerelease.length && this.build.length) {
      return `${this.versionCore}+${this.build}`;
    }

    return this.versionCore;
  }
}
