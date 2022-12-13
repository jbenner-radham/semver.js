@radham/semver
==============
[![CI Status][CI BADGE]][CI PAGE]

A library for parsing and working with [Semantic Versioning](https://semver.org/).

Why Another SemVer Library?
---------------------------
This library doesn't use RegEx at all. Meaning that it's immune to [ReDoS](https://en.wikipedia.org/wiki/ReDoS) attacks. Is that a big deal? Honestly, I don't know so I'll leave that up to you to decide. Another reason is that I felt the APIs of the available SemVer packages could be more ergonomic so I figured I'd try my hand at it while keeping the package at zero dependencies.

Reference
---------
* [Semantic Versioning](https://semver.org/)

License
-------
The MIT License. See the [license file](LICENSE) for details.

[CI BADGE]: https://github.com/jbenner-radham/semver.js/actions/workflows/ci.yaml/badge.svg
[CI PAGE]: https://github.com/jbenner-radham/semver.js/actions/workflows/ci.yaml
