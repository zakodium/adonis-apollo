// @ts-ignore
import { ServiceProvider } from '@adonisjs/fold';

import ApolloServer from '../src/ApolloServer';

class ApolloProvider extends ServiceProvider {
  private app: any;
  public register(): void {
    this.app.singleton('Apollo/Server', () => {
      const config = this.app.use('Adonis/Src/Config');
      const Env = this.app.use('Env');
      let apolloConfig = config.get('apollo', {});
      const appUrl = Env.get('APP_URL');
      if (!apolloConfig.prefix && appUrl) {
        apolloConfig = {
          ...apolloConfig,
          prefix: appUrl,
        };
      }
      return new ApolloServer(apolloConfig);
    });
  }
}

export = ApolloProvider;
