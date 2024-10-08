# Changelog

## [0.22.1](https://github.com/zakodium/adonis-apollo/compare/v0.22.0...v0.22.1) (2024-08-27)


### Bug Fixes

* typescript build ([#63](https://github.com/zakodium/adonis-apollo/issues/63)) ([fb69c00](https://github.com/zakodium/adonis-apollo/commit/fb69c00f07fe09508ec740d102e720266324c94f))

## [0.22.0](https://github.com/zakodium/adonis-apollo/compare/v0.21.0...v0.22.0) (2024-08-26)


### Features

* allow class fields resolvers and support inheritance from class prototype ([#60](https://github.com/zakodium/adonis-apollo/issues/60)) ([1fdb109](https://github.com/zakodium/adonis-apollo/commit/1fdb10912e4382847e7b8164052bbad43048b76f))

## [0.21.0](https://github.com/zakodium/adonis-apollo/compare/v0.20.0...v0.21.0) (2024-01-09)


### Features

* provide another way of creating the formatError handler which enables importing IoC dependencies ([#56](https://github.com/zakodium/adonis-apollo/issues/56)) ([ee27363](https://github.com/zakodium/adonis-apollo/commit/ee27363853ac0a6ea36d478dd489eed6724f350a))

## [0.20.0](https://github.com/zakodium/adonis-apollo/compare/v0.19.0...v0.20.0) (2023-12-21)


### Features

* add support for IoC in resolvers defined as classes ([#52](https://github.com/zakodium/adonis-apollo/issues/52)) ([1b37226](https://github.com/zakodium/adonis-apollo/commit/1b37226d87f6db7998a3b9f4fb30ddb0fecb593c))

## [0.19.0](https://github.com/zakodium/adonis-apollo/compare/v0.18.0...v0.19.0) (2023-07-21)


### Features

* update dependencies ([#48](https://github.com/zakodium/adonis-apollo/issues/48)) ([efc724f](https://github.com/zakodium/adonis-apollo/commit/efc724fc07c1ef10368fbdc6199a54d8c295fa55))

## [0.18.0](https://github.com/zakodium/adonis-apollo/compare/v0.17.0...v0.18.0) (2023-02-28)


### ⚠ BREAKING CHANGES

* Apollo Server was upgraded to version 4. The `enableUploads` config option is now `false` by default. The default GraphQL context doesn't include the `ctx` property anymore (it is now an empty object). The value is still passed to the context function. The `context` config option should now be passed at the top level instead of the `apolloServer` object. The `enablePlayground` and `playgroundOptions` config options were removed. You can now use Apollo Server plugins to configure the landing page. ApolloError and friends were removed so we also removed the `Zakodium/Apollo/Errors` re-export path. See https://www.apollographql.com/docs/apollo-server/migration/ for all details.

### Code Refactoring

* migrate to Apollo Server v4 ([#41](https://github.com/zakodium/adonis-apollo/issues/41)) ([9c9cd3a](https://github.com/zakodium/adonis-apollo/commit/9c9cd3a358a7a5d9d0e3047df83502b110e07996))

## [0.17.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.16.0...v0.17.0) (2021-09-26)


### Features

* expose FileUpload type ([f7635c0](https://www.github.com/zakodium/adonis-apollo/commit/f7635c0f075e60030f60d7feedc28aa6a6ca8265))

## [0.16.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.15.0...v0.16.0) (2021-09-02)


### Features

* always support all resolvers of the current graphql-scalar version ([30ecf36](https://www.github.com/zakodium/adonis-apollo/commit/30ecf3646dd30f0130f47fd8da451587008ec49c))

## [0.15.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.14.0...v0.15.0) (2021-09-01)


### ⚠ BREAKING CHANGES

* applyMiddleware() no longer needs route in its parameters
* removed getPlaygroundHandler method
* add enablePlayground and playgroundOptions in config. The Playground is no longer available by default in production.
* the GraphQL playground is now rendered at the same URL as the API. GET queries to the API are still possible.
* change organization of IoC bindings

### Features

* add enablePlayground and playgroundOptions in config. The Playground is no longer available by default in production. ([2b07ac0](https://www.github.com/zakodium/adonis-apollo/commit/2b07ac0067b2f7a0ce73983125301d45b82b1020))
* add enableUploads and uploadOptions in config ([2b07ac0](https://www.github.com/zakodium/adonis-apollo/commit/2b07ac0067b2f7a0ce73983125301d45b82b1020))


### Code Refactoring

* applyMiddleware() no longer needs route in its parameters ([2b07ac0](https://www.github.com/zakodium/adonis-apollo/commit/2b07ac0067b2f7a0ce73983125301d45b82b1020))
* change organization of IoC bindings ([39d9bdd](https://www.github.com/zakodium/adonis-apollo/commit/39d9bdd7e93bd24f224e765eb2f258ee804d7af3))
* removed getPlaygroundHandler method ([2b07ac0](https://www.github.com/zakodium/adonis-apollo/commit/2b07ac0067b2f7a0ce73983125301d45b82b1020))
* the GraphQL playground is now rendered at the same URL as the API. GET queries to the API are still possible. ([2b07ac0](https://www.github.com/zakodium/adonis-apollo/commit/2b07ac0067b2f7a0ce73983125301d45b82b1020))

## [0.14.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.13.1...v0.14.0) (2021-05-17)


### ⚠ BREAKING CHANGES

* The playground is now available on /graphql/playground instead of /graphql

### Features

* allow GET requests for graphql route ([#29](https://www.github.com/zakodium/adonis-apollo/issues/29)) ([691928a](https://www.github.com/zakodium/adonis-apollo/commit/691928ace19e6631587026785627f12f51c4216f))

### [0.13.1](https://www.github.com/zakodium/adonis-apollo/compare/v0.13.0...v0.13.1) (2021-02-04)


### Bug Fixes

* throw error if provider is initialized while it is alreary loading ([#27](https://www.github.com/zakodium/adonis-apollo/issues/27)) ([6d29b08](https://www.github.com/zakodium/adonis-apollo/commit/6d29b0858aff639bc70db5344ccb4d78f7cabd3f))

## [0.13.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.12.0...v0.13.0) (2020-12-01)


### Features

* allow multiple schemas and resolvers folders ([#20](https://www.github.com/zakodium/adonis-apollo/issues/20)) ([b04ec1c](https://www.github.com/zakodium/adonis-apollo/commit/b04ec1c43564ac0450eb216f3ee16d7b6964ec94))

## [0.12.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.11.0...v0.12.0) (2020-11-20)


### Features

* expose Apollo errors as Apollo/Errors ioc binding ([34719fe](https://www.github.com/zakodium/adonis-apollo/commit/34719fe9e5953d9d958ee34952ee62e60bb76925))


### Bug Fixes

* **types:** make playgroundSettings optional ([6c3f678](https://www.github.com/zakodium/adonis-apollo/commit/6c3f6788e7915abb3ac02d6274f206a6a10e8d75))

## [0.11.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.10.0...v0.11.0) (2020-11-19)


### Features

* use APP_URL for graphql endpoint and add prefix config option ([#16](https://www.github.com/zakodium/adonis-apollo/issues/16)) ([84ddbe8](https://www.github.com/zakodium/adonis-apollo/commit/84ddbe8276668dad1626d561206ceda349cb9592))

## [0.10.0](https://www.github.com/zakodium/adonis-apollo/compare/v0.9.0...v0.10.0) (2020-11-17)


### Features

* update graphql-playground and allow playground settings customization ([#14](https://www.github.com/zakodium/adonis-apollo/issues/14)) ([0fc35d1](https://www.github.com/zakodium/adonis-apollo/commit/0fc35d1a0615c1ad81a7d856cbc40691079c419e))

## [0.9.0](https://github.com/zakodium/adonis-apollo/compare/v0.8.0...v0.9.0) (2020-10-12)

# [0.8.0](https://github.com/zakodium/adonis-apollo/compare/v0.7.3...v0.8.0) (2020-10-07)


### Features

* include resolvers for graphql-scalars scalar types and warn for missing resolvers ([#8](https://github.com/zakodium/adonis-apollo/issues/8)) ([d4fcf15](https://github.com/zakodium/adonis-apollo/commit/d4fcf15a6a868f94744c37527fd74ce924be716d))



## [0.7.3](https://github.com/zakodium/adonis-apollo/compare/v0.7.2...v0.7.3) (2020-08-04)


### Bug Fixes

* update to graphql-upload 11 for compatibility with nodejs 14 ([#3](https://github.com/zakodium/adonis-apollo/issues/3)) ([b94eb70](https://github.com/zakodium/adonis-apollo/commit/b94eb70193e1e2e39120c4a0f55e063558502f69))



## [0.7.2](https://github.com/zakodium/adonis-apollo/compare/v0.7.1...v0.7.2) (2020-07-31)


### Bug Fixes

* pin graphql playground to working version ([d46b18d](https://github.com/zakodium/adonis-apollo/commit/d46b18d01904e648b6371f2b2090e1ba7490088f))



## [0.7.1](https://github.com/zakodium/adonis-apollo/compare/v0.7.0...v0.7.1) (2020-07-29)


### Bug Fixes

* inverse recursive option of loadFilesSync ([ba76f5a](https://github.com/zakodium/adonis-apollo/commit/ba76f5a86ec44965df9ef3e636e9bbbdfeeec557))



# [0.7.0](https://github.com/zakodium/adonis-apollo/compare/v0.6.6...v0.7.0) (2020-07-29)



## [0.6.6](https://github.com/zakodium/adonis-apollo/compare/v0.6.5...v0.6.6) (2020-04-14)



## [0.6.5](https://github.com/zakodium/adonis-apollo/compare/v0.6.4...v0.6.5) (2019-12-03)


### Bug Fixes

* really correctly read templates ([f9a8b97](https://github.com/zakodium/adonis-apollo/commit/f9a8b973c3240376140c7de8d88056ca7cbb597f))



## [0.6.4](https://github.com/zakodium/adonis-apollo/compare/v0.6.3...v0.6.4) (2019-12-03)



## [0.6.3](https://github.com/zakodium/adonis-apollo/compare/v0.6.2...v0.6.3) (2019-12-03)


### Bug Fixes

* make paths always work in dev ([d11e97a](https://github.com/zakodium/adonis-apollo/commit/d11e97a499c2097bf5ced0093b83149ec07ee029))



## [0.6.2](https://github.com/zakodium/adonis-apollo/compare/v0.6.1...v0.6.2) (2019-12-02)


### Bug Fixes

* use correct base path for templates ([8a43817](https://github.com/zakodium/adonis-apollo/commit/8a438172efb157072886dfd436f59a78bd9ef929))



## [0.6.1](https://github.com/zakodium/adonis-apollo/compare/v0.6.0...v0.6.1) (2019-12-02)



# [0.6.0](https://github.com/zakodium/adonis-apollo/compare/v0.5.0...v0.6.0) (2019-11-26)


### Bug Fixes

* adapt to latest adonis ([938192a](https://github.com/zakodium/adonis-apollo/commit/938192a4d4dd0a10948f0a2f901faab3d8d8a061))



# [0.5.0](https://github.com/zakodium/adonis-apollo/compare/v0.4.3...v0.5.0) (2019-09-26)


### Features

* add support for passing options to makeExecutableSchema ([7b8b1d3](https://github.com/zakodium/adonis-apollo/commit/7b8b1d3))



## [0.4.3](https://github.com/zakodium/adonis-apollo/compare/v0.4.2...v0.4.3) (2019-09-11)


### Bug Fixes

* do not use build by default in test env ([fd22643](https://github.com/zakodium/adonis-apollo/commit/fd22643))



## [0.4.2](https://github.com/zakodium/adonis-apollo/compare/v0.4.1...v0.4.2) (2019-09-11)


### Bug Fixes

* type extends of ApolloServerBase ([698a2f8](https://github.com/zakodium/adonis-apollo/commit/698a2f8))



# [0.4.0](https://github.com/zakodium/adonis-apollo/compare/v0.3.0...v0.4.0) (2019-09-09)


### Bug Fixes

* use correct type ([0483586](https://github.com/zakodium/adonis-apollo/commit/0483586))


### Features

* add support for file uploads ([7ada3ac](https://github.com/zakodium/adonis-apollo/commit/7ada3ac))



# [0.3.0](https://github.com/zakodium/adonis-apollo/compare/v0.2.0...v0.3.0) (2019-09-05)


### Features

* pass Adonis context to graphql context function ([3c61076](https://github.com/zakodium/adonis-apollo/commit/3c61076))



# [0.2.0](https://github.com/zakodium/adonis-apollo/compare/v0.1.1...v0.2.0) (2019-08-30)


### Features

* allow to apolloServer options in config ([450861e](https://github.com/zakodium/adonis-apollo/commit/450861e))



## [0.1.1](https://github.com/zakodium/adonis-apollo/compare/v0.1.0...v0.1.1) (2019-08-30)


### Bug Fixes

* expose Apollo/Server instead of ApolloServer ([fea6a92](https://github.com/zakodium/adonis-apollo/commit/fea6a92))



# 0.1.0 (2019-08-30)


### Features

* implement initial version ([9bcb74c](https://github.com/zakodium/adonis-apollo/commit/9bcb74c))
