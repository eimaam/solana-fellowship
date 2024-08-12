import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

// Import Buffer from the 'buffer' package
import { Buffer } from 'buffer/';
import process from 'process'
import WalletContextProvider from './components/context/WalletContext.tsx';
import "./App.css"
import "./index.css"
import { TokenProvider } from './components/context/TokenContext.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <WalletContextProvider>
    <TokenProvider>
    <App />
    </TokenProvider>
  </WalletContextProvider>
  </BrowserRouter>,
)
