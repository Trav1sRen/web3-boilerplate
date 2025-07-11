import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
  useWalletInfo,
} from '@reown/appkit/react';

/**
 * Extract states from AppKit hooks and consumed by Eth and Solana wallets
 */
const useAppKitExtract = () => {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { status, address } = useAppKitAccount();
  const { caipNetwork, switchNetwork } = useAppKitNetwork();
  const { walletInfo } = useWalletInfo();

  return {
    openConnectModal: open,
    account: { status, address },
    disconnect,
    network: { caipNetwork, switchNetwork },
    wallet: walletInfo,
  };
};

export default useAppKitExtract;
