import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
// import { delegateToken } from '../utils/utils';

const DelegateToken: React.FC = () => {
  const { publicKey } = useWallet();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [sourceAddress, setSourceAddress] = useState<string>('');
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const handleDelegateToken = async () => {
    if (!publicKey) return;
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    try {
      //   await delegateToken(connection, publicKey, new PublicKey(tokenAddress), new PublicKey(sourceAddress), new PublicKey(delegateAddress), amount);
      console.log('Token delegated successfully');
    } catch (error) {
      console.error('Error delegating token:', error);
    }
  };

  return (
    <div>
      <h2>Delegate Token</h2>
      <input
        type="text"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Token Address"
      />
      <input
        type="text"
        value={sourceAddress}
        onChange={(e) => setSourceAddress(e.target.value)}
        placeholder="Source Address"
      />
      <input
        type="text"
        value={delegateAddress}
        onChange={(e) => setDelegateAddress(e.target.value)}
        placeholder="Delegate Address"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <button onClick={handleDelegateToken}>Delegate Token</button>
    </div>
  );
};

export default DelegateToken;
