import { Ioc } from '@adonisjs/fold';

import { ApolloExceptionFormatter } from '@ioc:Zakodium/Apollo/Server';

import createApolloConfig from '../createApolloConfig';

const testIoC = new Ioc();

class Formatter implements ApolloExceptionFormatter {
  formatError() {
    return {
      message: 'error',
    };
  }
}
testIoC.singleton('App/Exceptions/GraphqlHandler', () => new Formatter());

describe('apollo config', () => {
  it('create apollo configuration, formatError is callback', () => {
    const config = createApolloConfig(
      {
        schemas: 'app/Schemas',
        resolvers: 'app/Resolvers',
        path: '/graphql',
        apolloServer: {
          introspection: true,
          formatError: () => ({ message: 'error' }),
        },
      },
      {
        ioc: testIoC,
        fallbackUrl: 'http://localhost:3333',
      },
    );
    expect(config).toEqual({
      schemas: 'app/Schemas',
      resolvers: 'app/Resolvers',
      path: '/graphql',
      apolloServer: {
        introspection: true,
        formatError: expect.any(Function),
      },
    });
  });

  it('create apollo configuration, formatError is an IoC dependency', () => {
    const config = createApolloConfig(
      {
        schemas: 'app/Schemas',
        resolvers: 'app/Resolvers',
        path: '/graphql',
        apolloServer: {
          introspection: true,
          formatError: 'App/Exceptions/GraphqlHandler',
        },
      },
      {
        ioc: testIoC,
        fallbackUrl: 'http://localhost:3333',
      },
    );
    expect(config).toEqual({
      schemas: 'app/Schemas',
      resolvers: 'app/Resolvers',
      path: '/graphql',
      apolloServer: {
        introspection: true,
        formatError: expect.any(Function),
      },
    });
    // @ts-expect-error We don't care about the arguments here.
    expect(config.apolloServer?.formatError()).toEqual({
      message: 'error',
    });
  });
});
