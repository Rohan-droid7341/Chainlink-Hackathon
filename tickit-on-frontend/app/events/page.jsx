// app/events/page.jsx
"use client";
import Link from 'next/link';
import { useReadContracts } from 'wagmi';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import { contractABI } from '@/app/lib/abi';
import { supportedChains, getContractAddress, chainMap } from '@/app/lib/chains';

// A new, smarter EventCard component
const EventCard = ({ event }) => {
  const hostChain = chainMap[event.hostChainId];

  return (
    // The link now includes the chainId to help the detail page
    <Link href={`/events/${event.hostChainId}/${event.eventId}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50 relative">
        <div className="absolute top-2 right-2 bg-gray-900/80 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <img src={hostChain?.iconUrl} alt={hostChain?.name} className="w-4 h-4 rounded-full" />
          <span>On {hostChain?.name}</span>
        </div>
        <div className="h-48 bg-gray-700 flex items-center justify-center text-gray-500">Event Image</div>
        <div className="p-4">
          <h3 className="text-xl font-bold truncate">{event.name}</h3>
          <p className="text-gray-400 text-sm h-10">{event.description.slice(0, 50)}...</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-blue-400 font-semibold">{formatEther(event.basePrice)} {hostChain?.nativeCurrency.symbol}</span>
            <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded">
              {Number(event.totalTickets) - Number(event.ticketsSold)} left
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function EventsPage() {
  // 1. Create a contract call configuration for each supported chain
  const contractsToQuery = supportedChains.map(chain => ({
    address: getContractAddress(chain.id),
    abi: contractABI,
    functionName: 'getActiveEvents',
    args: [0n, 50n], // Fetch up to 50 events per chain
    chainId: chain.id,
  }));

  // 2. Use the useReadContracts hook to fetch from all chains in parallel
  const { data: results, isPending, error } = useReadContracts({
    contracts: contractsToQuery,
  });

  // 3. Process the results into a single, combined array of events
  const allEvents = useMemo(() => {
    if (!results) return [];
    
    return results.flatMap((result, index) => {
      // Check if the query for this chain was successful
      if (result.status === 'success' && Array.isArray(result.result)) {
        const chainId = supportedChains[index].id;
        // Add the hostChainId to each event object for later use
        return result.result.map(event => ({ ...event, hostChainId: chainId }));
      }
      return []; // Return empty array for failed or pending queries
    }).sort((a, b) => Number(a.eventId) - Number(b.eventId)); // Sort events by ID
  }, [results]);

  if (isPending) return <div className="text-center">Fetching events from all networks...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching events. Please check the console.</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Unified Event Marketplace</h1>
      <p className="text-gray-400 mb-8 text-center">Showing active events from Sepolia, Polygon Amoy, and Avalanche Fuji.</p>
      {allEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allEvents.map(event => (
            <EventCard key={`${event.hostChainId}-${event.eventId}`} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-12">No active events found across any supported network.</p>
      )}
    </div>
  );
}