import { resolve } from 'path';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApolloServerBase, GraphQLOptions } from 'apollo-server-core';
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
  private _path: string;

  public constructor(config: ApolloConfig, Env: EnvContract) {
    const {
      path = '/graphql',
      resolvers = 'app/Resolvers',
      schemas = 'app/Schemas',
      apolloServer = {},
    } = config;
    const isProd = Env.get('NODE_ENV') === 'production';
    const resolversPath = resolve(isProd ? resolvers : `build/${resolvers}`);
    const schemasPath = resolve(isProd ? schemas : `build/${schemas}`);
    let { context, ...rest } = apolloServer;

    super({
      schema: makeExecutableSchema({
        typeDefs: mergeTypes(fileLoader(schemasPath, { recursive: true })),
        resolvers: mergeResolvers(fileLoader(resolversPath)),
      }),
      context: makeContextFunction(context),
      ...rest,
    });
    this._path = path;
  }

  private async createGraphQLServerOptions(
    ctx: HttpContextContract,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ ctx });
  }

  public applyMiddleware({ Route }: ServerRegistration): void {
    Route.get(this._path, this.getPlaygroundHandler());
    Route.post(this._path, this.getGraphqlHandler());
  }

  public getPlaygroundHandler() {
    return async (ctx: HttpContextContract) => {
      const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
        endpoint: this._path,
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
}
