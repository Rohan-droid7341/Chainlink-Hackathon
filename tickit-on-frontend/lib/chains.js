// lib/chains.js
import { sepolia, polygonAmoy, avalancheFuji } from 'wagmi/chains';

// Contract addresses remain the same
export const contractAddresses = {
  [sepolia.id]: "0x6ea14c26Ca3241Dd1d47B1F09C3E68867a2CbdF2",
  [polygonAmoy.id]: "0x2624B928030f0Be53b68325272cB24a9562B01B6",
  [avalancheFuji.id]: "0x7B13742e672d18A6a187Ec36E27d793007Dac727",
};

export const supportedChains = [sepolia, polygonAmoy, avalancheFuji];
export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// NEW: Create a map for easy lookup
export const chainMap = supportedChains.reduce((acc, chain) => {
    acc[chain.id] = chain;
    return acc;
}, {});


export const getContractAddress = (chainId) => {
    return contractAddresses[chainId];
};