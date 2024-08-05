import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { mintTokens } from '../utils/utils.ts';
import { showToast } from 'react-next-toast';
import { WalletModal } from '@solana/wallet-adapter-react-ui';

const MintToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [mintAddress, setMintAddress] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  const handleMintTokens = async () => {
    if (!connected) {
      setShowWalletModal(true);
      showToast.error('Please connect your wallet to mint tokens.');
      return;
    }
    if (!publicKey) return showToast.error('Wallet not connected');
    if (!mintAddress) return showToast.error('Token address is required.');
    if (!recipientAddress)
      return showToast.error('Recipient address is required.');
    if (amount <= 0) return showToast.error('Amount must be greater than 0.');

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      // Load the payer keypair
      const response = await fetch('../../keypair.json');
      if (!response.ok) throw new Error('Failed to load keypair');
      const keypair = await response.json();
      const payer = Keypair.fromSecretKey(
        Uint8Array.from(Object.values(keypair.secretKey)),
      );

      // Mint tokens
      await mintTokens(
        connection,
        new PublicKey(mintAddress),
        payer,
        new PublicKey(recipientAddress),
        amount,
      );
      showToast.success('Tokens minted successfully.');
    } catch (error) {
      console.error('Error minting tokens:', error);
      showToast.error('Error minting tokens.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Mint Tokens</h2>

        <div className="mb-6">
          <label
            htmlFor="mintAddress"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Mint Address
          </label>
          <input
            id="mintAddress"
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="recipientAddress"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Recipient Address
          </label>
          <input
            id="recipientAddress"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount to mint"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleMintTokens}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Mint Tokens
        </button>
      </div>

      <div className="mt-6">
        {!connected && (
          <button
            onClick={() => setShowWalletModal(true)}
            className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};

export default MintToken;
