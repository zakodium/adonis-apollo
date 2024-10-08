import assert from 'node:assert';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';

import { ContainerBindings, IocContract } from '@ioc:Adonis/Core/Application';

type UnknownConstructor = new (...args: unknown[]) => unknown;

const antiClashSuffix = 'Resolvers';

export function loadResolvers(
  resolversPaths: string[],
  container: IocContract<ContainerBindings>,
) {
  const resolverModules = resolversPaths.flatMap((resolversPath) =>
    loadFilesSync(resolversPath, { recursive: false }),
  );
  const resolversPartials = resolverModules.map((resolverModule) =>
    makeResolversPartial(resolverModule, container),
  );

  return mergeResolvers(resolversPartials);
}

function makeResolversPartial(
  resolverModule: Record<string, unknown>,
  container: IocContract<ContainerBindings>,
) {
  return Object.fromEntries(
    Object.entries(resolverModule)
      .filter(
        ([, value]) =>
          (typeof value === 'object' && value !== null) ||
          typeof value === 'function',
      )
      .map(([key, value]) => {
        if (key.endsWith(antiClashSuffix) && key !== antiClashSuffix) {
          key = key.slice(0, -antiClashSuffix.length);
        }
        if (typeof value === 'object' && value !== null) {
          return [key, value];
        } else {
          assert(typeof value === 'function');
          return [
            key,
            mapResolverClass(value as UnknownConstructor, container),
          ];
        }
      }),
  );
}

function mapResolverClass(
  value: UnknownConstructor,
  container: IocContract<ContainerBindings>,
) {
  const instance = container.make(value);
  const ownProperties = Object.getOwnPropertyDescriptors(instance);
  const prototypeChainProperties: Record<string, PropertyDescriptor> = {};
  walkPrototypeChain(instance, prototypeChainProperties);
  return Object.fromEntries(
    Object.entries({ ...prototypeChainProperties, ...ownProperties })
      .filter(
        ([name, desc]) =>
          name !== 'constructor' && typeof desc.value === 'function',
      )
      .map(([name, desc]) => [name, desc.value.bind(instance)]),
  );
}

function walkPrototypeChain(
  instance: unknown,
  properties: Record<string, PropertyDescriptor>,
) {
  const proto = Object.getPrototypeOf(instance);
  if (proto !== null && proto !== Object.prototype) {
    // Use recursion so that the ancestor properties are added first and can
    // be overridden by the descendant properties.
    walkPrototypeChain(proto, properties);
    Object.assign(properties, Object.getOwnPropertyDescriptors(proto));
  }
}
