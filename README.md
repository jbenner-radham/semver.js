@radham/semver
==============
[![CI Status][CI BADGE]][CI PAGE]

A library for parsing and working with [Semantic Versioning](https://semver.org/).

Why Another SemVer Library?
---------------------------
This library doesn't use RegEx at all. Meaning that it's immune to [ReDoS](https://en.wikipedia.org/wiki/ReDoS) attacks. Is that a big deal? Honestly, I'll leave that up to you to decide. Another reason is that I felt the APIs of the available SemVer packages could be more semantic, so I figured I'd try my hand at it while keeping the package at zero dependencies.

Install
-------
```shell
npm install @radham/semver
```

Usage
-----
```javascript
import { is, parse } from '@radham/semver';

// Comparison methods will throw on invalid versions so you may want to validate first.
is('0.5.5-rc.1').valid(); // > true
is('1.0.0').stable(); // > true
is('0.1.0').unstable(); // > true
is('1.0.0').equalTo('1.0.0'); // > true
is('0.8.5').greaterThan('1.0.0'); // > false
is('2.1.3').greaterThanOrEqualTo('1.5.2'); // > true
is('0.0.23').lessThan('0.0.38'); // > true
is('1.6.8').lessThanOrEqualTo('1.6.8-beta.1'); // > false

parse('v1.5.2-beta.2+fe523');
// > {
// >   major: 1,
// >   minor: 5,
// >   patch: 2,
// >   prerelease: 'beta.2',
// >   build: 'fe523',
// >   versionCore: '1.5.2'
// > }
```

If you feel the API is too verbose, convenience methods are available.

```javascript
import { is, parse } from '@radham/semver';

// Comparison methods will throw on invalid versions so you may want to validate first.
is('0.5.5-rc.1').valid(); // > true
is('1.0.0').stable(); // > true
is('0.1.0').unstable(); // > true
is('1.0.0').eq('1.0.0'); // > true
is('0.8.5').gt('1.0.0'); // > false
is('2.1.3').gte('1.5.2'); // > true
is('0.0.23').lt('0.0.38'); // > true
is('1.6.8').lte('1.6.8-beta.1'); // > false

parse('v1.5.2-beta.2+fe523');
// > {
// >   major: 1,
// >   minor: 5,
// >   patch: 2,
// >   prerelease: 'beta.2',
// >   build: 'fe523',
// >   versionCore: '1.5.2'
// > }
```

Or if you find the default imports too ambiguously named.

```javascript
import { is as isVersion, parse as parseVersion } from '@radham/semver';

// Comparison methods will throw on invalid versions so you may want to validate first.
isVersion('0.5.5-rc.1').valid(); // > true
isVersion('1.0.0').stable(); // > true
isVersion('0.1.0').unstable(); // > true
isVersion('1.0.0').equalTo('1.0.0'); // > true
isVersion('0.8.5').greaterThan('1.0.0'); // > false
isVersion('2.1.3').greaterThanOrEqualTo('1.5.2'); // > true
isVersion('0.0.23').lessThan('0.0.38'); // > true
isVersion('1.6.8').lessThanOrEqualTo('1.6.8-beta.1'); // > false

parseVersion('v1.5.2-beta.2+fe523');
// > {
// >   major: 1,
// >   minor: 5,
// >   patch: 2,
// >   prerelease: 'beta.2',
// >   build: 'fe523',
// >   versionCore: '1.5.2'
// > }
```

Reference
---------
* [Semantic Versioning](https://semver.org/)

Prior Art
---------
* [semver](https://github.com/npm/node-semver#readme)

License
-------
The BSD 3-Clause License. See the [license file](LICENSE) for details.

[CI BADGE]: https://github.com/jbenner-radham/semver.js/actions/workflows/ci.yaml/badge.svg
[CI PAGE]: https://github.com/jbenner-radham/semver.js/actions/workflows/ci.yaml
