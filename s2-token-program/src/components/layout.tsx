import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import { Avatar } from 'antd';
import { Tooltip } from 'antd';
import { Popover } from 'antd';
import { WalletModal } from '@solana/wallet-adapter-react-ui';

const { Content, Footer } = Layout;

interface IProps {
  isDarkMode: boolean;
  handleModeChange: () => void;
}

const PageLayout = ({ children }:PropsWithChildren) => {

  return (
    // <Layout className="h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 !font-baiJamjuree flex items-center justify-center">

    <Layout className="h-screen w-full !font-baiJamjuree flex items-center justify-center">
        <Content className="!w-full !py-6 !m-0 !font-baiJamjuree flex flex-col items-center justify-center !shadow-none">
          {children}
        </Content>
    </Layout>
  );
};

export default PageLayout;
