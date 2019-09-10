declare module '@ioc:Apollo/Server' {
  import { Readable } from 'stream';
  import { RouterContract, RouteHandlerNode } from '@ioc:Adonis/Core/Route';
  import { MiddlewareNode } from '@ioc:Adonis/Core/Middleware';
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

  export interface IUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Readable;
  }
  export type Upload = Promise<IUpload> | Promise<IUpload>[];

  export interface ServerRegistration {
    Route: RouterContract;
  }

  class ApolloServer {
    public applyMiddleware(config: ServerRegistration): void;
    public getGraphqlHandler(): RouteHandlerNode;
    public getPlaygroundHandler(): RouteHandlerNode;
    public getUploadsMiddleware(): MiddlewareNode;
  }

  const server: ApolloServer;
  export default server;
}

declare module '@ioc:Apollo/Config' {
  import { Config as ApolloCoreConfig } from 'apollo-server-core';
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

  export interface ApolloBaseContext {
    ctx: HttpContextContract;
  }

  interface ApolloConfig {
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
  }

  export default ApolloConfig;
}
