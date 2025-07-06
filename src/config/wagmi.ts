import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const config = createConfig({
  chains: [mainnet, sepolia], // 支持的链
  connectors: [
    injected(), // 注入式钱包（MetaMask等）
    walletConnect({
      projectId: 'your-walletconnect-project-id', // WalletConnect 项目ID
      showQrModal: true,
    }),
    // 可以添加更多钱包连接方式，如 CoinbaseWallet
  ],
  transports: {
    [mainnet.id]: http(), // 主网 RPC
    [sepolia.id]: http(), // Sepolia 测试网 RPC
  },
});

export default config;
