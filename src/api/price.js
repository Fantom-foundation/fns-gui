import { ethers, getNetworkId, getNetworkProviderUrl } from '@ensdomains/ui';
import getENS, { getRegistrar } from 'api/ens';

const ChainLinkABI = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'description',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
    name: 'getRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

function getContract(network) {
  return network === 4002
    ? '0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D'
    : '0xf4766552d15ae4d256ad41b6cf2933482b0680dc';
}

export default async function getEtherPrice() {
  try {
    const network = await getNetworkId();
    const networkProvider = getNetworkProviderUrl(`${network}`);
    const provider = new ethers.providers.JsonRpcProvider(networkProvider);

    const chainlinkContract = new ethers.Contract(
      getContract(network),
      ChainLinkABI,
      provider
    );

    let roundData = await chainlinkContract.latestRoundData();

    let price = roundData.answer.toNumber() / 100000000;

    return price;
  } catch (e) {
    console.log(e, 'Error getting price');
  }
}
