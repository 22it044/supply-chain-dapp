import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative container mx-auto px-6 py-20 flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Supply Chain DApp
        </h1>
        
        <p className="mt-6 text-xl text-center text-gray-400 max-w-2xl">
          Track, manage and verify shipments securely on the blockchain
        </p>
        
        <div className="mt-12 bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 max-w-lg w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome</h2>
          
          <div className="mb-8 text-center text-gray-300">
            Please connect your wallet to continue to the application.
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            Use the connect button in the navbar above to get started.
          </div>
        </div>
      </motion.div>
    </div>
  );
} 