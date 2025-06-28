// app/providers.jsx
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';

// DO NOT EXPORT 'config'. It should only live here.
const config = getDefaultConfig({
  appName: 'TickItOn',
  projectId: walletConnectProjectId,
  chains: supportedChains,
  ssr: true, 
});

const customTheme = {
    ...darkTheme({ overlayBlur: 'small' }),
    colors: {
      ...darkTheme().colors,
      accentColor: '#3b82f6',
      accentColorForeground: '#ffffff',
      modalBackground: '#1f2937',
      modalText: '#ffffff',
      modalTextSecondary: '#9ca3af',
      connectButtonBackground: '#1f2937',
      connectButtonInnerBackground: '#1f2937',
      connectButtonText: '#ffffff',
    },
    radii: {
      actionButton: '8px',
      connectButton: '8px',
      menuButton: '8px',
      modal: '12px',
      modalMobile: '12px',
    }
};

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}