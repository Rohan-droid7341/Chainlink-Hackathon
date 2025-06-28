// app/events/[chainId]/[id]/page.jsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useSwitchChain, useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import { formatEther } from 'viem';
import { contractABI } from '@/lib/abi';
import { routerAbi } from '@/lib/routerAbi';
import { getContractAddress, chainMap, chainDetails, ccipRouterAddresses } from '@/lib/chains';

const resolveIpfsUri = (ipfsUri) => {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) return null;
  const hash = ipfsUri.substring(7);
  return `https://ipfs.io/ipfs/${hash}`;
};

export default function EventDetailPage({ params }) {
  const { chainId: eventChainId, id: eventId } = params;
  
  const { address, chain: connectedChain } = useAccount();
  const config = useConfig();
  const { switchChain } = useSwitchChain();
  
  const contractAddressOnTarget = getContractAddress(Number(eventChainId));
  const contractAddressOnConnected = connectedChain ? getContractAddress(connectedChain.id) : undefined;
  const targetChain = chainMap[Number(eventChainId)];
  const ccipRouterAddress = connectedChain ? ccipRouterAddresses[connectedChain.id] : undefined;

  const [quantity, setQuantity] = useState(1);
  const [eventMetadata, setEventMetadata] = useState(null);
  const [totalCost, setTotalCost] = useState(null); // Changed to null initially
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const { writeContractAsync, isPending, error: writeError } = useWriteContract();

  const { data: eventDataArray, isLoading: isLoadingEvent, error: readError } = useReadContract({
    address: contractAddressOnTarget,
    abi: contractABI,
    functionName: 'events',
    args: [BigInt(eventId)],
    chainId: Number(eventChainId),
  });

  const event = useMemo(() => {
    if (!eventDataArray || !Array.isArray(eventDataArray)) return null;
    return {
      eventId: eventDataArray[0], organizer: eventDataArray[1], name: eventDataArray[2],
      description: eventDataArray[3], venue: eventDataArray[4], eventDate: eventDataArray[5],
      totalTickets: eventDataArray[6], basePrice: eventDataArray[7], ticketsSold: eventDataArray[8],
      organizerStake: eventDataArray[9], isActive: eventDataArray[10], isCompleted: eventDataArray[11],
      metadataURI: eventDataArray[12],
    };
  }, [eventDataArray]);

  const calculateCosts = async () => {
    if (!connectedChain || !targetChain || !event || !ccipRouterAddress) {
        alert("Cannot calculate costs. Please ensure you are connected to a supported network.");
        return;
    };
    
    setIsLoadingCost(true);
    setTotalCost(null); // Reset previous calculation
    console.log("--- Starting Cost Calculation ---");
    try {
        let ticketPriceInEth = 0n;
        for (let i = 0; i < quantity; i++) {
            ticketPriceInEth += await readContract(config, {
                address: contractAddressOnTarget, abi: contractABI, functionName: 'calculateDynamicPrice',
                args: [event.basePrice, event.ticketsSold + BigInt(i)], chainId: Number(eventChainId)
            });
        }
        console.log(`Ticket Price (on Sepolia): ${formatEther(ticketPriceInEth)} ETH`);

        // For this demo, we make a CRITICAL simplification: assume 1 ETH = 1 AVAX.
        // A production app MUST use a Chainlink Price Feed here to get the correct conversion rate.
        const ticketPriceInAvax = ticketPriceInEth;
        console.log(`Assumed Ticket Price (on Fuji): ${formatEther(ticketPriceInAvax)} AVAX`);

        const destinationSelector = BigInt(chainDetails[targetChain.id].ccipChainSelector);
        const fakeMessage = { receiver: '0x0', data: '0x0', tokenAmounts: [], feeToken: '0x0000000000000000000000000000000000000000', extraArgs: '0x' };
        
        const feeInAvax = await readContract(config, {
            address: ccipRouterAddress, abi: routerAbi, functionName: 'getFee',
            args: [destinationSelector, fakeMessage]
        });
        console.log(`Calculated CCIP fee: ${formatEther(feeInAvax)} AVAX`);
        
        setTotalCost({ fee: feeInAvax, ticketPrice: ticketPriceInAvax });
        console.log("--- Cost Calculation Finished ---");

    } catch (e) {
        console.error("Error calculating costs:", e);
        alert("Could not calculate costs. Please refresh and try again.");
    } finally {
        setIsLoadingCost(false);
    }
  };

  useEffect(() => {
    if (event?.metadataURI) { /* Fetch metadata */ }
  }, [event]);

  const handleBuy = async () => {
    if (!address || !contractAddressOnConnected || !totalCost) {
        return alert("Costs not calculated yet. Please calculate first.");
    }

    const isSameChain = connectedChain.id === targetChain.id;
    const finalValue = totalCost.ticketPrice + totalCost.fee;
    
    try {
      await writeContractAsync({
        address: contractAddressOnConnected, abi: contractABI,
        functionName: isSameChain ? 'buyTickets' : 'buyTicketsCrossChain',
        args: isSameChain 
            ? [BigInt(eventId), BigInt(quantity)] 
            : [BigInt(chainDetails[targetChain.id].ccipChainSelector), contractAddressOnTarget, BigInt(eventId), BigInt(quantity)],
        value: finalValue,
      });
      alert('Purchase successful/initiated!');
    } catch (err) {
      alert(`Purchase failed: ${err.shortMessage || err.message}`);
    }
  };

  const PurchaseButton = () => {
    if (!address) return <button disabled className="w-full btn-primary">Connect Wallet to Buy</button>;
    if (!connectedChain || !contractAddressOnConnected) {
        return <button onClick={() => switchChain({ chainId: targetChain.id })} className="w-full btn-secondary">Switch to a Supported Network</button>;
    }

    const isSameChain = connectedChain.id === targetChain.id;
    
    // Cross-chain flow
    if (!isSameChain) {
        if (!totalCost) {
            return <button onClick={calculateCosts} disabled={isLoadingCost} className="w-full btn-accent">{isLoadingCost ? "Calculating..." : "1. Calculate Cross-Chain Cost"}</button>;
        }
        return (
            <div className="space-y-3">
                <div className="text-xs text-gray-400 p-3 border border-gray-700 rounded-md space-y-1">
                    <p>Ticket Price (Est.): {formatEther(totalCost.ticketPrice)} {connectedChain.nativeCurrency.symbol}</p>
                    <p>CCIP Fee: {formatEther(totalCost.fee)} {connectedChain.nativeCurrency.symbol}</p>
                    <p className="font-bold border-t border-gray-600 mt-1 pt-1 text-white">Total To Pay: {formatEther(totalCost.ticketPrice + totalCost.fee)} {connectedChain.nativeCurrency.symbol}</p>
                </div>
                <button onClick={handleBuy} disabled={isPending} className="w-full btn-accent">{isPending ? "Confirming..." : "2. Pay with AVAX"}</button>
            </div>
        );
    }
    
    // Same-chain flow
    return <button onClick={handleBuy} disabled={isPending} className="w-full btn-primary">Buy on {targetChain.name}</button>;
  };

  if (isLoadingEvent) return <div className="text-center text-lg text-gray-300">Loading Event...</div>;
  if (!event || !targetChain) return <div className="text-center text-red-500">Event not found.</div>;
  
  const ticketsLeft = Number(event.totalTickets) - Number(event.ticketsSold);

  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="mt-2 text-sm text-yellow-300">Hosted on {targetChain.name}</p>
        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Purchase Ticket</h2>
            <div className="space-y-4">
                <p><strong>Tickets Left:</strong> {ticketsLeft}</p>
                <div className="flex items-center gap-4">
                  <label>Quantity:</label>
                  <input type="number" value={quantity} onChange={(e) => { setQuantity(Number(e.target.value)); setTotalCost(null); }} min="1" max={ticketsLeft} className="bg-gray-700 w-20 p-2 rounded-md text-center" />
                </div>
            </div>
            <div className="mt-6 space-y-3">
              <PurchaseButton />
              {writeError && <p className="text-red-500 text-sm mt-2">{writeError.shortMessage}</p>}
            </div>
        </div>
        <style jsx>{`
        .btn-primary { background-color: #2b6cb0; color: white; }
        .btn-secondary { background-color: #ca8a04; color: white; }
        .btn-accent { background-color: #16a34a; color: white; }
        .btn-primary, .btn-secondary, .btn-accent { font-bold; padding: 12px; border-radius: 8px; transition: background-color 0.2s; }
        .btn-primary:hover:not(:disabled) { background-color: #2c5282; }
        .btn-secondary:hover:not(:disabled) { background-color: #a16207; }
        .btn-accent:hover:not(:disabled) { background-color: #15803d; }
        :disabled { background-color: #1a202c !important; color: #718096 !important; cursor: not-allowed; }
      `}</style>
    </div>
  );
}