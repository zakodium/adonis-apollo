import { join } from 'path';

import {
  renderPlaygroundPage,
  RenderPageOptions as PlaygroundRenderPageOptions,
} from '@apollographql/graphql-playground-html';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApolloConfig, ApolloBaseContext } from '@ioc:Apollo/Config';
import { ServerRegistration } from '@ioc:Apollo/Server';
import {
  ApolloServerBase,
  GraphQLOptions,
  formatApolloErrors,
  processFileUploads,
} from 'apollo-server-core';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

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

  public constructor(appRoot: string, config: ApolloConfig) {
    const {
      path = '/graphql',
      resolvers = 'app/Resolvers',
      schemas = 'app/Schemas',
      apolloServer = {},
      executableSchema = {},
    } = config;
    const resolversPath = join(appRoot, resolvers);
    const schemasPath = join(appRoot, schemas);
    let { context, ...rest } = apolloServer;

    super({
      schema: makeExecutableSchema({
        ...executableSchema,
        typeDefs: mergeTypes(fileLoader(schemasPath, { recursive: true })),
        resolvers: mergeResolvers(fileLoader<any>(resolversPath)),
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
