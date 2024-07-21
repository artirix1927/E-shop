import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql', // Replace with your GraphQL API endpoint
  cache: new InMemoryCache(),
});

const ApolloAppProvider = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloAppProvider;