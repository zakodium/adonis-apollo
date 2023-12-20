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

</h3>

> [!WARNING]
> This module is unstable and in active development. Use at your own risk.

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
}).middleware('auth');
```

### Schema

The GraphQL schema should be defined in `.graphql` files (by default located in `app/Schemas`).
The schema folders are scanned recursively.

```graphql
type Query {
  hello: String!
  rectangle: Rectangle!
}

type Rectangle {
  width: Int!
  height: Int!
  area: Int!
}
```

### Resolvers

Resolvers should be exported from `.ts` files (by default located in `app/Resolvers`).
Only the first level of resolver folders is scanned, so you can use sub-folders put additional code.

All resolvers are merged into a single object, so you can define them in multiple files.

There are two supported ways of defining resolvers:

#### Exporting classes

Multiple classes can be exported from a single file.
The name of the exported binding will be used as the name of the GraphQL type.

```ts
export class Query {
  hello() {
    return 'world';
  }

  rectangle() {
    return { width: 10, height: 20 };
  }
}

export class Rectangle {
  area(rectangle) {
    return rectangle.width * rectangle.height;
  }
}
```

It is also possible to add the suffix `Resolvers` to the exported name to avoid potential conflicts:

```ts
interface Rectangle {
  width: number;
  height: number;
}

export class RectangleResolvers {
  area(rectangle: Rectangle) {
    return rectangle.width * rectangle.height;
  }
}
```

#### Exporting a single object

When a single object is exported as default, it is assumed to be a map of resolvers.

```ts
interface Rectangle {
  width: number;
  height: number;
}

export default {
  Query: {
    hello: () => 'world',
    rectangle() {
      return { width: 10, height: 20 };
    },
  },
  Rectangle: {
    area: (rectangle: Rectangle) => rectangle.width * rectangle.height,
  },
};
```

### Troubleshooting

#### Error: Query root type must be provided

Apollo requires a query root type to be defined in your schema.
To fix this error, create a file `app/Schemas/SomeSchema.graphql` with at least
a `Query` type.

For example:

```graphql
type Query {
  hello: String!
}
```

#### BadRequestError: This operation has been blocked as a potential Cross-Site Request Forgery (CSRF)

This error may happen if you try to access the GraphQL endpoint from a browser.
Make sure `forceContentNegotiationTo` is not unconditionally set to `'application/json'` in `config/app.ts`.
You can either disable this option or set it to a function that ignores the GraphQL route.

## Configuration

### Landing page

To configure the default landing page, you can pass `apolloProductionLandingPageOptions`
or `apolloLocalLandingPageOptions` to the config. Another possibility is to
override the `plugins` config in `config/apollo.ts`.

The default configuration is:

```ts
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

const plugins = [
  Env.get('NODE_ENV') === 'production'
    ? ApolloServerPluginLandingPageProductionDefault({
        footer: false,
        ...apolloProductionLandingPageOptions,
      })
    : ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        ...apolloLocalLandingPageOptions,
      }),
];
```

See the [Apollo Graphql documentation](https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages/) to
learn how to customize or disable the landing page.

### Scalars

All the resolvers from `graphql-scalars` are installed automatically.

To enable any of the scalar types documented in [`graphql-scalars`](https://www.graphql-scalars.dev/docs/scalars/big-int/),
for example `DateTime`, just add a scalar line to your schema:

```graphql
scalar DateTime
```

### Uploads

To enable support for inline multipart/form-data uploads using [graphql-upload](https://github.com/jaydenseric/graphql-upload):

- Set `enableUploads: true` in `config/apollo.ts`.
- Update the config of the body parser in `config/bodyparser.ts` by adding your GraphQL route (by default: `/graphql`) to the `multipart.processManually` array.
- Add the Upload scalar to your schema: `scalar Upload`.
- Make sure your GraphQL upload client sends the `'Apollo-Require-Preflight'` header, otherwise Apollo will reject multipart requests
  to prevent [CSRF attacks](https://www.apollographql.com/docs/apollo-server/security/cors/#graphql-upload).

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
