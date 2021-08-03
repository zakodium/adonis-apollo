import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

import { LoggerContract } from '@ioc:Adonis/Core/Logger';

import { scalarResolvers } from './scalarResolvers';

interface SchemaWarnings {
  missingQuery: string[];
  missingMutation: string[];
  missingScalars: string[];
}

export function getTypeDefsAndResolvers(
  schemasPaths: string[],
  resolversPaths: string[],
) {
  const typeDefs = mergeTypeDefs(
    schemasPaths.flatMap((schemasPath) => loadFilesSync(schemasPath)),
  );
  const resolvers = {
    ...mergeResolvers([
      ...resolversPaths.flatMap((resolversPath) =>
        loadFilesSync(resolversPath, { recursive: false }),
      ),
    ]),
  };

  const warnings: SchemaWarnings = {
    missingQuery: [],
    missingMutation: [],
    missingScalars: [],
  };

  for (const definition of typeDefs.definitions) {
    if (definition.kind === 'ScalarTypeDefinition') {
      const scalarName = definition.name.value;
      // Automatically add resolvers for known scalar types.
      if (scalarResolvers[scalarName] && !resolvers[scalarName]) {
        resolvers[scalarName] = scalarResolvers[scalarName];
      }

      // Warn about scalar types defined in schema for which we have no resolver.
      if (!resolvers[scalarName]) {
        warnings.missingScalars.push(scalarName);
      }
    } else if (definition.kind === 'ObjectTypeDefinition') {
      const objectName = definition.name.value;

      if (objectName === 'Query' && definition.fields) {
        // Warn about missing Query resolvers.
        const queryResolvers = resolvers.Query || {};
        for (const queryField of definition.fields) {
          const queryName = queryField.name.value;
          // @ts-expect-error Using index signature for validation.
          if (!queryResolvers[queryName]) {
            warnings.missingQuery.push(queryName);
          }
        }
      } else if (objectName === 'Mutation' && definition.fields) {
        // Warn about missing Mutation resolvers.
        const mutationResolvers = resolvers.Mutation || {};
        for (const mutationField of definition.fields) {
          const mutationName = mutationField.name.value;
          // @ts-expect-error Using index signature for validation.
          if (!mutationResolvers[mutationName]) {
            warnings.missingMutation.push(mutationName);
          }
        }
      }
    }
  }

  return {
    typeDefs,
    resolvers,
    warnings,
  };
}

export function printWarnings(
  warnings: SchemaWarnings,
  logger: LoggerContract,
): void {
  if (warnings.missingQuery.length > 0) {
    logger.error(
      `GraphQL Query resolver missing for fields: ${warnings.missingQuery.join(
        ', ',
      )}`,
    );
  }
  if (warnings.missingMutation.length > 0) {
    logger.error(
      `GraphQL Mutation resolver missing for fields: ${warnings.missingMutation.join(
        ', ',
      )}`,
    );
  }
  if (warnings.missingScalars.length > 0) {
    logger.error(
      `GraphQL scalar types defined in schema but not in resolvers: ${warnings.missingScalars.join(
        ', ',
      )}`,
    );
  }
}
