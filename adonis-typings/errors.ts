declare module '@ioc:Zakodium/Apollo/Errors' {
  export {
    AuthenticationError,
    ForbiddenError,
    UserInputError,
    ApolloError,
    toApolloError,
  } from 'apollo-server-core';
}
