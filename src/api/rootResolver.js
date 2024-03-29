import {
  getWeb3,
  getAccounts,
  getNetworkId,
  isReadOnly,
  emptyAddress
} from 'fns-ui';

import getFNS from 'api/fns';
import merge from 'lodash/merge';
import { isRunningAsSafeApp } from 'utils/safeApps';
import managerResolvers, {
  defaults as managerDefaults
} from './manager/resolvers';
import auctionRegistrarResolvers, {
  defaults as auctionRegistrarDefaults
} from './registrar/resolvers';
import subDomainRegistrarResolvers, {
  defaults as subDomainRegistrarDefaults
} from './subDomainRegistrar/resolvers';

const rootDefaults = {
  web3: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  },
  error: null,
  loggedIn: null,
  pendingTransactions: [],
  transactionHistory: []
};

const resolvers = {
  Web3: {
    accounts: () => {
      if (!isReadOnly()) {
        return getAccounts();
      } else {
        return emptyAddress;
      }
    },
    networkId: async () => {
      const networkId = await getNetworkId();
      return networkId;
    },
    network: async () => {
      const networkId = await getNetworkId();

      switch (networkId) {
        case 1:
          return 'main';
        case 2:
          return 'morden';
        case 3:
          return 'ropsten';
        case 4:
          return 'rinkeby';
        case 5:
          return 'goerli';
        case 42:
          return 'kovan';
        case 4002:
          return 'Fantom Testnet';
        case 250:
          return 'Fantom Mainnet';
        default:
          return 'private';
      }
    }
  },
  Query: {
    web3: async () => {
      try {
        return {
          ...(await getWeb3()),
          isReadOnly: isReadOnly(),
          isSafeApp: isRunningAsSafeApp(),
          __typename: 'Web3'
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    publicResolver: async () => {
      try {
        const fns = getFNS();
        const resolver = await fns.getAddress('resolver.ftm');
        return {
          address: resolver,
          __typename: 'Resolver'
        };
      } catch (e) {
        console.log('error getting public resolver', e);
      }
    }
  },

  Mutation: {
    setError: async (_, { message }, { cache }) => {
      const errorObj = {
        message,
        __typename: 'Error'
      };
      const data = {
        error: errorObj
      };
      cache.writeData({ data });
      return errorObj;
    }
  }
};

const defaults = merge(
  rootDefaults,
  managerDefaults,
  auctionRegistrarDefaults,
  subDomainRegistrarDefaults
);

export default merge(
  resolvers,
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
);

export { defaults };
