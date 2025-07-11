import { createAppKit } from '@reown/appkit/react';

import queryClient from '@/lib/query/queryClient';
import type { CreateAppKit } from '@reown/appkit';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, solana } from '@reown/appkit/networks';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

const metadata = {
  name: 'dfs-camp-pay',
  description: '',
  url: '',
  icons: [],
};

const networks = [mainnet, solana] as CreateAppKit['networks'];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});
const solanaWeb3JsAdapter = new SolanaAdapter();

createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks,
  projectId,
  metadata,
  features: {
    legalCheckbox: true,
    analytics: false,
    connectMethodsOrder: ['wallet'],
    emailShowWallets: true,
  },
  allWallets: 'SHOW',
  enableWalletGuide: false,
  enableWalletConnect: true,
  enableCoinbase: false,
  allowUnsupportedChain: false,
  themeVariables: {
    '--w3m-font-family': 'Outfit, sans-serif',
  },
});

interface IAppKitProviderProps {
  children: React.ReactNode;
}

export const AppKitProvider: React.FC<IAppKitProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
