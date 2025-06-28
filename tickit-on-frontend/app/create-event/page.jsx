"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';


export default function CreateEventPage() {
  const { address, chainId } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // State for form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [metadataURI, setMetadataURI] = useState('');

  // State for calculated stake and form errors
  const [requiredStake, setRequiredStake] = useState(0n);
  const [formError, setFormError] = useState('');
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });


  // --- Stake Calculation Logic (mirrors Solidity) ---
  useEffect(() => {
    const calculateStake = () => {
      if (!basePrice || !totalTickets || Number(totalTickets) <= 0 || Number(basePrice) <= 0) {
        setRequiredStake(0n);
        return;
      }
      try {
        const basePriceWei = parseEther(basePrice);
        const ticketsBigInt = BigInt(totalTickets);

        // Solidity constants as BigInts for precision
        const PRICE_INCREMENT_BASIS_POINTS = 10n;
        const BASIS_POINTS = 10000n;
        const ORGANIZER_STAKE_PERCENT = 10n;

        // Replicate the calculateDynamicPrice function
        const calculateDynamicPrice = (price, sold) => {
          return price + (price * sold * PRICE_INCREMENT_BASIS_POINTS) / BASIS_POINTS;
        };

        // Replicate getRequiredStakeForEvent
        if (ticketsBigInt === 0n) {
            setRequiredStake(0n);
            return;
        }
        const firstPrice = calculateDynamicPrice(basePriceWei, 0n);
        const lastPrice = calculateDynamicPrice(basePriceWei, ticketsBigInt - 1n);
        const avgPrice = (firstPrice + lastPrice) / 2n;
        const totalRevenue = avgPrice * ticketsBigInt;
        const stake = (totalRevenue * ORGANIZER_STAKE_PERCENT) / 100n;

        setRequiredStake(stake);
      } catch (e) {
        // Handle cases where basePrice is not a valid number string for parseEther
        setRequiredStake(0n);
      }
    };
    
    calculateStake();
  }, [basePrice, totalTickets]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // --- Form Validation ---
    if (!name || !description || !venue || !eventDate || !totalTickets || !basePrice || !metadataURI) {
      setFormError('All fields are required.');
      return;
    }
    const eventTimestamp = Math.floor(new Date(eventDate).getTime() / 1000);
    if (eventTimestamp <= Math.floor(Date.now() / 1000)) {
        setFormError('Event date must be in the future.');
        return;
    }
    if (Number(totalTickets) <= 0 || Number(basePrice) <= 0) {
        setFormError('Tickets and Price must be positive numbers.');
        return;
    }

    const contractAddress = getContractAddress(chainId);
    if (!contractAddress) {
        setFormError(`Contract not deployed on this network (Chain ID: ${chainId}). Please switch networks.`);
        return;
    }

    try {
        const priceInWei = parseEther(basePrice);

        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'createEvent',
            args: [
                name,
                description,
                venue,
                BigInt(eventTimestamp),
                BigInt(totalTickets),
                priceInWei,
                metadataURI,
            ],
            value: requiredStake,
        });
    } catch (e) {
        console.error("Error preparing transaction:", e);
        setFormError("Failed to prepare transaction. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Create a New Event</h1>
      
      {!address ? (
         <div className="text-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            Please connect your wallet to create an event.
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
          
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
            <input type="text" id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date and Time</label>
            <input type="datetime-local" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700">Total Tickets</label>
                <input type="number" id="totalTickets" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" min="1" />
            </div>
            <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price (in ETH)</label>
                <input type="number" id="basePrice" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" min="0" step="any" />
            </div>
          </div>

          <div>
            <label htmlFor="metadataURI" className="block text-sm font-medium text-gray-700">Metadata URI</label>
            <input type="url" id="metadataURI" value={metadataURI} onChange={(e) => setMetadataURI(e.target.value)} placeholder="ipfs://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* Stake Information */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded-md">
            <p className="font-bold">Required Organizer Stake</p>
            <p className="text-lg">{formatEther(requiredStake)} ETH</p>
            <p className="text-xs mt-1">This stake is calculated based on potential revenue and is returned after the event concludes successfully.</p>
          </div>

          {/* Submit Button and Status */}
          <div>
            <button 
              type="submit" 
              disabled={isPending || requiredStake === 0n} 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? 'Confirming in wallet...' : 'Create Event'}
            </button>
          </div>

          {/* Error and Success Messages */}
          {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
          
          {isConfirming && <div className="text-center text-gray-600 mt-4">Waiting for transaction confirmation...</div>}
          
          {isConfirmed && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <p className="font-bold">Success!</p>
              <p>Your event has been created.</p>
              <a 
                href={`${chainId === 11155111 ? 'https://sepolia.etherscan.io/tx/' : 'https://etherscan.io/tx/'}${hash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-green-800 hover:underline"
              >
                View on Etherscan
              </a>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md break-words">
                <p className="font-bold">Transaction Error</p>
                <p className="text-sm">{(error).shortMessage || error.message}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}