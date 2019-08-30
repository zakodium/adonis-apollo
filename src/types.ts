declare module '@ioc:Apollo/Server' {
  import { RouterContract } from '@ioc:Adonis/Core/Route';

  export interface ServerRegistration {
    Route: RouterContract;
  }

  class ApolloServer {
    public applyMiddleware(config: ServerRegistration): void;
  }

  const server: ApolloServer;
  export default server;
}

declare module '@ioc:Apollo/Config' {
  import { Config as ApolloCoreConfig } from 'apollo-server-core';

  interface ApolloConfig {
    resolvers: string;
    schemas: string;
    /**
     * Path on which the GraphQL API and playground will be exposed.
     * @default `'/graphql'`
     */
    path?: string;
    apolloServer?: Omit<ApolloCoreConfig, 'schema' | 'resolvers' | 'typeDefs'>;
  }

  // eslint-disable-next-line no-undef
  export default ApolloConfig;
}
