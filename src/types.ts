declare module '@ioc:Apollo/Server' {
  import { ApolloServerBase } from 'apollo-server-core';
  import { RouterContract, RouteHandler } from '@ioc:Adonis/Core/Route';
  import { MiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
  import { FileUpload } from 'graphql-upload';

  export type Upload = Promise<FileUpload> | Promise<FileUpload>[];

  export interface ServerRegistration {
    Route: RouterContract;
  }

  class ApolloServer extends ApolloServerBase {
    public applyMiddleware(config: ServerRegistration): void;
    public getGraphqlHandler(): RouteHandler;
    public getPlaygroundHandler(): RouteHandler;
    public getUploadsMiddleware(): MiddlewareHandler;
  }

  const server: ApolloServer;
  export default server;
}

declare module '@ioc:Apollo/Config' {
  import { Config as ApolloCoreConfig } from 'apollo-server-core';
  import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

  export interface ApolloBaseContext {
    ctx: HttpContextContract;
  }

  export interface ApolloConfig {
    /**
     * Path to the directory containing resolvers
     * @default `'app/Resolvers'`
     */
    resolvers?: string;

    /**
     * Path to the directory containing schemas
     * @default `'app/Schemas'`
     */
    schemas?: string;

    /**
     * Path on which the GraphQL API and playground will be exposed.
     * @default `'/graphql'`
     */
    path?: string;

    /**
     * Additional config passed to the Apollo Server library.
     */
    apolloServer?: Omit<
      ApolloCoreConfig,
      'schema' | 'resolvers' | 'typeDefs' | 'context'
    > & {
      context?: (arg: ApolloBaseContext) => any;
    };

    /**
     * Additional config passed to the `makeExecutableSchema` function from `@graphql-tools/schema`.
     */
    executableSchema?: Omit<
      IExecutableSchemaDefinition,
      'typeDefs' | 'resolvers'
    >;
  }
}
