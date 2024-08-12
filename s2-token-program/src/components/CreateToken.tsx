import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { showToast } from 'react-next-toast';
import { Card, Input, Button, Typography, Space } from 'antd';
import 'antd/dist/reset.css'; 
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useToken } from './context/TokenContext';

const { Title } = Typography;

const CreateToken: React.FC = () => {
  const { publicKey, signTransaction, connected, connecting } = useWallet();
  const { tokenMintAddress, setTokenMintAddress } = useToken();
  const [decimals, setDecimals] = useState<number>(0);

  const handleCreateToken = async () => {
    if (!connected) {
      showToast.error('🚨 *Oops!* You need to connect your wallet before creating a token. 🌐');
      return;
    }
    if (!publicKey || !signTransaction) {
      showToast.error('🚨 *Connection Error!* Make sure your wallet is properly connected and can sign transactions. 🛠️');
      return;
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      const mintPublicKey = new PublicKey(publicKey);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey,
      );

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey, // The wallet's public key, as the owner
          associatedTokenAddress, // The token account to be created
          publicKey, // The wallet's public key, as the payer and owner
          mintPublicKey, // The mint public key
        ),
      );

      // Sign the transaction with the connected wallet
      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      transaction.feePayer = publicKey;
      const signedTransaction = await signTransaction(transaction);
      const serializedTransaction = signedTransaction.serialize();

      // Send the transaction
      const signature = await connection.sendRawTransaction(
        serializedTransaction,
      );

      // Confirm the transaction
      await connection.confirmTransaction({
        blockhash: recentBlockhash.blockhash,
        lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
        signature,
      });

      setTokenMintAddress(associatedTokenAddress.toBase58());
      showToast.success('🎉 *Success!* Your token account has been created. 🎊 Token Address:');
    } catch (error: any) {
      console.error('Error creating token:', error);
      showToast.error(`⚠️ *Error!* Something went wrong while creating your token. Please try again. 😔`);
    }
  };

  return (
    <Card className="w-full max-w-xs md:max-w-lg shadow-lg p-6">
      <Title level={2} className="text-3xl font-bold mb-6">Create Token</Title>
      <Space direction="vertical" className="w-full">
        <div className="mb-6">
          <label htmlFor="decimals" className="block text-sm font-medium mb-2">
            Decimals
          </label>
          <Input
            id="decimals"
            type="number"
            value={decimals}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDecimals(Number(e.target.value))}
            placeholder="Enter number of decimals"
            className="w-full"
          />
        </div>
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={handleCreateToken}
          disabled={connecting}
          loading={connecting}
        >
          Create Token
        </Button>
        {tokenMintAddress && (
          <div className="mt-6 p-4 border border-gray-300 rounded-md">
            <p className="text-sm text-gray-700">Token Address:</p>
            <p className="text-sm font-medium text-blue-500 break-all">
              {tokenMintAddress}
            </p>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default CreateToken;
