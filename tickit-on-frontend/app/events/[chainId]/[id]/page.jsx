// app/events/[chainId]/[id]/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { contractABI } from '@/lib/abi';
import { getContractAddress, chainMap } from '@/lib/chains';

const resolveIpfsUri = (ipfsUri) => {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) return null;
  const hash = ipfsUri.substring(7);
  return `https://ipfs.io/ipfs/${hash}`;
};

export default function EventDetailPage({ params }) {
  // 1. Get chainId and event id from the URL
  const { chainId: eventChainId, id: eventId } = params;
  
  const { address, chain: connectedChain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  // 2. Determine the correct contract address based on the URL's chainId
  const contractAddress = getContractAddress(Number(eventChainId));
  const targetChain = chainMap[Number(eventChainId)];

  const [quantity, setQuantity] = useState(1);
  const [eventMetadata, setEventMetadata] = useState(null);
  const { writeContractAsync, isPending, error: writeError } = useWriteContract();

  // 3. Read contract data using the specific chainId and address
  const { data: event, isLoading: isLoadingEvent } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getEvent',
    args: [BigInt(eventId)],
    chainId: Number(eventChainId), // Specify the chain to read from
  });

  const { data: currentPrice, isLoading: isLoadingPrice } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getCurrentTicketPrice',
    args: [BigInt(eventId)],
    chainId: Number(eventChainId),
  });

  useEffect(() => {
    if (event?.metadataURI) {
      const fetchMetadata = async () => {
        try {
          const response = await fetch(resolveIpfsUri(event.metadataURI));
          const data = await response.json();
          setEventMetadata(data);
        } catch (e) { console.error("Failed to fetch metadata", e); }
      };
      fetchMetadata();
    }
  }, [event]);

  const handleBuyTicket = async () => {
    if (!currentPrice || !address || !contractAddress) return;
    const totalCost = currentPrice * BigInt(quantity);
    
    try {
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: 'buyTicket',
        args: [BigInt(eventId), BigInt(quantity)],
        value: totalCost,
      });
      alert('Ticket purchased successfully!');
    } catch (err) {
      alert(`Purchase failed: ${err.shortMessage || err.message}`);
    }
  };

  if (isLoadingEvent) return <div className="text-center">Loading event details...</div>;
  if (!event || !targetChain) return <div className="text-center text-red-500">Event or network not found.</div>;
  
  const isCorrectChain = connectedChain?.id === targetChain.id;
  const imageUrl = eventMetadata ? resolveIpfsUri(eventMetadata.image) : null;
  const ticketsLeft = Number(event.totalTickets) - Number(event.ticketsSold);
  
  // 4. Render the Buy button or a "Switch Network" button
  const PurchaseButton = () => {
    if (!address) {
      return <button disabled className="w-full btn-primary">Connect Wallet to Buy</button>;
    }
    if (!isCorrectChain) {
      return (
        <button 
          onClick={() => switchChain({ chainId: targetChain.id })} 
          className="w-full btn-secondary"
        >
          Switch to {targetChain.name} to Buy
        </button>
      );
    }
    return (
      <button onClick={handleBuyTicket} disabled={isPending || ticketsLeft < 1} className="w-full btn-primary">
        {isPending ? "Purchasing..." : `Buy Ticket`}
      </button>
    );
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {imageUrl ? (
            <img src={imageUrl} alt={event.name} className="h-80 w-full object-cover bg-gray-700 rounded-lg mb-4"/>
          ) : (
            <div className="h-80 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
          )}
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <p className="text-gray-400 mt-2">{event.venue}</p>
          <div className="mt-2 text-sm text-yellow-300">This event is hosted on the {targetChain.name} network.</div>
          <p className="text-gray-300 mt-4">{event.description}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Purchase Ticket</h2>
              <div className="space-y-4">
                <p><strong>Current Price:</strong> {currentPrice ? `${formatEther(currentPrice)} ${targetChain.nativeCurrency.symbol}` : 'Loading...'}</p>
                <p><strong>Tickets Left:</strong> {ticketsLeft}</p>
                <div className="flex items-center gap-4">
                  <label>Quantity:</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" max={ticketsLeft} className="bg-gray-700 w-20 p-2 rounded-md text-center" />
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <PurchaseButton />
              {writeError && <p className="text-red-500 text-sm mt-2">{writeError.shortMessage}</p>}
            </div>
        </div>
      </div>
       <style jsx>{`
        .btn-primary { background-color: #2b6cb0; color: white; }
        .btn-secondary { background-color: #ca8a04; color: white; } /* Yellow for switch network */
        .btn-primary, .btn-secondary { font-bold; padding: 12px; border-radius: 8px; transition: background-color 0.2s; }
        .btn-primary:hover:not(:disabled) { background-color: #2c5282; }
        .btn-secondary:hover:not(:disabled) { background-color: #a16207; }
        :disabled { background-color: #1a202c !important; color: #718096 !important; cursor: not-allowed; }
      `}</style>
    </div>
  );
}