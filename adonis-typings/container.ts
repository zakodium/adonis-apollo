declare module '@ioc:Adonis/Core/Application' {
  import type * as Errors from '@ioc:Zakodium/Apollo/Errors';
  import type { ApolloServer } from '@ioc:Zakodium/Apollo/Server';

  export interface ContainerBindings {
    'Zakodium/Apollo/Errors': typeof Errors;
    'Zakodium/Apollo/Server': ApolloServer;
  }
}
