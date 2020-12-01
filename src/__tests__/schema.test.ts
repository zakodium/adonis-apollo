import { join } from 'path';

import { FakeLogger } from '@adonisjs/logger';

import { getTypeDefsAndResolvers, printWarnings } from '../schema';

describe('getTypeDefsAndResolvers', () => {
  const fixture = join(__dirname, '../../test-utils/fixtures/schema/test1');
  const result = getTypeDefsAndResolvers(
    [join(fixture, 'schemas')],
    [join(fixture, 'resolvers')],
  );
  it('should merge schemas', () => {
    // Query, Mutation
    expect(
      result.typeDefs.definitions.filter(
        (def) => def.kind === 'ObjectTypeDefinition',
      ),
    ).toHaveLength(2);

    // URL, Bad, OtherBad
    expect(
      result.typeDefs.definitions.filter(
        (def) => def.kind === 'ScalarTypeDefinition',
      ),
    ).toHaveLength(3);
  });

  it('should merge resolvers', () => {
    expect(Object.keys(result.resolvers)).toStrictEqual([
      'Query',
      'Mutation',
      'URL',
    ]);
  });

  it('should warn about missing resolvers', () => {
    expect(result.warnings.missingQuery).toStrictEqual(['queryB', 'queryC']);
    expect(result.warnings.missingMutation).toStrictEqual([
      'mutationB',
      'mutationC',
    ]);
    expect(result.warnings.missingScalars).toStrictEqual(['Bad', 'OtherBad']);
  });
});

describe('printWarnings', () => {
  it('should print warnings using the logger', () => {
    const logger = getFakeLogger();
    printWarnings(
      {
        missingMutation: ['A', 'B'],
        missingQuery: ['X', 'Y'],
        missingScalars: ['S', 'T'],
      },
      logger,
    );
    expect(logger.logs[0].msg).toBe(
      'GraphQL Query resolver missing for fields: X, Y',
    );
    expect(logger.logs[1].msg).toBe(
      'GraphQL Mutation resolver missing for fields: A, B',
    );
    expect(logger.logs[2].msg).toBe(
      'GraphQL scalar types defined in schema but not in resolvers: S, T',
    );
  });

  it('should print nothing if there are no warnings', () => {
    const logger = getFakeLogger();
    printWarnings(
      { missingMutation: [], missingQuery: [], missingScalars: [] },
      logger,
    );
    expect(logger.logs).toHaveLength(0);
  });
});

function getFakeLogger() {
  return new FakeLogger({ enabled: true, level: 'trace', name: 'fake-logger' });
}
