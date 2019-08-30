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
import ApolloConfig from '@ioc:Apollo/Config';

import { graphqlAdonis } from './graphqlAdonis';

export default class ApolloServer extends ApolloServerBase {
  private _path: string;

  public constructor(config: ApolloConfig) {
    const { path = '/graphql', resolvers, schemas, apolloServer } = config;
    const resolversPath = resolve(resolvers);
    const schemasPath = resolve(schemas);
    super({
      schema: makeExecutableSchema({
        typeDefs: mergeTypes(fileLoader(schemasPath, { recursive: true })),
        resolvers: mergeResolvers(fileLoader(resolversPath)),
      }),
      ...apolloServer,
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

  private getPlaygroundHandler() {
    return async (ctx: HttpContextContract) => {
      const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
        endpoint: this._path,
      };
      ctx.response.header('Content-Type', 'text/html');
      return renderPlaygroundPage(playgroundRenderPageOptions);
    };
  }

  private getGraphqlHandler() {
    return async (ctx: HttpContextContract) => {
      const options = await this.createGraphQLServerOptions(ctx);
      return graphqlAdonis(options, ctx);
    };
  }
}
