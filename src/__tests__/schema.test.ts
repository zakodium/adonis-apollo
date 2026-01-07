import path from 'node:path';

import { Ioc } from '@adonisjs/fold';
import { FakeLogger } from '@adonisjs/logger';
import type { IFieldResolver } from '@graphql-tools/utils';
import type { GraphQLResolveInfo } from 'graphql';
import { Kind } from 'graphql';

import { getTypeDefsAndResolvers, printWarnings } from '../schema';

const testIoC = new Ioc();

describe('getTypeDefsAndResolvers', () => {
  const fixture = path.join(
    __dirname,
    '../../test-utils/fixtures/schema/test1',
  );
  const { typeDefs, resolvers, warnings } = getTypeDefsAndResolvers(
    [path.join(fixture, 'schemas')],
    [path.join(fixture, 'resolvers')],
    testIoC,
  );
  it('should merge schemas', () => {
    // Query, Mutation
    expect(
      typeDefs.definitions.filter(
        (def) => def.kind === Kind.OBJECT_TYPE_DEFINITION,
      ),
    ).toHaveLength(3);

    // URL, Bad, OtherBad
    expect(
      typeDefs.definitions.filter(
        (def) => def.kind === Kind.SCALAR_TYPE_DEFINITION,
      ),
    ).toHaveLength(3);
  });

  it('should merge resolvers', () => {
    expect(Object.keys(resolvers)).toStrictEqual([
      'Query',
      'Mutation',
      'D',
      'URL',
    ]);
    expect(Object.keys(resolvers.Query)).toStrictEqual(['queryA', 'queryD']);
    expect(Object.keys(resolvers.Mutation)).toStrictEqual(['mutationA']);
  });

  it('should walk the class prototype chain and support class fields', () => {
    const DResolvers = resolvers.D as Record<
      string,
      IFieldResolver<unknown, unknown>
    >;

    expect(Object.keys(DResolvers)).toStrictEqual([
      'value',
      'parentOverride',
      'grandParentValue',
      'parentValue',
      'valueField',
      'parentOverrideField',
      'grandParentValueField',
      'parentValueField',
    ]);

    function callResolver(resolver: string) {
      return DResolvers[resolver](null, {}, null, {} as GraphQLResolveInfo);
    }

    for (const [resolver, expected] of [
      ['value', 'testGrandParent-testParent-test'],
      ['parentOverride', 'testParent'],
      ['grandParentValue', 'testGrandParent'],
      ['parentValue', 'testParent'],
      ['valueField', 'testGrandParent-testParent-test'],
      ['parentOverrideField', 'testParent'],
      ['grandParentValueField', 'testGrandParent'],
      ['parentValueField', 'testParent'],
    ]) {
      expect(callResolver(resolver)).toBe(expected);
    }
  });

  it('should warn about missing resolvers', () => {
    expect(warnings.missingQuery).toStrictEqual(['queryB', 'queryC']);
    expect(warnings.missingMutation).toStrictEqual(['mutationB', 'mutationC']);
    expect(warnings.missingScalars).toStrictEqual(['Bad', 'OtherBad']);
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
