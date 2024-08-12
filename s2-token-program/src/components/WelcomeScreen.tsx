import { Button } from 'antd';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Tooltip } from 'antd';

const WelcomeScreen = () => {
  const { publicKey, connecting, disconnect, disconnecting } = useWallet();

  const { setVisible } = useWalletModal();

  const handleConnectWallet = async () => {

    if (publicKey) {
      return disconnect();
    } 
      setVisible(true);
    
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <div>
        <h1 className="text-2xl md:text-5xl">Token Manager</h1>
        <p className="text-sm md:text-base">
          <i>
            This is a simple token program that demonstrates how to <br />{' '}
            create, mint, delegate & burn tokens on the{' '}
            <mark>Solana blockchain.</mark>
          </i>
        </p>
      </div>
      {!publicKey && (
        <p className="text-sm md:text-base">
          To get started, connect your wallet and create a token.
        </p>
      )}
      {publicKey ? (
        <Tooltip title="Disconnect Wallet">
          <Button size="large" title="Disconnect">
            {publicKey.toBase58()}
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="large"
          type="primary"
          loading={disconnecting || connecting}
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WelcomeScreen;
