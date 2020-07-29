import { IocContract } from '@adonisjs/fold';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { ConfigContract } from '@ioc:Adonis/Core/Config';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  protected $container: IocContract;

  public constructor(container: IocContract) {
    this.$container = container;
  }

  public register(): void {
    this.$container.singleton('Apollo/Server', () => {
      const Application: ApplicationContract = this.$container.use(
        'Adonis/Core/Application',
      );
      const Config: ConfigContract = this.$container.use('Adonis/Core/Config');
      return new ApolloServer(Application.appRoot, Config.get('apollo', {}));
    });
  }
}
