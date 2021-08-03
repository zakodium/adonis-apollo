# adonis-apollo

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Apollo GraphQL server for AdonisJS.

| :warning: This module is unstable and in active development. Use at your own risk. |
| ---------------------------------------------------------------------------------- |

## Prerequisites

This provider requires Adonis v5 preview and won't work with Adonis v4.

## Installation

```console
npm i adonis-apollo
node ace invoke adonis-apollo
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
import ApolloServer from '@ioc:Apollo/Server';

ApolloServer.applyMiddleware({ Route });
```

## Configuration

TODO

### Scalars

All the resolvers from `graphql-scalars` are installed automatically.

To enable any of the scalar types documented in [`graphql-scalars@1.4.0`](https://github.com/Urigo/graphql-scalars/tree/v1.4.0),
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
[download-image]: https://img.shields.io/npm/dm/adonis-apollo.svg
[download-url]: https://www.npmjs.com/package/adonis-apollo
