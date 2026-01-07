import type { IocContract } from '@adonisjs/fold';
import type { ApolloServerOptions, BaseContext } from '@apollo/server';

import type {
  ApolloConfig,
  ApolloUserConfig,
} from '@ioc:Zakodium/Apollo/Server';

export default function createApolloConfig<ContextType extends BaseContext>(
  config: ApolloUserConfig<ContextType>,
  options: {
    ioc: IocContract;
    fallbackUrl?: string;
  },
): ApolloConfig<ContextType> {
  return {
    ...config,
    apolloServer: {
      ...config.apolloServer,
      formatError:
        typeof config.apolloServer?.formatError === 'string'
          ? makeFormatter(options.ioc, config.apolloServer.formatError)
          : config.apolloServer.formatError,
    },
  };
}

function makeFormatter(
  ioc: IocContract,
  formatterPath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ApolloServerOptions<any>['formatError'] {
  const formatter = ioc.make(formatterPath);
  return formatter.formatError.bind(formatter);
}
