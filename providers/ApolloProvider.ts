// @ts-ignore
import { ServiceProvider } from '@adonisjs/fold';

import ApolloServer from '../src/ApolloServer';

class ApolloProvider extends ServiceProvider {
  private app: any;
  public register(): void {
    this.app.singleton('Apollo/Server', () => {
      const config = this.app.use('Adonis/Src/Config');
      return new ApolloServer(config.get('apollo', {}));
    });
  }
}

export = ApolloProvider;
