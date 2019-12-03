# adonis-apollo

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Apollo GraphQL server for AdonisJs.

## Installation

```console
npm i adonis-apollo
node ace invoke adonis-apollo
```

- Add `"app/Schemas/*"` to the "copyToBuild" array in `.adonisrc.json`.

## Usage

Bind the apollo server to your AdonisJs application.  
In `start/routes.ts`:

```ts
import ApolloServer from '@ioc:ApolloServer';

ApolloServer.applyMiddleware({ Route });
```

## Configuration

TODO

### Uploads

To enable support for GraphQL uploads:

- Update the config of the bodyparser in `config/bodyparser.ts` by adding your GraphQL route (by default: `/graphql`) to the `multipart.processManually` array.
- Add the Upload scalar to your schema: `scalar Upload`.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/adonis-apollo.svg
[npm-url]: https://www.npmjs.com/package/adonis-apollo
[ci-image]: https://github.com/zakodium/adonis-datadrive/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/zakodium/adonis-datadrive/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/adonis-apollo.svg
[download-url]: https://www.npmjs.com/package/adonis-apollo
