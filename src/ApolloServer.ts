import { resolve } from 'path';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  ApolloServerBase,
  GraphQLOptions,
  formatApolloErrors,
  processFileUploads,
} from 'apollo-server-core';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import {
  renderPlaygroundPage,
  RenderPageOptions as PlaygroundRenderPageOptions,
} from '@apollographql/graphql-playground-html';
import { ServerRegistration } from '@ioc:Apollo/Server';
import ApolloConfig, { ApolloBaseContext } from '@ioc:Apollo/Config';
import { EnvContract } from '@ioc:Adonis/Core/Env';

import { graphqlAdonis } from './graphqlAdonis';

function makeContextFunction(
  context?: (args: ApolloBaseContext) => any,
): (args: ApolloBaseContext) => any {
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

  protected supportsUploads(): boolean {
    return true;
  }

  public constructor(config: ApolloConfig, Env: EnvContract) {
    const {
      path = '/graphql',
      resolvers = 'app/Resolvers',
      schemas = 'app/Schemas',
      apolloServer = {},
      executableSchema = {},
    } = config;
    const nodeEnv = Env.get('NODE_ENV');
    const isProdOrTest = nodeEnv === 'production' || nodeEnv === 'test';
    const resolversPath = resolve(
      isProdOrTest ? resolvers : `build/${resolvers}`,
    );
    const schemasPath = resolve(isProdOrTest ? schemas : `build/${schemas}`);
    let { context, ...rest } = apolloServer;

    super({
      schema: makeExecutableSchema({
        ...executableSchema,
        typeDefs: mergeTypes(fileLoader(schemasPath, { recursive: true })),
        resolvers: mergeResolvers(fileLoader(resolversPath)),
      }),
      context: makeContextFunction(context),
      ...rest,
    });
    this.$path = path;
  }

  private async createGraphQLServerOptions(
    ctx: HttpContextContract,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ ctx });
  }

  public applyMiddleware({ Route }: ServerRegistration): void {
    Route.get(this.$path, this.getPlaygroundHandler());
    const postRoute = Route.post(this.$path, this.getGraphqlHandler());
    if (this.uploadsConfig) {
      postRoute.middleware(this.getUploadsMiddleware());
    }
  }

  public getPlaygroundHandler() {
    return async (ctx: HttpContextContract) => {
      const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
        endpoint: this.$path,
      };
      ctx.response.header('Content-Type', 'text/html');
      return renderPlaygroundPage(playgroundRenderPageOptions);
    };
  }

  public getGraphqlHandler() {
    return async (ctx: HttpContextContract) => {
      const options = await this.createGraphQLServerOptions(ctx);
      return graphqlAdonis(options, ctx);
    };
  }

  public getUploadsMiddleware() {
    return async (ctx: HttpContextContract, next: () => Promise<void>) => {
      if (ctx.request.is(['multipart/form-data'])) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const processed = await processFileUploads!(
            ctx.request.request,
            ctx.response.response,
            this.uploadsConfig,
          );
          ctx.request.setInitialBody(processed);
          return next();
        } catch (error) {
          if (error.status && error.expose) {
            ctx.response.status(error.status);
          }
          throw formatApolloErrors([error], {
            formatter: this.requestOptions.formatError,
            debug: this.requestOptions.debug,
          });
        }
      } else {
        return next();
      }
    };
  }
}
