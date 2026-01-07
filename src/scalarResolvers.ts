import type { GraphQLScalarType } from 'graphql';
import { resolvers } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

export const scalarResolvers: Record<string, GraphQLScalarType> = {
  Upload: GraphQLUpload,
  ...resolvers,
};
