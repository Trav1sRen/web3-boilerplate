import {
  type ConnectedWalletInfo,
  type UseAppKitAccountReturn,
  type UseAppKitNetworkReturn,
} from '@reown/appkit/react';

interface IChainBase {
  connect: () => void;
  disconnect: () => void;
  account: { status: UseAppKitAccountReturn['status']; address: UseAppKitAccountReturn['address'] };
  network: { caipNetwork: UseAppKitNetworkReturn['caipNetwork']; switchNetwork: () => void };
  wallet?: ConnectedWalletInfo;
  transfer: () => Promise<void>;
}

type ChainType = 'eth' | 'sol' | 'tron';
