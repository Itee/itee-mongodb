# [v3.0.1](https://github.com/Itee/mongodb/compare/v3.0.0...v3.0.1) (2026-01-23)

# [v3.0.0](https://github.com/Itee/mongodb/compare/v2.0.0...v3.0.0) (2026-01-23)

## 🐛 Bug Fixes
- [`c189d70`](https://github.com/Itee/mongodb/commit/c189d70)  (package) apply package override to fix trust publishing 

## 💥 Breaking Changes
- [`3695fbb`](https://github.com/Itee/mongodb/commit/3695fbb)  (package) change package name itee-mongodb to scoped version @itee/mongodb

# [v2.0.0](https://github.com/Itee/mongodb/compare/v1.2.0...v2.0.0) (2026-01-23)

## ✨ New Features
- [`8e2b586`](https://github.com/Itee/mongodb/commit/8e2b586)  (tasks) upgrade tasks to latest itee and gulp standards 
- [`3cfab9f`](https://github.com/Itee/mongodb/commit/3cfab9f)  (tasks) update default tasks to latest itee standards 
- [`52e440e`](https://github.com/Itee/mongodb/commit/52e440e)  (tests) remove the need to build backend file to run unit and benches tests 

## 🐛 Bug Fixes
- [`bc395e3`](https://github.com/Itee/mongodb/commit/bc395e3)  (gulpfile) fix broken import links 
- [`2ac59c1`](https://github.com/Itee/mongodb/commit/2ac59c1)  (TMongoDBPlugin) fix broken itee-utils import on fs methods 
- [`edb7e64`](https://github.com/Itee/mongodb/commit/edb7e64)  (gulpfile-refresh) use external script that do not require gulp to be loaded for refreshing it 
- [`e7a604e`](https://github.com/Itee/mongodb/commit/e7a604e)  (compute-unit-tests-task) fix default template for empty units 
- [`c21d12d`](https://github.com/Itee/mongodb/commit/c21d12d)  (tasks) fix frontend task run on empty test generation 
- [`698fe9e`](https://github.com/Itee/mongodb/commit/698fe9e)  (release) fix release task and update others to latest standards 

## 💥 Breaking Changes
- [`0266f5e`](https://github.com/Itee/mongodb/commit/0266f5e)  (node) drop nodejs v18 support and introduce nodejs v24

# [v1.2.0](https://github.com/Itee/itee-mongodb/compare/v1.1.7...v1.2.0) (2025-10-20)

## ✨ New Features
- [`a4cfd96`](https://github.com/Itee/itee-mongodb/commit/a4cfd96)  (package) use cz-emoji in favor of cz-conventional-changlog 
- [`9143935`](https://github.com/Itee/itee-mongodb/commit/9143935)  (gulpfile) split gulpfile tasks into sub-tasks files 

## 🐛 Bug Fixes
- [`8136632`](https://github.com/Itee/itee-mongodb/commit/8136632)  (gulpfile) fix gulp.conf file extension 
- [`a86b64c`](https://github.com/Itee/itee-mongodb/commit/a86b64c)  (rollup.conf) fix removed parameter name to fix iife generation

## [1.1.7](https://github.com/Itee/itee-mongodb/compare/v1.1.6...v1.1.7) (2025-09-08)


### Bug Fixes

* **tmongodbdatabase:** add database url filter for password in log output ([e96d051](https://github.com/Itee/itee-mongodb/commit/e96d051c1f5d0542a1e0b6c8ec13a7520de946e4))

## [1.1.6](https://github.com/Itee/itee-mongodb/compare/v1.1.5...v1.1.6) (2022-02-14)


### Bug Fixes

* **package:** update deps to latest version ([fb05bbb](https://github.com/Itee/itee-mongodb/commit/fb05bbbc03fead0c4d735bb0f1ca2ac5b81b3780))

## [1.1.5](https://github.com/Itee/itee-mongodb/compare/v1.1.4...v1.1.5) (2022-02-14)


### Bug Fixes

* **package:** apply npm run audit fix ([97502ef](https://github.com/Itee/itee-mongodb/commit/97502ef2c8818038d4f2bfb721223d6dcb2c53d1))
* **package:** update deps to latest version ([b0a9b8f](https://github.com/Itee/itee-mongodb/commit/b0a9b8f0b2c45420df2341eb3303cbf3c5f43132))

## [1.1.4](https://github.com/Itee/itee-mongodb/compare/v1.1.3...v1.1.4) (2021-07-21)


### Bug Fixes

* **readme:** add simple readme content ([4bab388](https://github.com/Itee/itee-mongodb/commit/4bab388861e96119ff69eb34e6a72bf737e54aca))

## [1.1.3](https://github.com/Itee/itee-mongodb/compare/v1.1.2...v1.1.3) (2021-07-08)


### Bug Fixes

* **mongoose:** fix driver import usage ([becb53a](https://github.com/Itee/itee-mongodb/commit/becb53a70b060d737f11461a5490589e04abc263))
* **package:** apply dependencies fix ([ced7065](https://github.com/Itee/itee-mongodb/commit/ced7065d220eda913e78cd362d7a31d2da8cdc55))
* **package:** apply fix from dependencies ([1b079c4](https://github.com/Itee/itee-mongodb/commit/1b079c43a8127eee4ef72e45ae6f647ab82806c4))

## [1.1.2](https://github.com/Itee/itee-mongodb/compare/v1.1.1...v1.1.2) (2021-07-05)


### Bug Fixes

* **releaserc:** fix missing dev maps ([4358c12](https://github.com/Itee/itee-mongodb/commit/4358c12c1a8d8697263e0126d485ba496aae2f03))

## [1.1.1](https://github.com/Itee/itee-mongodb/compare/v1.1.0...v1.1.1) (2021-07-05)


### Bug Fixes

* **package:** apply npm audit fix ([e14f631](https://github.com/Itee/itee-mongodb/commit/e14f6316a2f0941b30b30663b682d4fef5fea27d))
* **package:** update all dependencies to their latest version ([d351fa1](https://github.com/Itee/itee-mongodb/commit/d351fa1886de758f3a51d9671fbb8230f0f6b7b4))
* **rollupconfig:** fix plugin-node-resolve import ([482e5bf](https://github.com/Itee/itee-mongodb/commit/482e5bfe47a6c420b4050a7115b8fb9d1654bf6d))

# [1.1.0](https://github.com/Itee/itee-mongodb/compare/v1.0.2...v1.1.0) (2020-02-24)


### Features

* **tmongodbdatabase:** allow to specific driver options using databaseOptions parameter ([23814c9](https://github.com/Itee/itee-mongodb/commit/23814c98ab5b3554ad0437145e340b448864e045))

## [1.0.2](https://github.com/Itee/itee-mongodb/compare/v1.0.1...v1.0.2) (2020-02-18)


### Bug Fixes

* **package:** consider itee-database as peer dependency ([a51ef11](https://github.com/Itee/itee-mongodb/commit/a51ef11ee4a15482cdc7e1988fb1b973590b2855))

## [1.0.1](https://github.com/Itee/itee-mongodb/compare/v1.0.0...v1.0.1) (2020-02-17)


### Bug Fixes

* **package:** the package lock still contain old package that need to be cleaned ([14d93c8](https://github.com/Itee/itee-mongodb/commit/14d93c84cca53cba3405baf9fa4462f3bf3b6201))

# 1.0.0 (2020-02-17)


### Code Refactoring

* **global:** populate repository ([4d79773](https://github.com/Itee/itee-mongodb/commit/4d7977364adb4cb76f11cf7811ef3b973ae7cd3c))


### BREAKING CHANGES

* **global:** populate
