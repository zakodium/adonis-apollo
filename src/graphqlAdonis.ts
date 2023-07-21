import type { IncomingHttpHeaders } from 'node:http';
import { Readable } from 'node:stream';

import { ApolloServer, type BaseContext, HeaderMap } from '@apollo/server';

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import type { ContextFn } from '@ioc:Zakodium/Apollo/Server';

export async function graphqlAdonis<
  ContextType extends BaseContext = BaseContext,
>(
  apolloServer: ApolloServer<ContextType>,
  contextFunction: ContextFn<ContextType>,
  ctx: HttpContextContract,
): Promise<void> {
  apolloServer.assertStarted('AdonisJS');

  const { body, headers, status } =
    await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: ctx.request.method(),
        headers: transformHeaders(ctx.request.headers()),
        body: ctx.request.body(),
        search: ctx.request.parsedUrl.search ?? '',
      },
      context() {
        return Promise.resolve(contextFunction({ ctx }));
      },
    });

  for (const [name, value] of headers) {
    ctx.response.header(name, value);
  }

  ctx.response.status(status ?? 200);

  if (body.kind === 'complete') {
    return ctx.response.send(body.string);
  } else {
    return ctx.response.stream(Readable.from(body.asyncIterator));
  }
}

function transformHeaders(headers: IncomingHttpHeaders): HeaderMap {
  const map = new HeaderMap();
  for (const [name, value] of Object.entries(headers)) {
    if (value) {
      map.set(name, Array.isArray(value) ? value.join(', ') : value);
    }
  }
  return map;
}
