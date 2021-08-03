declare module '@ioc:Adonis/Core/Application' {
  import * as Errors from '@ioc:Zakodium/Apollo/Errors';
  import * as Server from '@ioc:Zakodium/Apollo/Server';

  export interface ContainerBindings {
    'Zakodium/Apollo/Errors': typeof Errors;
    'Zakodium/Apollo/Server': typeof Server;
  }
}
