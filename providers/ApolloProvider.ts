import { ApplicationContract } from '@ioc:Adonis/Core/Application';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  public static needsApplication = true;

  public constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Apollo/Server', () => {
      let apolloConfig = this.app.config.get('apollo', {});
      const appUrl = this.app.env.get('APP_URL') as string;
      if (!apolloConfig.prefix && appUrl) {
        apolloConfig = {
          ...apolloConfig,
          prefix: appUrl,
        };
      }

      return new ApolloServer(this.app, apolloConfig, this.app.logger);
    });
  }
}
