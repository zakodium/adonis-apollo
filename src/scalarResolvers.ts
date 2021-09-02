import { GraphQLScalarType } from 'graphql';
import { resolvers } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';

export const scalarResolvers: Record<string, GraphQLScalarType> = {
  Upload: GraphQLUpload,
  ...resolvers,
};
