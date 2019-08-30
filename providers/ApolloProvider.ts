import { IocContract } from '@adonisjs/fold';
import { ConfigContract } from '@ioc:Adonis/Core/Config';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  protected $container: IocContract;

  public constructor(container: IocContract) {
    this.$container = container;
  }

  public register(): void {
    this.$container.singleton('Apollo/Server', () => {
      const Config: ConfigContract = this.$container.use('Adonis/Core/Config');
      return new ApolloServer(Config.get('apollo', {}));
    });
  }

  public boot(): void {
    // All bindings are ready, feel free to use them
  }

  public shutdown(): void {
    // Cleanup, since app is going down
  }

  public ready(): void {
    // App is ready
  }
}
