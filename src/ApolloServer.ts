import path from 'node:path';

import {
  ApolloServer as ApolloServerBase,
  type BaseContext,
  // @ts-expect-error Package is compatible with both ESM and CJS.
} from '@apollo/server';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
  // @ts-expect-error Package is compatible with both ESM and CJS.
} from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import processRequest, {
  UploadOptions,
} from 'graphql-upload/processRequest.js';

import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import type { LoggerContract } from '@ioc:Adonis/Core/Logger';
import type { ApolloConfig, ContextFn } from '@ioc:Zakodium/Apollo/Server';

import { graphqlAdonis } from './graphqlAdonis';
import { getTypeDefsAndResolvers, printWarnings } from './schema';

const defaultContextFn: ContextFn = () => ({});

export default class ApolloServer<
  ContextType extends BaseContext = BaseContext,
> {
  private $apolloServer: ApolloServerBase<ContextType>;
  private $contextFunction: ContextFn<ContextType>;

  private $app: ApplicationContract;

  private $path: string;

  private $enableUploads: boolean;
  private $uploadOptions?: UploadOptions;

  public constructor(
    application: ApplicationContract,
    config: ApolloConfig<ContextType>,
    logger: LoggerContract,
  ) {
    const {
      path: graphQLPath = '/graphql',
      schemas: schemasPath = 'app/Schemas',
      resolvers: resolversPath = 'app/Resolvers',
      apolloServer = {},
      context = defaultContextFn as ContextFn<ContextType>,
      executableSchema = {},
      enableUploads = false,
      uploadOptions,
    } = config;

    this.$app = application;

    this.$path = graphQLPath;

    this.$enableUploads = enableUploads;
    this.$uploadOptions = uploadOptions;

    this.$contextFunction = context;

    const schemasPaths: string[] = Array.isArray(schemasPath)
      ? schemasPath
      : [schemasPath];
    const resolversPaths: string[] = Array.isArray(resolversPath)
      ? resolversPath
      : [resolversPath];

    const { typeDefs, resolvers, warnings } = getTypeDefsAndResolvers(
      schemasPaths.map((schemaPath) =>
        path.join(application.appRoot, schemaPath),
      ),
      resolversPaths.map((resolverPath) =>
        path.join(application.appRoot, resolverPath),
      ),
    );

    if (application.inDev) {
      printWarnings(warnings, logger);
    }

    this.$apolloServer = new ApolloServerBase<ContextType>({
      schema: makeExecutableSchema({
        ...executableSchema,
        typeDefs,
        resolvers,
      }),
      plugins: [
        this.$app.env.get('NODE_ENV') === 'production'
          ? // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageProductionDefault({
              footer: false,
            })
          : // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageLocalDefault({
              footer: false,
            }),
      ],
      ...apolloServer,
    });
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
    return async (ctx: HttpContextContract) => {
      return graphqlAdonis(this.$apolloServer, this.$contextFunction, ctx);
    };
  }

  public getUploadsMiddleware() {
    return async (ctx: HttpContextContract, next: () => void) => {
      if (ctx.request.is(['multipart/form-data'])) {
        const processed = await processRequest(
          ctx.request.request,
          ctx.response.response,
          this.$uploadOptions,
        );
        ctx.request.setInitialBody(processed);
      }
      return next();
    };
  }

  public start() {
    return this.$apolloServer.start();
  }

  public stop() {
    return this.$apolloServer.stop();
  }
}
