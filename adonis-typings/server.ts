declare module '@ioc:Zakodium/Apollo/Server' {
  import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
  import {
    ApolloServerBase,
    Config as ApolloCoreConfig,
  } from 'apollo-server-core';
  import { ISettings as GraphqlPlaygroundSettings } from 'graphql-playground-html/dist/render-playground-page';
  import { FileUpload, UploadOptions } from 'graphql-upload';

  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import {
    RouterContract,
    RouteHandler,
    RouteMiddlewareHandler,
  } from '@ioc:Adonis/Core/Route';

  export type Upload = Promise<FileUpload> | Promise<FileUpload>[];

  export interface ServerRegistration {
    Route: RouterContract;
  }

  class ApolloServer extends ApolloServerBase {
    public applyMiddleware(config: ServerRegistration): void;
    public getGraphqlHandler(): RouteHandler;
    public getPlaygroundHandler(): RouteHandler;
    public getUploadsMiddleware(): RouteMiddlewareHandler;
  }

  const server: ApolloServer;
  export default server;

  export interface ApolloBaseContext {
    ctx: HttpContextContract;
  }

  export interface ApolloConfig<ContextType = unknown> {
    /**
     * Path to the directory containing resolvers
     * @default `'app/Resolvers'`
     */
    resolvers?: string | string[];

    /**
     * Path to the directory containing schemas
     * @default `'app/Schemas'`
     */
    schemas?: string | string[];

    /**
     * Path on which the GraphQL API and playground will be exposed.
     * @default `'/graphql'`
     */
    path?: string;

    /**
     * A prefix path or full URL used to construct the graphql endpoint
     * If APP_URL env variable is set, it will be used instead of this value.
     */
    appUrl?: string;

    /**
     * Options for GraphQL Upload
     *
     */
    uploads?: UploadOptions;

    /**
     * Additional config passed to the Apollo Server library.
     */
    apolloServer?: Omit<
      ApolloCoreConfig,
      'schema' | 'resolvers' | 'typeDefs' | 'context'
    > & {
      context?: (arg: ApolloBaseContext) => ContextType;
    };

    /**
     * Additional config passed to the `makeExecutableSchema` function from `@graphql-tools/schema`.
     */
    executableSchema?: Omit<
      IExecutableSchemaDefinition,
      'typeDefs' | 'resolvers'
    >;

    /**
     * Additional config passed to graphql-playground-html
     */
    playgroundSettings?: Partial<GraphqlPlaygroundSettings>;
  }
}
