import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';

import { ApolloLink, createHttpLink } from '@apollo/client/core';



// const uploadLink = createUploadLink({
//   uri: 'http://localhost:8000/graphql',
// });

// const chatUploadLink = createUploadLink({
//   uri: 'http://localhost:8001/graphql',
// });


export const appClient = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
        endpoints: {
            chat: 'http://localhost:8008',
            app: 'http://localhost:8000',
        },
        createHttpLink: () => createHttpLink(),
      }),
  ]),
  cache: new InMemoryCache(),
 })

const ApolloAppProvider = ({ children }) => {
  return <ApolloProvider  client={appClient}>{children}</ApolloProvider >;
};
export default ApolloAppProvider;




