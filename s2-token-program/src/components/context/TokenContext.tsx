import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextType {
  tokenMintAddress: string;
  setTokenMintAddress: (address: string) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenMintAddress, setTokenMintAddress] = useState<string>('');

  return (
    <TokenContext.Provider value={{ tokenMintAddress, setTokenMintAddress }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
