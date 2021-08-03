import { join } from 'path';

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

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import {
  ApolloConfig,
  ApolloBaseContext,
  ServerRegistration,
} from '@ioc:Zakodium/Apollo/Server';

import { graphqlAdonis } from './graphqlAdonis';
import { getTypeDefsAndResolvers, printWarnings } from './schema';

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
  private $endpoint: string;
  private $config: ApolloConfig;
  protected supportsUploads(): boolean {
    return true;
  }

  public constructor(
    application: ApplicationContract,
    config: ApolloConfig,
    logger: LoggerContract,
  ) {
    const {
      path = '/graphql',
      schemas: schemasPath = 'app/Schemas',
      resolvers: resolversPath = 'app/Resolvers',
      apolloServer = {},
      executableSchema = {},
    } = config;
    let { context, ...rest } = apolloServer;

    const schemasPaths: string[] = Array.isArray(schemasPath)
      ? schemasPath
      : [schemasPath];
    const resolversPaths: string[] = Array.isArray(resolversPath)
      ? resolversPath
      : [resolversPath];

    const { typeDefs, resolvers, warnings } = getTypeDefsAndResolvers(
      schemasPaths.map((schemaPath) => join(application.appRoot, schemaPath)),
      resolversPaths.map((resolverPath) =>
        join(application.appRoot, resolverPath),
      ),
    );

    if (application.inDev) {
      printWarnings(warnings, logger);
    }

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
    this.$endpoint = config.appUrl
      ? `${config.appUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
      : path;
  }

  private async createGraphQLServerOptions(
    ctx: HttpContextContract,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ ctx });
  }

  public applyMiddleware({ Route }: ServerRegistration): void {
    const playgroundPath = `${this.$path}/playground`;
    Route.get(playgroundPath, this.getPlaygroundHandler());

    Route.get(this.$path, this.getGraphqlHandler());
    const postRoute = Route.post(this.$path, this.getGraphqlHandler());

    if (this.uploadsConfig) {
      postRoute.middleware(this.getUploadsMiddleware());
    }
  }

  public getPlaygroundHandler() {
    return async (ctx: HttpContextContract) => {
      const playgroundOptions = createPlaygroundOptions({
        endpoint: this.$endpoint,
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
    return async (ctx: HttpContextContract) => {
      const options = await this.createGraphQLServerOptions(ctx);
      return graphqlAdonis(options, ctx);
    };
  }

  public getUploadsMiddleware() {
    return async (ctx: HttpContextContract, next: () => void) => {
      if (ctx.request.is(['multipart/form-data'])) {
        try {
          const processed = await processRequest(
            ctx.request.request,
            ctx.response.response,
            this.uploadsConfig,
          );
          ctx.request.setInitialBody(processed);
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
