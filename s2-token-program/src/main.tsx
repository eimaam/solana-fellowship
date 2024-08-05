import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Import Buffer from the 'buffer' package
import { Buffer } from 'buffer/';
import process from 'process'
import WalletProviderComponent from './components/WalletConnection.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <WalletProviderComponent>
    <App />
  </WalletProviderComponent>
  </BrowserRouter>,
)
