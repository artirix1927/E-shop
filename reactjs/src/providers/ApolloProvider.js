import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const uploadLink = createUploadLink({
  uri: 'http://localhost:8000/graphql',
});

export const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

const ApolloAppProvider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloAppProvider;