// app/profile/page.jsx (FULL UPDATED CODE)
"use client";
import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi';
import { contractABI } from '@/lib/abi';
import { getContractAddress } from '@/lib/chains';
import { formatEther } from 'viem';

const TicketCard = ({ ticketId }) => {
  const { chain } = useAccount();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;
  
  const [listingPrice, setListingPrice] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();
  
  // Read main ticket data
  const { data: ticket, isLoading: isLoadingTicket } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTicket',
    args: [ticketId],
    enabled: !!contractAddress,
  });

  // Read the resale listing if it exists
  const { data: resaleId } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'ticketToResaleId',
    args: [ticketId],
    enabled: !!contractAddress
  });

  const handleListForResale = async () => {
    if (!contractAddress || !listingPrice) return alert("Please set a listing price.");
    try {
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: 'listTicketForResale',
        args: [ticketId, parseEther(listingPrice)]
      });
      alert('Ticket listed for resale!');
    } catch(e) {
      alert(`Failed to list: ${e.shortMessage}`);
    }
  };

  if (isLoadingTicket) return <div className="bg-gray-800 p-4 rounded-lg animate-pulse h-28"></div>;
  if (!ticket) return null;
  
  const isListed = resaleId && Number(resaleId) > 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="font-bold">Ticket #{String(ticket.ticketId)}</h3>
        <p className="text-sm text-gray-400">For Event ID: {String(ticket.eventId)}</p>
        <p className="text-sm text-gray-400">You Paid: {formatEther(ticket.purchasePrice)} {chain.nativeCurrency.symbol}</p>
      </div>
      {isListed ? (
          <div className="text-center bg-green-900/50 text-green-300 px-4 py-2 rounded-lg">
            Listed for Sale
          </div>
      ) : (
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
                type="text" 
                placeholder={`Price in ${chain.nativeCurrency.symbol}`} 
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                className="input-field w-36"
            />
            <button onClick={handleListForResale} disabled={isPending || ticket.isUsed} className="btn-secondary whitespace-nowrap">
                {isPending ? "Listing..." : "List for Sale"}
            </button>
        </div>
      )}
    </div>
  );
};


export default function ProfilePage() {
  const { address, chain, isConnected } = useAccount();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;

  const { data: userTicketIds, isLoading: isLoadingTickets } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getUserTickets',
    args: [address],
    enabled: !!(isConnected && contractAddress),
    watch: true,
  });

  if (!isConnected) return <div className="text-center">Please connect your wallet to view your profile.</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>
      <h2 className="text-2xl font-semibold mb-4">My Tickets on {chain?.name ?? '...'}</h2>
      {isLoadingTickets && <p>Loading your tickets...</p>}
      {!contractAddress && chain && <p className="text-yellow-400">This network is not supported for ticketing.</p>}
      
      {contractAddress && userTicketIds && userTicketIds.length > 0 ? (
        <div className="space-y-4">
          {userTicketIds.map(ticketId => (
            <TicketCard key={String(ticketId)} ticketId={ticketId} />
          ))}
        </div>
      ) : (
        contractAddress && !isLoadingTickets && <p className="text-gray-500">You don't own any tickets on this network.</p>
      )}
      
      <style jsx>{`
        .input-field { background-color: #2d3748; border: 1px solid #4a5568; color: white; padding: 8px 12px; border-radius: 8px; }
        .btn-secondary { background-color: #4a5568; color: white; font-bold; padding: 8px 16px; border-radius: 8px; transition: background-color 0.2s; }
        .btn-secondary:hover:not(:disabled) { background-color: #2d3748; }
        .btn-secondary:disabled { background-color: #1a202c; color: #718096; cursor: not-allowed; }
      `}</style>
    </div>
  );
}