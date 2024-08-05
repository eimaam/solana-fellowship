// Import necessary modules
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { showToast } from 'react-next-toast';
import { WalletModal } from '@solana/wallet-adapter-react-ui';
import { transferTokens } from '../utils/utils';

// React component for transferring tokens
const TransferToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [mintAddress, setMintAddress] = useState<string>('');
  const [fromTokenAccountAddress, setFromTokenAccountAddress] =
    useState<string>('');
  const [toTokenAccountAddress, setToTokenAccountAddress] =
    useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  const handleTransfer = async () => {
    if (!connected) {
      setShowWalletModal(true);
      showToast.error('Please connect your wallet to transfer tokens.');
      return;
    }
    if (!publicKey) return showToast.error('Wallet not connected');

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      const keypair = await Keypair.generate();
      const payer = keypair;

      // airdrop some SOL to the payer
      const airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        1 * LAMPORTS_PER_SOL,
      );
      const latestBlockhash = await connection.getLatestBlockhash();

      // Wait for airdrop confirmation
      await connection.confirmTransaction({
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: airdropSignature,
      });

      console.log(
        `💰 Airdropped ${amount} SOL to ${new PublicKey(payer).toBase58()}`,
      );
      // Convert addresses from string to PublicKey
      const mintPubkey = new PublicKey(mintAddress);
      const fromTokenAccountPubkey = new PublicKey(fromTokenAccountAddress);
      const toTokenAccountPubkey = new PublicKey(toTokenAccountAddress);

      // Perform token transfer
      const signature = await transferTokens(
        connection,
        payer,
        mintPubkey,
        fromTokenAccountPubkey,
        toTokenAccountPubkey,
        amount,
      );

      showToast.success(
        `Token transfer successful! Tx signature: ${signature}`,
      );
    } catch (error) {
      console.error('Error during token transfer:', error);
      showToast.error('Error during token transfer.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Transfer Token</h2>
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
            htmlFor="fromTokenAccount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            From Token Account Address
          </label>
          <input
            id="fromTokenAccount"
            type="text"
            value={fromTokenAccountAddress}
            onChange={(e) => setFromTokenAccountAddress(e.target.value)}
            placeholder="Enter from token account address"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="toTokenAccount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            To Token Account Address
          </label>
          <input
            id="toTokenAccount"
            type="text"
            value={toTokenAccountAddress}
            onChange={(e) => setToTokenAccountAddress(e.target.value)}
            placeholder="Enter to token account address"
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
            placeholder="Enter amount to transfer"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleTransfer}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Transfer Token
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

export default TransferToken;
