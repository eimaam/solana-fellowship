import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { airdropTokens } from '../utils/utils';
import { showToast } from 'react-next-toast';
import { Card, Input, Button, Typography, Space, Switch, Spin } from 'antd';
import { useToken } from './context/TokenContext';

const { Title, Text } = Typography;

const AirdropToken: React.FC = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { tokenMintAddress } = useToken(); 
  const [amount, setAmount] = useState<number>(0);
  const [useCustomAddress, setUseCustomAddress] = useState<boolean>(false);
  const [customAddress, setCustomAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo] = useState<{ address: string; txRef: string | null | void; amount: number | null }>({ address: '', txRef: null, amount: null });

  const handleAirdrop = async () => {
    if (!connected) return showToast.error('🚨 Please connect your wallet to airdrop tokens.');
    if (!publicKey || !signTransaction) return showToast.error('🚨 Wallet not connected or missing signTransaction method');
    if (!amount || amount <= 0) return showToast.error('🚨 Amount must be greater than 0.');

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Determine which address to use
    let targetAddress: PublicKey;
    if (useCustomAddress) {
      try {
        targetAddress = new PublicKey(customAddress);
      } catch (error) {
        return showToast.error('🚨 Invalid custom address provided.');
      }
    } else {
      targetAddress = publicKey;
    }

    setLoading(true); // Start loading
    setTransactionInfo({ address: '', txRef: null, amount: null }); // Reset transaction info

    try {
      const txRef = await airdropTokens(connection, amount, targetAddress);
      setTransactionInfo({ address: targetAddress.toString(), txRef, amount });
      showToast.success(`🎉 *Airdrop successful!* Sent ${amount} tokens to ${targetAddress.toString()}. Transaction Ref: ${txRef} 💰`);
    } catch (error) {
      console.error('Error during airdrop:', error);
      showToast.error('⚠️ *Error!* Something went wrong with the airdrop. Please try again. 😔');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Card className="w-full max-w-xs md:max-w-lg shadow-lg p-6">
      <Title level={2} className="text-3xl font-bold mb-6">Airdrop Tokens</Title>
      <Space direction="vertical" className="w-full">
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount to airdrop"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
          className="mb-4"
        />
        <Space direction="horizontal" align="center">
          <Switch
            checked={useCustomAddress}
            onChange={(checked:boolean) => setUseCustomAddress(checked)}
          />
          <span>Use custom address</span>
        </Space>
        {useCustomAddress && (
          <Input
            id="customAddress"
            placeholder="Enter custom wallet address"
            value={customAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomAddress(e.target.value)}
            className="mb-4"
          />
        )}
        <Button
          onClick={handleAirdrop}
          type="primary"
          size="large"
          className="w-full"
          disabled={loading} // Disable button during loading
        >
          {loading ? <Spin /> : 'Airdrop Tokens'}
        </Button>
        {transactionInfo.txRef && (
          <div className="mt-4">
            <Text strong>✅ Airdrop Details:</Text><br />
            <Text>💸 Amount: {transactionInfo.amount} tokens</Text><br />
            <Text>🏦 Sent to Address: {transactionInfo.address}</Text><br />
            <Text>🔗 Transaction Reference: {transactionInfo.txRef}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default AirdropToken;
