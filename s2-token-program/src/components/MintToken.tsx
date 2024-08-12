import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { mintTokens } from '../utils/utils';
import { showToast } from 'react-next-toast';
import { Card, Input, Button, Switch, Space, Typography } from 'antd';
import { useToken } from './context/TokenContext';

const { Title } = Typography;

const MintToken: React.FC = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { tokenMintAddress } = useToken(); // Use context
  const [amount, setAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [mintToRecipient, setMintToRecipient] = useState<boolean>(false);

  const handleMintTokens = async () => {
    if (!connected) {
      return showToast.error('🚫 Please connect your wallet to mint tokens.');
    }
    if (!publicKey || !signTransaction) {
      return showToast.error('🚫 Wallet not connected or missing signTransaction method');
    }
    if (!tokenMintAddress) {
      return showToast.error('🚫 Token address is required. Connect a Wallet and Create Token Account');
    }
    if (!amount || amount <= 0) {
      return showToast.error('🚫 Amount must be greater than 0.');
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      await mintTokens(
        connection,
        new PublicKey(tokenMintAddress),
        amount,
        signTransaction,
        publicKey, // Use publicKey as payer
        mintToRecipient ? new PublicKey(recipientAddress) : publicKey // Use recipient address if selected, otherwise use publicKey
      );
      showToast.success('✅ Tokens minted successfully.');
    } catch (error) {
      console.error('Error minting tokens:', error);
      showToast.error('❌ Error minting tokens.');
    }
  };

  return (
    <Card className="w-full max-w-xs md:max-w-lg shadow-lg p-6">
      <Title level={2} className="text-3xl font-bold mb-6">Mint Token</Title>
      <Space direction="vertical" className="w-full">
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount to mint"
          value={amount}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
          className="mb-4"
        />
        <div className="mb-4">
          <Switch
            checked={mintToRecipient}
            onChange={(checked: boolean) => setMintToRecipient(checked)}
            checkedChildren="Mint to Recipient"
            unCheckedChildren="Mint to Connected Wallet"
            className="mb-2"
          />
          {mintToRecipient && (
            <Input
              id="recipientAddress"
              placeholder="Enter recipient address"
              value={recipientAddress}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
              className="mb-4"
            />
          )}
        </div>
        <Button
          onClick={handleMintTokens}
          type="primary"
          size="large"
          className="w-full"
        >
          Mint Tokens
        </Button>
      </Space>
    </Card>
  );
};

export default MintToken;
