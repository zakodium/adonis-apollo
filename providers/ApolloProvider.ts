import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
  toApolloError,
} from 'apollo-server-core';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { ApolloConfig } from '@ioc:Zakodium/Apollo/Server';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  protected loading = false;
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Zakodium/Apollo/Server', () => {
      if (this.loading) {
        throw new Error(
          'ApolloProvider was called during its initialization. To use this provider in resolvers, use dynamic `import()`.',
        );
      }
      let apolloConfig = this.app.config.get('apollo', {}) as ApolloConfig;
      const appUrl = this.app.env.get('APP_URL') as string;
      if (!apolloConfig.appUrl && appUrl) {
        apolloConfig = {
          ...apolloConfig,
          appUrl,
        };
      }

      this.loading = true;
      return new ApolloServer(this.app, apolloConfig, this.app.logger);
    });

    this.app.container.singleton('Zakodium/Apollo/Errors', () => ({
      AuthenticationError,
      ForbiddenError,
      UserInputError,
      ApolloError,
      toApolloError,
    }));
  }

  public async boot(): Promise<void> {
    await this.app.container.resolveBinding('Zakodium/Apollo/Server').start();
  }

  public async shutdown(): Promise<void> {
    await this.app.container.resolveBinding('Zakodium/Apollo/Server').stop();
  }
}
