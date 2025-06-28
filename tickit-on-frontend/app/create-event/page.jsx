// app/create-event/page.jsx
"use client";
import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { contractABI } from '@/lib/abi'; // Uses the new ABI
import { getContractAddress, chainDetails } from '@/lib/chains'; // Uses the new chainDetails

export default function CreateEventPage() {
  const { chain } = useAccount();
  const contractAddress = chain ? getContractAddress(chain.id) : undefined;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    eventDate: '',
    totalTickets: '',
    basePrice: '',
  });
  const [metadataURI, setMetadataURI] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { writeContractAsync, isPending, error } = useWriteContract();

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleUploadMetadata = async () => {
    if (!formData.image || !formData.name) return alert("Please provide an event name and an image to generate metadata.");
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
      alert(`Metadata uploaded successfully!`);
    } catch (e) {
      alert(`Error uploading metadata: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metadataURI) return alert("Please upload metadata first.");
    if (!contractAddress || !chain) return alert("Please connect to a supported network.");

    try {
      const eventDateTimestamp = Math.floor(new Date(formData.eventDate).getTime() / 1000);
      const basePrice = parseEther(formData.basePrice);
      
      // Get the required stake from our config file, exactly like your friend's code
      const stakeString = chainDetails[chain.id]?.requiredStake || "0";
      const requiredStake = parseEther(stakeString);

      if (requiredStake === 0n) {
          return alert("Stake amount is zero, cannot create event. Check chain configuration.");
      }
      
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
          basePrice,
          metadataURI,
        ],
        value: requiredStake,
      });

      alert('Event created successfully!');
      // Reset form
      setFormData({ name: '', description: '', venue: '', eventDate: '', totalTickets: '', basePrice: '', image: null });
      setMetadataURI('');

    } catch (err) {
      console.error("Error creating event:", err);
      alert(`Error creating event: ${err.shortMessage || err.message}`);
    }
  };
  
  const isActionDisabled = !contractAddress || isPending || isUploading;

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Create Event</h2>

      {chain && chainDetails[chain.id] && (
        <div className="mb-4 p-3 bg-yellow-900/50 rounded-md border border-yellow-700">
          <p className="text-sm text-yellow-300">
            <strong>Required Stake on {chain.name}:</strong> {chainDetails[chain.id].requiredStake} {chain.nativeCurrency.symbol}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Event Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Venue</label>
          <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Event Date & Time</label>
          <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Total Tickets</label>
            <input type="number" name="totalTickets" value={formData.totalTickets} onChange={handleInputChange} required min="1" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Base Price ({chain?.nativeCurrency.symbol || '...'})</label>
            <input type="text" name="basePrice" value={formData.basePrice} onChange={handleInputChange} required placeholder="e.g., 0.01" className="input-field" />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300">Event Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" disabled={isActionDisabled} />
            <button type="button" onClick={handleUploadMetadata} disabled={isActionDisabled || !formData.image} className="w-full mt-2 btn-secondary">
                {isUploading ? "Uploading to IPFS..." : "1. Upload Metadata"}
            </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Metadata URI (Auto-generated)</label>
          <input type="url" value={metadataURI} placeholder="Auto-generated after upload" className="input-field bg-gray-900" readOnly />
        </div>
        <button type="submit" disabled={isActionDisabled || !metadataURI} className="w-full btn-primary">
          {isPending ? "Confirming Transaction..." : "2. Create Event on Blockchain"}
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error.shortMessage}</p>}
      </form>
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