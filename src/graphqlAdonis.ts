import {
  runHttpQuery,
  GraphQLOptions,
  HttpQueryError,
  convertNodeHttpToRequest,
} from 'apollo-server-core';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export async function graphqlAdonis(
  options: GraphQLOptions,
  ctx: HttpContextContract,
): Promise<string> {
  try {
    const { graphqlResponse, responseInit } = await runHttpQuery([ctx], {
      method: 'POST',
      options: options,
      query: ctx.request.all(),
      request: convertNodeHttpToRequest(ctx.request.request),
    });
    if (responseInit.headers) {
      const headerKeys = Object.keys(responseInit.headers);
      for (const key of headerKeys) {
        ctx.response.header(key, responseInit.headers[key]);
      }
    }
    return graphqlResponse;
  } catch (error) {
    if (error.name !== 'HttpQueryError') {
      throw error;
    }
    const err = error as HttpQueryError;
    if (err.headers) {
      const headerKeys = Object.keys(err.headers);
      for (const key of headerKeys) {
        ctx.response.header(key, err.headers[key]);
      }
    }
    ctx.response.status(err.statusCode);
    return err.message;
  }
}
