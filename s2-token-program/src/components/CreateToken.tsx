import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { createToken } from '../utils/utils';
import { showToast } from 'react-next-toast';
import {
  WalletMultiButton,
  WalletModal,
} from '@solana/wallet-adapter-react-ui';

const CreateToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [decimals, setDecimals] = useState<number>(0);
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  const handleCreateToken = async () => {
    if (!connected) {
      setShowWalletModal(true);
      showToast.error('Please connect your wallet to create a token.');
      return;
    }
    if (!publicKey) {
      showToast.error('Wallet not connected');
      return;
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      // Load the keypair from a JSON file
      const response = await fetch('../../keypair.json');
      console.log({ response });
      if (!response.ok) {
        throw new Error('Failed to load keypair');
      }

      const keypair = await response.json();
      const payer = Keypair.fromSecretKey(
        Uint8Array.from(Object.values(keypair.secretKey)),
      );

      const payerBalance = await connection.getBalance(payer.publicKey);
      console.log({ payerBalance });

      if (payerBalance < LAMPORTS_PER_SOL) {
        const airdropSignature = await connection.requestAirdrop(
          payer.publicKey,
          LAMPORTS_PER_SOL,
        );
        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: airdropSignature,
        });
        console.log(`💰 Airdropped ${LAMPORTS_PER_SOL} to ${payer.publicKey}`);
      }

      const mintAddress = await createToken(connection, payer, decimals);
      setTokenAddress(mintAddress.toBase58());
    } catch (error) {
      console.error('Error creating token:', error);
      showToast.error('Error creating token.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Create Token</h2>
        <div className="mb-6">
          <label
            htmlFor="decimals"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Decimals
          </label>
          <input
            id="decimals"
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            placeholder="Enter number of decimals"
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleCreateToken}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Token
        </button>
        {tokenAddress && (
          <div className="mt-6 p-4 bg-gray-700 border border-gray-600 rounded-md">
            <p className="text-sm text-gray-300">Token Address:</p>
            <p className="text-sm font-medium text-blue-400 break-all">
              {tokenAddress}
            </p>
          </div>
        )}
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
      {showWalletModal && <WalletModal />}
    </div>
  );
};

export default CreateToken;
