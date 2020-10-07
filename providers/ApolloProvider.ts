import { IocContract } from '@adonisjs/fold';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { ConfigContract } from '@ioc:Adonis/Core/Config';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  public constructor(protected $container: IocContract) {}

  public register(): void {
    this.$container.singleton('Apollo/Server', () => {
      const Application: ApplicationContract = this.$container.use(
        'Adonis/Core/Application',
      );
      const Config: ConfigContract = this.$container.use('Adonis/Core/Config');
      const Logger: LoggerContract = this.$container.use('Adonis/Core/Logger');
      return new ApolloServer(Application, Config.get('apollo', {}), Logger);
    });
  }
}
