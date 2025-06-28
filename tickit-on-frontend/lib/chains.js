// lib/chains.js
import { sepolia, polygonAmoy, avalancheFuji } from 'wagmi/chains';

// Contract addresses remain the same
export const contractAddresses = {
  [sepolia.id]: "0x92B016feC9cD863a27308a986062afD910Afe6cD",
  [polygonAmoy.id]: "0xeD78Af19170649FB4e1476DBB6FF1c5B1558c7F5",
  [avalancheFuji.id]: "0x5F19E8A07d4575F056CFDFb41D0d74C049E43149",
};

export const supportedChains = [sepolia, polygonAmoy, avalancheFuji];
export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;


export const chainDetails = {
    [sepolia.id]: {
        name: sepolia.name,
        requiredStake: "0.1",
        // The CCIP selector for this chain (from Chainlink docs)
        ccipChainSelector: "16015286601757825753", 
    },
    [polygonAmoy.id]: {
        name: polygonAmoy.name,
        requiredStake: "0.01",
        ccipChainSelector: "16281711391670634445",
    },
    [avalancheFuji.id]: {
        name: avalancheFuji.name,
        requiredStake: "0.01",
        ccipChainSelector: "14767482510784806043", 
    }
};

export const ccipRouterAddresses = {
    [sepolia.id]: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    [polygonAmoy.id]: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
    [avalancheFuji.id]: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
};


export const linkTokenAddresses = {
  [sepolia.id]: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  [polygonAmoy.id]: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
  [avalancheFuji.id]: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
};

// NEW: Create a map for easy lookup
export const chainMap = supportedChains.reduce((acc, chain) => {
    acc[chain.id] = chain;
    return acc;
}, {});


export const getContractAddress = (chainId) => {
    return contractAddresses[chainId];
};