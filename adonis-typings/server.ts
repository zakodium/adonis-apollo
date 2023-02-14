declare module '@ioc:Zakodium/Apollo/Server' {
  import type {
    ApolloServerOptions,
    BaseContext,
    // @ts-expect-error Package is compatible with both ESM and CJS.
  } from '@apollo/server';
  import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';
  import type { FileUpload } from 'graphql-upload/Upload.js';
  import type { UploadOptions } from 'graphql-upload/processRequest.js';

  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import type {
    RouteHandler,
    RouteMiddlewareHandler,
  } from '@ioc:Adonis/Core/Route';

  export type Upload = Promise<FileUpload> | Array<Promise<FileUpload>>;

  class ApolloServer {
    public applyMiddleware(): void;
    public getGraphqlHandler(): RouteHandler;
    public getUploadsMiddleware(): RouteMiddlewareHandler;
    public start(): Promise<void>;
    public stop(): Promise<void>;
  }

  export type { ApolloServer };
  // @ts-expect-error Package is compatible with both ESM and CJS.
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
}
