import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../utils/Tracking.json';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Truck, Package, CreditCard } from 'lucide-react';

export default function CreateShipment() {
  const [form, setForm] = useState({ receiver: '', distance: '', price: '' });
  const router = useRouter();
  const CONTRACT_ADDRESS = "0x4EC17E231FEC4e133c3f58Ac94B549dD40Db0599";
  const CONTRACT_ABI = abi.abi;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.receiver || !form.distance || !form.price) {
      toast.error('Please fill out all fields');
      return;
    }

    // Validate ETH address format
    if (!ethers.utils.isAddress(form.receiver)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    try {
      toast.loading('Connecting to wallet...', { id: 'txn' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      toast.loading('Preparing transaction...', { id: 'txn' });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const priceWei = ethers.utils.parseEther(form.price);
      
      toast.loading('Creating shipment...', { id: 'txn' });
      const tx = await contract.CreateShipment(
        form.receiver,
        Math.floor(Date.now() / 1000),
        form.distance,
        priceWei,
        { value: priceWei }
      );
      
      toast.loading('Confirming transaction...', { id: 'txn' });
      await tx.wait();
      
      toast.success('Shipment created successfully!', { id: 'txn' });
      router.push('/');
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = 'Failed to create shipment';
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds in your wallet';
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        errorMessage = 'Contract error: The transaction might revert';
      } else if (error.message && error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      }
      
      toast.error(errorMessage, { id: 'txn' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative container mx-auto p-6 max-w-2xl"
      >
        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-25 pointer-events-none" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Create New Shipment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">
                Receiver's Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-colors"
                  placeholder="0x..."
                  value={form.receiver}
                  onChange={(e) => setForm({ ...form, receiver: e.target.value })}
                />
                <Package className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Distance (kilometers)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-colors appearance-none"
                  placeholder="Enter distance"
                  value={form.distance}
                  onChange={(e) => setForm({ ...form, distance: e.target.value })}
                />
                <Truck className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Price (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-colors appearance-none"
                  placeholder="Enter price in ETH"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <CreditCard className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-medium relative z-10 cursor-pointer"
            >
              Create Shipment
            </motion.button>
          </form>
        </div>
      </motion.div>

      <style jsx>{`
        /* Hide number input arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};