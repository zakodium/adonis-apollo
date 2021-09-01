import { join } from 'path';

import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerBase,
  GraphQLOptions,
  formatApolloErrors,
  PluginDefinition,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { processRequest, UploadOptions } from 'graphql-upload';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import { ApolloConfig, ApolloBaseContext } from '@ioc:Zakodium/Apollo/Server';

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
  private $app: ApplicationContract;

  private $path: string;

  private $enableUploads: boolean;
  private $uploadOptions?: UploadOptions;

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

    const enablePlayground = config.enablePlayground ?? application.inDev;
    const plugins: PluginDefinition[] = [];
    if (enablePlayground) {
      plugins.push(
        ApolloServerPluginLandingPageGraphQLPlayground(
          config.playgroundOptions,
        ),
      );
    }

    super({
      schema: makeExecutableSchema({
        ...executableSchema,
        typeDefs,
        resolvers,
      }),
      context: makeContextFunction(context),
      plugins,
      ...rest,
    });

    this.$app = application;

    this.$path = path;

    this.$enableUploads = config.enableUploads ?? true;
    this.$uploadOptions = config.uploadOptions;
  }

  private async createGraphQLServerOptions(
    ctx: HttpContextContract,
  ): Promise<GraphQLOptions> {
    return super.graphQLServerOptions({ ctx });
  }

  public applyMiddleware(): void {
    const Route = this.$app.container.resolveBinding('Adonis/Core/Route');
    Route.get(this.$path, this.getGraphqlHandler());
    const postRoute = Route.post(this.$path, this.getGraphqlHandler());
    if (this.$enableUploads) {
      postRoute.middleware(this.getUploadsMiddleware());
    }
  }

  public getGraphqlHandler() {
    const landingPage = this.getLandingPage();

    return async (ctx: HttpContextContract) => {
      let body: Record<string, unknown>;
      if (ctx.request.method() === 'GET') {
        body = ctx.request.qs();
        // We cannot use ctx.request.accepts because the Adonis application may
        // be configured to spoof the Accept header.
        // Instead, consider that if the request doesn't have a "query" parameter,
        // it is a direct request, and display the landing page.
        if (landingPage && !body.query) {
          ctx.response.header('Content-Type', 'text/html');
          return landingPage.html;
        }
      } else {
        body = ctx.request.body();
      }

      const options = await this.createGraphQLServerOptions(ctx);
      return graphqlAdonis(options, ctx, body);
    };
  }

  public getUploadsMiddleware() {
    return async (ctx: HttpContextContract, next: () => void) => {
      if (ctx.request.is(['multipart/form-data'])) {
        try {
          const processed = await processRequest(
            ctx.request.request,
            ctx.response.response,
            this.$uploadOptions,
          );
          ctx.request.setInitialBody(processed);
        } catch (error: any) {
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
