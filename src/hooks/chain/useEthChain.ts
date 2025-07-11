import useAppKitExract from '@/hooks/appKit/useAppKitExtract';
import type { IChainBase } from '@/types/chain';
import { mainnet } from '@reown/appkit/networks';

const useEthChain = (): IChainBase => {
  const { openConnectModal, disconnect, account, network, wallet } = useAppKitExract();

  return {
    connect: () => openConnectModal({ view: 'Connect', namespace: 'eip155' }),
    disconnect,
    account,
    network: {
      caipNetwork: network.caipNetwork,
      switchNetwork: () => network.switchNetwork(mainnet),
    },
    wallet,
    transfer: async () => {},
  };
};

export default useEthChain;
