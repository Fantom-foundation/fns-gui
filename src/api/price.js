import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui';
import getENS, { getRegistrar } from 'api/ens';

import ChainLinkABI from './ChainLink.json';

async function getContract(network) {
  const contracts = {
    4200: '0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D'
  };

  if (contracts[network]) {
    return contracts[network];
  }

  //return mainnet otherwise
  return '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc';
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId();
    const networkProvider = getNetworkProviderUrl(`${network}`);
    const provider = new ethers.providers.JsonRpcProvider(networkProvider);

    const chainlinkContract = new ethers.Contract(
      await getContract(network),
      ChainLinkABI,
      provider
    );
    const price =
      (await chainlinkContract.latestAnswer()).toNumber() / 100000000;

    console.log('Price: ', price);

    return price;
  } catch (e) {
    console.log(e, 'Error getting price');
  }
}
