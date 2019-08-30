# adonis-apollo

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Apollo GraphQL server for AdonisJs.

## Installation

`$ npm i adonis-apollo`

- Add `'adonis-apollo'` to your providers in `start/app.ts`.
- Add `"adonis-apollo"` to the "types" array in `tsconfig.json`.

## Usage

Bind the apollo server to your AdonisJs application.  
In `start/routes.ts`:

```ts
import ApolloServer from '@ioc:ApolloServer';

ApolloServer.applyMiddleware({ Route });
```

## Configuration

TODO

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/adonis-apollo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/adonis-apollo
[travis-image]: https://img.shields.io/travis/com/zakodium/adonis-apollo/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/zakodium/adonis-apollo
[codecov-image]: https://img.shields.io/codecov/c/github/zakodium/adonis-apollo.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/zakodium/adonis-apollo
[download-image]: https://img.shields.io/npm/dm/adonis-apollo.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/adonis-apollo
