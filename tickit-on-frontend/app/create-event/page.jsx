// app/create-event/page.jsx (FINAL, ROBUST VERSION)
"use client";
import { useState, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { contractABI } from '@/lib/abi';
import { getContractAddress } from '@/lib/chains';

export default function CreateEventPage() {
  const { chain } = useAccount();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;

  const [formData, setFormData] = useState({
    name: '', description: '', venue: '', eventDate: '',
    totalTickets: '', basePrice: '', image: null,
  });
  const [metadataURI, setMetadataURI] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { writeContractAsync, isPending: isConfirming, error } = useWriteContract();

  const stakeHookArgs = useMemo(() => {
    try {
      if (formData.basePrice && formData.totalTickets && parseFloat(formData.basePrice) > 0 && parseInt(formData.totalTickets, 10) > 0) {
        return [parseEther(formData.basePrice), BigInt(formData.totalTickets)];
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [formData.basePrice, formData.totalTickets]);

  const { data: requiredStake, isFetching: isCalculatingStake } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getRequiredStakeForEvent',
    args: stakeHookArgs,
    enabled: !!(contractAddress && stakeHookArgs),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };
  
  const handleUploadMetadata = async () => {
    if (!formData.image || !formData.name) return alert("Please provide an event name and image.");
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', formData.image);
    uploadData.append('name', formData.name);
    uploadData.append('description', formData.description);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (!data.success || !data.ipfsUri) throw new Error(data.message || "Failed to get IPFS URI");
      setMetadataURI(data.ipfsUri);
      alert(`Metadata uploaded successfully! URI: ${data.ipfsUri}`);
    } catch (e) {
      alert(`Error uploading metadata: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // All validation is now based on the hook's result.
    if (!metadataURI) {
        return alert("Please upload the event metadata first.");
    }
    if (isCalculatingStake) {
        return alert("Please wait for the stake amount to be calculated.");
    }
    if (typeof requiredStake !== 'bigint') {
        return alert("Could not calculate the required stake. Please check that the Base Price and Total Tickets are valid numbers greater than zero.");
    }

    try {
      const eventDateTimestamp = Math.floor(new Date(formData.eventDate).getTime() / 1000);
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: 'createEvent',
        args: [
          formData.name,
          formData.description,
          formData.venue,
          BigInt(eventDateTimestamp),
          BigInt(formData.totalTickets),
          parseEther(formData.basePrice),
          metadataURI
        ],
        value: requiredStake,
      });
      alert('Event created successfully!');
    } catch (err) {
      console.error("Contract call failed:", err);
      alert(`Failed to create event: ${err.shortMessage || err.message}`);
    }
  };
  
  const isButtonDisabled = !contractAddress || isConfirming || isUploading;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Create a New Event</h1>
      {!contractAddress && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-4 rounded-lg mb-6">
          Please connect your wallet to a supported network (Sepolia, Amoy, or Fuji) to enable the form.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-800 p-8 rounded-lg">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <fieldset disabled={isButtonDisabled} className="space-y-4">
            <input name="name" placeholder="Event Name" onChange={handleInputChange} className="input-field" required />
            <textarea name="description" placeholder="Event Description" onChange={handleInputChange} className="input-field h-24" required />
            <input name="venue" placeholder="Venue" onChange={handleInputChange} className="input-field" required />
            <input name="eventDate" type="datetime-local" onChange={handleInputChange} className="input-field" required />
            <input name="totalTickets" type="number" min="1" placeholder="Total Tickets" onChange={handleInputChange} className="input-field" required />
            <input name="basePrice" type="text" placeholder="Base Price (e.g., 0.01)" onChange={handleInputChange} className="input-field" required />
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Event Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" required/>
            </div>
            
            <div className="text-sm bg-gray-900/80 p-3 rounded-md h-10 flex items-center">
                {isCalculatingStake ? (
                    <span className="text-yellow-400">Calculating stake...</span>
                ) : (typeof requiredStake === 'bigint') ? (
                    <span className="text-green-400">Required Stake: {formatEther(requiredStake)} {chain?.nativeCurrency.symbol}</span>
                ) : (
                    <span className="text-gray-400">Enter price and ticket count to see stake.</span>
                )}
            </div>
          </fieldset>
          
          <button type="button" onClick={handleUploadMetadata} disabled={isButtonDisabled || !formData.image} className="w-full btn-secondary">
            {isUploading ? 'Uploading...' : '1. Upload Metadata'}
          </button>
          
          <button type="submit" disabled={isButtonDisabled || isCalculatingStake} className="w-full btn-primary">
            {isConfirming ? 'Confirming...' : '2. Create Event'}
          </button>
          {error && <p className="text-red-500 mt-2">{error.shortMessage}</p>}
        </form>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Preview</h3>
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt="preview" className="rounded-lg mb-4 w-full h-64 object-cover" />}
          <h4 className="text-xl font-semibold">{formData.name || "Event Name"}</h4>
          <p className="text-gray-400">{formData.description || "Your event description..."}</p>
          {metadataURI && <p className="text-green-400 mt-4 break-all text-xs">Metadata URI: {metadataURI}</p>}
        </div>
      </div>
      <style jsx>{`
        .input-field { background-color: #2d3748; border: 1px solid #4a5568; color: white; padding: 10px; border-radius: 8px; width: 100%; }
        .file-input { display: block; width: 100%; padding: 8px; border-radius: 8px; background-color: #2d3748; border: 1px solid #4a5568; }
        .btn-primary, .btn-secondary { font-bold; padding: 12px; border-radius: 8px; transition: background-color 0.2s; width: 100%; }
        .btn-primary { background-color: #2b6cb0; color: white; }
        .btn-primary:hover:not(:disabled) { background-color: #2c5282; }
        .btn-secondary { background-color: #4a5568; color: white; }
        .btn-secondary:hover:not(:disabled) { background-color: #2d3748; }
        :disabled { background-color: #1a202c !important; color: #718096 !important; cursor: not-allowed; }
      `}</style>
    </div>
  );
}