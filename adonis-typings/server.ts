declare module '@ioc:Zakodium/Apollo/Server' {
  import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
  import {
    ApolloServerBase,
    ApolloServerPluginLandingPageGraphQLPlaygroundOptions,
    Config as ApolloCoreConfig,
  } from 'apollo-server-core';
  import { FileUpload, UploadOptions } from 'graphql-upload';

  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import { RouteHandler, RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route';

  export type Upload = Promise<FileUpload> | Promise<FileUpload>[];

  class ApolloServer extends ApolloServerBase {
    public applyMiddleware(): void;
    public getGraphqlHandler(): RouteHandler;
    public getUploadsMiddleware(): RouteMiddlewareHandler;
  }

  export type { ApolloServer };

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
     * Additional config passed to the Apollo Server library.
     */
    apolloServer?: Omit<
      ApolloCoreConfig,
      'schema' | 'resolvers' | 'typeDefs' | 'context' | 'plugins'
    > & {
      context?: (arg: ApolloBaseContext) => ContextType;
    };

    /**
     * Whether file upload processing is enabled.
     * @default true
     */
    enableUploads?: boolean;

    /**
     * If file upload is enabled, options passed to `graphql-upload`.
     */
    uploadOptions?: UploadOptions;

    /**
     * Additional config passed to the `makeExecutableSchema` function from `@graphql-tools/schema`.
     */
    executableSchema?: Omit<
      IExecutableSchemaDefinition,
      'typeDefs' | 'resolvers'
    >;

    /**
     * Whether GraphQL Playground is enabled.
     * If this option is not `true`, the default landing page from Apollo will be rendered instead.
     * @default true if application is in dev mode.
     */
    enablePlayground?: boolean;

    /**
     * Additional options used to render the GraphQL Playground.
     */
    playgroundOptions?: Partial<ApolloServerPluginLandingPageGraphQLPlaygroundOptions>;
  }
}
