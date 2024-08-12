import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { transferTokens } from '../utils/utils'; 
import { showToast } from 'react-next-toast';
import { Card, Input, Button, Space, Typography } from 'antd';
import { useToken } from './context/TokenContext';

const { Title } = Typography;

const TransferToken: React.FC = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { tokenMintAddress } = useToken(); 
  const [amount, setAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  const handleTransferTokens = async () => {
    if (!connected) {
      showToast.error('🚨 *Oops!* Connect your wallet to transfer tokens. 🌐');
      return;
    }
    if (!publicKey || !signTransaction) {
      showToast.error('🚨 *Connection Error!* Ensure your wallet is connected and able to sign transactions. 🛠️');
      return;
    }
    if (!tokenMintAddress) {
      showToast.error('🚨 *Missing Token Address!* Please create a token first. 🏷️');
      return;
    }
    if (!amount || amount <= 0) {
      showToast.error('🚨 *Invalid Amount!* Enter a value greater than 0. 💸');
      return;
    }
    if (!recipientAddress) {
      showToast.error('🚨 *Recipient Address Required!* Please provide a valid address. 📬');
      return;
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      await transferTokens(
        connection,
        new PublicKey(tokenMintAddress),
        amount,
        signTransaction,
        publicKey,
        new PublicKey(recipientAddress)
      );
      showToast.success('🎉 *Success!* Tokens have been transferred successfully. 🎊');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      showToast.error('⚠️ *Error!* Something went wrong during the transfer. Please try again. 😔');
    }
  };

  return (
    <Card className="w-full max-w-xs md:max-w-lg shadow-lg p-6">
      <Title level={2} className="text-3xl font-bold mb-6">Transfer Token</Title>
      <Space direction="vertical" className="w-full">
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount to transfer"
          value={amount}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
          className="mb-4"
        />
        <Input
          id="recipientAddress"
          placeholder="Enter recipient address"
          value={recipientAddress}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
          className="mb-4"
        />
        <Button
          onClick={handleTransferTokens}
          type="primary"
          size="large"
          className="w-full"
        >
          Transfer Tokens
        </Button>
      </Space>
    </Card>
  );
};

export default TransferToken;
