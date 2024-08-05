import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
// import { burnToken } from '../utils/utils';

const BurnToken: React.FC = () => {
  const { publicKey } = useWallet();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [sourceAddress, setSourceAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const handleBurnToken = async () => {
    if (!publicKey) return;
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    try {
      //   await burnToken(connection, publicKey, new PublicKey(tokenAddress), new PublicKey(sourceAddress), amount);
      console.log('Token burned successfully');
    } catch (error) {
      console.error('Error burning token:', error);
    }
  };

  return (
    <div>
      <h2>Burn Token</h2>
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
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <button onClick={handleBurnToken}>Burn Token</button>
    </div>
  );
};

export default BurnToken;
