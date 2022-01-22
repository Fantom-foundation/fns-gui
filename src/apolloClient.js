import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

import resolvers, { defaults } from './api/rootResolver';
import typeDefs from './api/schema';

let client;

const cache = new InMemoryCache({
  addTypename: true
});

const endpoints = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
  6: 'http://localhost:8000/subgraphs/name/graphprotocol/fns',
  250: process.env.REACT_APP_GRAPH_NODE_URI || '',
  4002: process.env.REACT_APP_GRAPH_NODE_URI_TEST || ''
};

function getGraphQLAPI(network) {
  if (endpoints[network]) {
    return endpoints[network];
  }

  return endpoints['6'];
}

const stateLink = withClientState({
  resolvers,
  cache,
  defaults,
  typeDefs
});

export async function setupClient(network) {
  const httpLink = new HttpLink({
    uri: getGraphQLAPI(network)
  });
  const option = {
    fetchOptions: {
      mode: 'no-cors'
    },
    cache,
    addTypename: true,
    link: ApolloLink.from([stateLink, httpLink], cache)
  };

  client = new ApolloClient(option);
  return client;
}

export default function getClient() {
  return client;
}
