// lib/wagmi.js
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, avalanche } from 'wagmi/chains'; // Add chains you support

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, avalanche], // Add all chains your contract is deployed to
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
  },
});