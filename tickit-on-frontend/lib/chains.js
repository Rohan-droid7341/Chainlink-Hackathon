// lib/chains.js
import { sepolia, polygonAmoy, avalancheFuji } from 'wagmi/chains';

// Contract addresses remain the same
export const contractAddresses = {
  [sepolia.id]: "0xA3f283f74168a3E745BacFd7eE0487C88Ef266Cc",
  [polygonAmoy.id]: "0x0e935648703fd50B8357b3C73973F6070a3CF267",
  [avalancheFuji.id]: "0xA60aC24910836A213bbE0f7D59bf356C1Edf716F",
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