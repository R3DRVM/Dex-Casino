import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { chains, client } from './wagmi';
import { darkTheme, midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import './styles/index.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <BrowserRouter>
        <RainbowKitProvider
          // modalSize='compact'
          chains={chains}
          theme={darkTheme({
          // accentColor: '#95ede7',
          // accentColorForeground: '#a356bf',
          overlayBlur: 'large',
          })}
        >
          <App />
        </RainbowKitProvider>
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
