Changelog
=========

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[0.3.0] - 2025-08-30
--------------------

### Changed

- The returned object from the `parse(...)` function now contains a `versionCore` property.

[0.2.0] - 2025-08-23
--------------------

### Added

- Add `is(...).stable()` method.
- Add `is(...).unstable()` method.

[0.1.1] - 2025-08-23
--------------------

### Fixed

- Fix the `is(...).valid()` function returning true for numbers which don't have a major, minor, and patch version.

[0.1.0] - 2025-08-22
--------------------

### Added

- Initial release.

[0.3.0]: https://github.com/jbenner-radham/semver.js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/jbenner-radham/semver.js/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/jbenner-radham/semver.js/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jbenner-radham/semver.js/releases/tag/v0.1.0
