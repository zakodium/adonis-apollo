import { Ioc } from '@adonisjs/fold';

import createApolloConfig from '../createApolloConfig';

const testIoC = new Ioc();

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
});
