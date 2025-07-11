import useAppKitExract from '@/hooks/appKit/useAppKitExtract';
import type { IChainBase } from '@/types/chain';
import { solana } from '@reown/appkit/networks';

const useSolChain = (): IChainBase => {
  const { openConnectModal, disconnect, account, network, wallet } = useAppKitExract();

  return {
    connect: () => openConnectModal({ view: 'Connect', namespace: 'solana' }),
    disconnect,
    account,
    network: {
      caipNetwork: network.caipNetwork,
      switchNetwork: () => network.switchNetwork(solana),
    },
    wallet,
    transfer: async () => {},
  };
};

export default useSolChain;
