# adonis-apollo

Apollo GraphQL server for AdonisJS 5.

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

| :warning: This module is unstable and in active development. Use at your own risk. |
| ---------------------------------------------------------------------------------- |

</h3>

## Prerequisites

This provider requires Adonis v5 and won't work with AdonisJS v4.

## Installation

```console
npm i adonis-apollo
node ace configure adonis-apollo
```

Then add the following to the `"metaFiles"` array in `.adonisrc.json`:

```json
{
  "pattern": "app/Schemas/*",
  "reloadServer": true
}
```

## Usage

Bind the apollo server to your AdonisJs application.  
In `start/routes.ts`:

```ts
import ApolloServer from '@ioc:Zakodium/Apollo/Server';

ApolloServer.applyMiddleware();

// You can also call `applyMiddleware` inside a route group:
Route.group(() => {
  ApolloServer.applyMiddleware();
}).middleware('someMiddleware');
```

## Configuration

TODO

### Scalars

All the resolvers from `graphql-scalars` are installed automatically.

To enable any of the scalar types documented in [`graphql-scalars`](https://www.graphql-scalars.dev/docs/scalars/big-int/),
for example `DateTime`, just add a scalar line to your schema:

```graphql
scalar DateTime
```

### Uploads

To enable support for GraphQL uploads:

- Update the config of the bodyparser in `config/bodyparser.ts` by adding your GraphQL route (by default: `/graphql`) to the `multipart.processManually` array.
- Add the Upload scalar to your schema: `scalar Upload`.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/adonis-apollo.svg
[npm-url]: https://www.npmjs.com/package/adonis-apollo
[ci-image]: https://github.com/zakodium/adonis-apollo/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/zakodium/adonis-apollo/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/zakodium/adonis-apollo.svg
[codecov-url]: https://codecov.io/gh/zakodium/adonis-apollo
[download-image]: https://img.shields.io/npm/dm/adonis-apollo.svg
[download-url]: https://www.npmjs.com/package/adonis-apollo
