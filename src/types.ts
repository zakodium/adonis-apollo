declare module '@ioc:Apollo/Server' {
  import { RouterContract } from '@ioc:Adonis/Core/Route';
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import { RouteHandlerNode } from '@poppinss/http-server/build/src/contracts';

  export interface ServerRegistration {
    Route: RouterContract;
  }

  class ApolloServer {
    public applyMiddleware(config: ServerRegistration): void;
    public getGraphqlHandler(): RouteHandlerNode<HttpContextContract>;
    public getPlaygroundHandler(): RouteHandlerNode<HttpContextContract>;
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
    apolloServer?: Omit<
      ApolloCoreConfig,
      'schema' | 'resolvers' | 'typeDefs' | 'context'
    > & {
      context?: (arg: ApolloBaseContext) => any;
    };
  }

  export default ApolloConfig;
}
