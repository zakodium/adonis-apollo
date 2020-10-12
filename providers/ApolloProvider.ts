import { ApplicationContract } from '@ioc:Adonis/Core/Application';

import ApolloServer from '../src/ApolloServer';

export default class ApolloProvider {
  public static needsApplication = true;

  public constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Apollo/Server', () => {
      return new ApolloServer(
        this.app,
        this.app.config.get('apollo', {}),
        this.app.logger,
      );
    });
  }
}
