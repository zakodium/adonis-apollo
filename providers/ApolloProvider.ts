import { ApplicationContract } from '@ioc:Adonis/Core/Application';

import ApolloServer from '../src/ApolloServer';
import createApolloConfig from '../src/createApolloConfig';

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
      const apolloConfig = createApolloConfig(
        this.app.config.get('apollo', {}),
        {
          ioc: this.app.container,
          fallbackUrl: this.app.env.get('APP_URL'),
        },
      );

      this.loading = true;

      return new ApolloServer(this.app, apolloConfig, this.app.logger);
    });
  }

  public async boot(): Promise<void> {
    await this.app.container.resolveBinding('Zakodium/Apollo/Server').start();
  }

  public async shutdown(): Promise<void> {
    await this.app.container.resolveBinding('Zakodium/Apollo/Server').stop();
  }
}
