# adonis-apollo

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

Apollo GraphQL server for AdonisJs.

## Installation

`$ npm i adonis-apollo`

- Add `'adonis-apollo'` to your providers in `start/app.ts`.
- Add `"adonis-apollo"` to the "types" array in `tsconfig.json`.
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

[npm-image]: https://img.shields.io/npm/v/adonis-apollo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/adonis-apollo
[download-image]: https://img.shields.io/npm/dm/adonis-apollo.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/adonis-apollo
