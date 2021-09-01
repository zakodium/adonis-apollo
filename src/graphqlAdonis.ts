import {
  GraphQLOptions,
  runHttpQuery,
  convertNodeHttpToRequest,
  HttpQueryError,
} from 'apollo-server-core';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export async function graphqlAdonis(
  options: GraphQLOptions,
  ctx: HttpContextContract,
  body: Record<string, unknown>,
): Promise<void> {
  try {
    const { graphqlResponse, responseInit } = await runHttpQuery([ctx], {
      method: 'POST',
      options,
      query: body,
      request: convertNodeHttpToRequest(ctx.request.request),
    });
    if (responseInit.headers) {
      for (const [name, value] of Object.entries(responseInit.headers)) {
        ctx.response.header(name, value);
      }
    }
    ctx.response.status(responseInit.status || 200);
    return ctx.response.send(graphqlResponse);
  } catch (error) {
    // TODO: use isHttpQueryError once available.
    if (!(error instanceof HttpQueryError)) {
      throw error;
    }
    if (error.headers) {
      for (const [header, value] of Object.entries(error.headers)) {
        ctx.response.header(header, value);
      }
    }
    ctx.response.status(error.statusCode);
    return ctx.response.send(error.message);
  }
}
