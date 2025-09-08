Changelog
=========

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Unreleased]
------------

### Added

- A `SemanticVersion` type to represent the result of the `parse(...)` function.
- A `SPEC_VERSION` constant which identifies which version of the SemVer spec this module implements.

[0.6.0] - 2025-09-07
--------------------

### Added

- Shorthand convenience methods: `is(...).eq(...)`, `is(...).gt(...)`, `is(...).gte(...)`, `is(...).lt(...)`, and `is(...).lte(...)`.

### Changed

- Added more examples to the "Usage" section of the readme.

[0.5.0] - 2025-09-07
--------------------

### Changed

- The `AggregateError` which may be thrown when parsing an invalid version now contains quotes in its message.

### Fixed

- The `is(...).valid(...)` method now validates build metadata if present.
- The `parse(...)` function now throws on empty identifiers in pre-release versions and build metadata.

[0.4.0] - 2025-09-01
--------------------

### Added

- Add TypeScript types.

### Changed

- Now exports CommonJS and ESM modules.

[0.3.0] - 2025-08-30
--------------------

### Changed

- The returned object from the `parse(...)` function now contains a `versionCore` property.

[0.2.0] - 2025-08-23
--------------------

### Added

- Add `is(...).stable(...)` method.
- Add `is(...).unstable(...)` method.

[0.1.1] - 2025-08-23
--------------------

### Fixed

- Fix the `is(...).valid(...)` function returning true for numbers which don't have a major, minor, and patch version.

[0.1.0] - 2025-08-22
--------------------

### Added

- Initial release.

[Unreleased]: https://github.com/jbenner-radham/semver.js/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/jbenner-radham/semver.js/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/jbenner-radham/semver.js/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/jbenner-radham/semver.js/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/jbenner-radham/semver.js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/jbenner-radham/semver.js/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/jbenner-radham/semver.js/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jbenner-radham/semver.js/releases/tag/v0.1.0
