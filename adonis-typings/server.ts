declare module '@ioc:Zakodium/Apollo/Server' {
  import type { ApolloServerOptions, BaseContext } from '@apollo/server';
  import {
    ApolloServerPluginLandingPageLocalDefaultOptions,
    ApolloServerPluginLandingPageProductionDefaultOptions,
  } from '@apollo/server/plugin/landingPage/default';
  import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';
  import type { FileUpload } from 'graphql-upload/Upload.js';
  import type { UploadOptions } from 'graphql-upload/processRequest.js';

  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import type {
    RouteHandler,
    RouteMiddlewareHandler,
  } from '@ioc:Adonis/Core/Route';

  export type Upload = Promise<FileUpload>;

  export abstract class ApolloExceptionFormatter<
    ContextType extends BaseContext,
  > {
    public abstract formatError: ApolloServerOptions<ContextType>['formatError'];
  }

  class ApolloServer {
    public applyMiddleware(): void;
    public getGraphqlHandler(): RouteHandler;
    public getUploadsMiddleware(): RouteMiddlewareHandler;
    public start(): Promise<void>;
    public stop(): Promise<void>;
  }

  export type { ApolloServer };
  export type { BaseContext } from '@apollo/server';

  export interface ContextFnArgs {
    ctx: HttpContextContract;
  }

  export type ContextFn<ContextType extends BaseContext = BaseContext> = (
    args: ContextFnArgs,
  ) => ContextType | Promise<ContextType>;

  const server: ApolloServer;
  export default server;

  export interface ApolloConfig<ContextType extends BaseContext = BaseContext> {
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
      ApolloServerOptions<ContextType>,
      'schema' | 'resolvers' | 'typeDefs' | 'gateway'
    >;

    /**
     * Options passed to the Apollo Server production landing page plugin.
     */
    apolloProductionLandingPageOptions?: ApolloServerPluginLandingPageProductionDefaultOptions;

    /**
     * Options passed to the Apollo Server local landing page plugin.
     */
    apolloLocalLandingPageOptions?: ApolloServerPluginLandingPageLocalDefaultOptions;

    context?: ContextFn<ContextType>;

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
  }

  type ApolloServerUserOptions<ContextType extends BaseContext> = Omit<
    ApolloServerOptions<ContextType>,
    'formatError'
  > & {
    formatError?: ApolloServerOptions<ContextType>['formatError'] | string;
  };
  export type ApolloUserConfig<ContextType extends BaseContext> = Omit<
    ApolloConfig<ContextType>,
    'apolloServer'
  > & {
    apolloServer: ApolloServerUserOptions<ContextType>;
  };
}
