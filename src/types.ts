  import { FileUpload } from 'graphql-upload';
import {Config as ApolloCoreConfig, PlaygroundRenderPageOptions} from 'apollo-server-core';
import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

  export type Upload = Promise<FileUpload> | Promise<FileUpload>[];

  export interface ApolloBaseContext {
    ctx: any;
  }

  export interface ApolloConfig {
    /**
     * Path to the directory containing resolvers
     * @default `'app/Resolvers'`
     */
    resolvers?: string;

    /**
     * Path to the directory containing schemas
     * @default `'app/Schemas'`
     */
    schemas?: string;

    /**
     * Path on which the GraphQL API and playground will be exposed.
     * @default `'/graphql'`
     */
    path?: string;

    /**
     * Additional config passed to the Apollo Server library.
     */
    apolloServer?: Omit<
      ApolloCoreConfig,
      'schema' | 'resolvers' | 'typeDefs' | 'context'
    > & {
      context?: (arg: any) => any;
    };

    /**
     * Additional config passed to the `makeExecutableSchema` function from `@graphql-tools/schema`.
     */
    executableSchema?: Omit<
      IExecutableSchemaDefinition,
      'typeDefs' | 'resolvers'
    >;

    playgroundSettings?: Partial<PlaygroundRenderPageOptions>
  }