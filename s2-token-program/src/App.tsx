
import React, { useEffect, useState } from 'react';
import CreateToken from './components/CreateToken';
import MintToken from './components/MintToken';
import TransferToken from './components/TransferToken';
import BurnToken from './components/BurnToken';
import DelegateToken from './components/DelegateToken';
import { ConfigProvider, theme } from 'antd';

// Import Buffer from the 'buffer' package
import { Buffer } from 'buffer/';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from 'antd';
import { Layout } from 'antd';
import PageLayout from './components/layout';
import { useWalletModal, WalletModal } from '@solana/wallet-adapter-react-ui';
import WelcomeScreen from './components/WelcomeScreen';
import { Space } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;


const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [mounted, setMounted] = React.useState(false);

  const { publicKey, disconnect, disconnecting } = useWallet()
  const {setVisible} = useWalletModal()

  const handleConnectWallet = async () => {
    if(publicKey) {
      disconnect()
    } else {

      setVisible(true)

    }

  }


  useEffect(() => {
    // AOS.init({
    //   delay: 0,
    //   duration: 700,
    //   easing: 'ease-in-out',
    // });
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode, mounted]); 


  useEffect(() => {
    setMounted(true);
  }, [theme]);

  if (!mounted || !theme) return null;

  return (
    <ConfigProvider
  message={{
    className: "text-white",
  }}
    theme={{
      ...theme,
      token: {
        colorPrimary: isDarkMode ? "#fff" : "#0E0E0E",
        colorText: isDarkMode ? "#fff" : "#0E0E0E",
        colorLink: isDarkMode ? "#fff" : "#0E0E0E",
      },
      components: {
        Button: {
          algorithm: true,
          colorPrimary: isDarkMode ? "#0078D4" : "#0E0E0E",
          primaryColor: isDarkMode ? "#fff" : "#000",
          defaultHoverColor: isDarkMode ? "#0E0E0E" : "#fff",
          defaultHoverBg: isDarkMode ? "#fff" : "#0E0E0E",
        },
        Alert: {
          colorText: isDarkMode ? "#fff" : "#0E0E0E",
        },
        Input: {
          paddingBlock: 10
        },
        Modal: {
          algorithm: true,
          colorBgBlur: isDarkMode ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)"
        },
      },
      algorithm: mounted ? (isDarkMode ? darkAlgorithm : defaultAlgorithm) : defaultAlgorithm,
    }}
  >
      <div className='h-screen overflow-y-scroll py-12 flex flex-col items-center  gap-8'>
        <WelcomeScreen />
        {
publicKey &&
        <div className="grid grid-cols-2 gap-6 w-[60%] mx-auto">
          <CreateToken />
          <MintToken />
          <TransferToken />
          <BurnToken />
          <DelegateToken />
        </div>
        }
      </div>
      </ConfigProvider>
  );
};

export default App;
