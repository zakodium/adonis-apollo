import { resolve } from 'path';

import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerBase,
  GraphQLOptions,
  formatApolloErrors,
  createPlaygroundOptions,
} from 'apollo-server-core';
import {
  renderPlaygroundPage,
  RenderPageOptions,
} from 'graphql-playground-html';
import { processRequest } from 'graphql-upload';

import { graphqlAdonis } from './graphqlAdonis';
import { getTypeDefsAndResolvers } from './schema';
import { ApolloBaseContext, ApolloConfig } from './types';

function makeContextFunction(
  context?: (args: ApolloBaseContext) => unknown,
): (args: ApolloBaseContext) => unknown {
  if (typeof context === 'function') {
    return function ctxFn(args: ApolloBaseContext) {
      return context(args);
    };
  } else {
    return function ctxFn(args: ApolloBaseContext) {
      return args;
    };
  }
}

export default class ApolloServer extends ApolloServerBase {
  private $path: string;
  private $config: ApolloConfig;

  protected supportsUploads(): boolean {
    return true;
  }

  public constructor(config: ApolloConfig) {
    const {
      path = '/graphql',
      schemas: schemasPath = 'app/Schemas',
      resolvers: resolversPath = 'app/Resolvers',
      apolloServer = {},
      executableSchema = {},
    } = config;
    let { context, ...rest } = apolloServer;

    const { typeDefs, resolvers } = getTypeDefsAndResolvers(
      resolve(schemasPath),
      resolve(resolversPath),
    );

    super({
      schema: makeExecutableSchema({
        ...executableSchema,
        typeDefs,
        resolvers,
      }),
      context: makeContextFunction(context),
      ...rest,
    });
    this.$path = path;
    this.$config = config;
  }

  private async createGraphQLServerOptions(ctx: any): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ ctx });
  }

  public applyMiddleware({ Route }: any): void {
    Route.get(this.$path, this.getPlaygroundHandler());
    const postRoute = Route.post(this.$path, this.getGraphqlHandler());
    if (this.uploadsConfig) {
      postRoute.middleware(this.getUploadsMiddleware());
    }
  }

  public getPlaygroundHandler() {
    return async (ctx: any) => {
      const playgroundOptions = createPlaygroundOptions({
        endpoint: this.$path,
        version: '^1.7.0',
        settings: {
          'request.credentials': 'include',
          ...this.$config.playgroundSettings,
        },
      }) as RenderPageOptions;

      if (playgroundOptions === undefined) {
        throw new Error('unreachable');
      }
      ctx.response.header('Content-Type', 'text/html');
      return renderPlaygroundPage(playgroundOptions);
    };
  }

  public getGraphqlHandler() {
    return async (ctx: any) => {
      const options = await this.createGraphQLServerOptions(ctx);
      return graphqlAdonis(options, ctx);
    };
  }

  public getUploadsMiddleware() {
    return async (ctx: any, next: () => Promise<void>) => {
      if (ctx.request.is(['multipart/form-data'])) {
        try {
          const processed = await processRequest(
            ctx.req,
            ctx.res,
            this.uploadsConfig,
          );
          ctx.request.body = processed;
        } catch (error) {
          if (error.status && error.expose) {
            ctx.response.status(error.status);
          }
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw formatApolloErrors([error], {
            formatter: this.requestOptions.formatError,
            debug: this.requestOptions.debug,
          });
        }
      }
      return next();
    };
  }
}
