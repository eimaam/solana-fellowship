// src/App.tsx

import React from 'react';
import CreateToken from './components/CreateToken';
import MintToken from './components/MintToken';
import TransferToken from './components/TransferToken';
import BurnToken from './components/BurnToken';
import DelegateToken from './components/DelegateToken';
import WalletConnection from './components/WalletConnection';

// Import Buffer from the 'buffer' package
import { Buffer } from 'buffer/';
import WalletProviderComponent from './components/WalletConnection';


const App: React.FC = () => {
  return (
      <div className="App">
        <h1>Solana Token Manager</h1>
        <CreateToken />
        <MintToken />
        <TransferToken />
        <BurnToken />
        <DelegateToken />
      </div>
  );
};

export default App;
