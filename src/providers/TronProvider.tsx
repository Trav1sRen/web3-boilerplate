import { useWallet, WalletProvider, type Wallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter, WalletConnectAdapter, type TronWeb } from '@tronweb3/tronwallet-adapters';
import { createContext, useContext, useEffect, useState } from 'react';

/* 考虑是否用 useMemo 和 useCallback 缓存 context value 和函数 */

interface ContractFunctionParameter {
  type: string;
  value: unknown;
}

type Adapter = Wallet['adapter'];
interface TronWebAdapter extends Adapter {
  tronWeb: TronWeb; // 扩展TronWeb实例
}

interface ITronContextType {
  isConnected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTRX: (to: string, amount: number) => Promise<string>;
  sendToken: (
    contractAddress: string,
    to: string,
    amount: number,
    options?: { feeLimit: number }
  ) => Promise<string>;
  sendContractPayment: (
    contractAddress: string,
    functionSelector: string,
    parameters: ContractFunctionParameter[],
    options?: {
      feeLimit: number;
      callValue: number;
    }
  ) => Promise<string>;
  /*
  isSending: boolean;
  error: Nullable<Error>;
  */
  isConnecting: boolean;
}

const TronContext = createContext<Nullable<ITronContextType>>(null);

interface TronProviderProps {
  children: React.ReactNode;
}

export const TronProvider: React.FC<TronProviderProps> = ({ children }) => {
  const { wallet, connect, disconnect, connected, connecting } = useWallet();
  const [tronWeb, setTronWeb] = useState<Nullable<TronWeb>>(null);
  const [address, setAddress] = useState<string>('');

  // 同步钱包状态
  useEffect(() => {
    if (wallet && connected) {
      const adapter = wallet.adapter as TronWebAdapter;
      setTronWeb(adapter.tronWeb);
      setAddress(adapter.tronWeb.defaultAddress.base58 as string);
    } else {
      setTronWeb(null);
      setAddress('');
    }
  }, [wallet, connected]);

  // 发送TRX
  const sendTRX = async (to: string, amount: number) => {
    if (!tronWeb || !address) throw new Error('Wallet not connected');
    const tx = await tronWeb.transactionBuilder.sendTrx(to, Number(tronWeb.toSun(amount)), address);
    const signedTx = await tronWeb.trx.sign(tx);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);
    return result.txid;
  };

  // 发送代币 (TRC20)
  const sendToken = async (
    contractAddress: string,
    to: string,
    amount: number,
    options = { feeLimit: 10_000_000 }
  ) => {
    if (!tronWeb || !address) throw new Error('Wallet not connected');

    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      'transfer(address,uint256)',
      {
        feeLimit: options.feeLimit,
        callValue: 0,
      },
      [
        { type: 'address', value: to },
        { type: 'uint256', value: amount.toString() },
      ],
      address
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);
    return result.txid;
  };

  // 通用合约调用
  const sendContractPayment = async (
    contractAddress: string,
    functionSelector: string,
    parameters: ContractFunctionParameter[] = [],
    options = { feeLimit: 10_000_000, callValue: 0 }
  ) => {
    if (!tronWeb || !address) throw new Error('Wallet not connected');

    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      functionSelector,
      {
        feeLimit: options.feeLimit,
        callValue: options.callValue,
      },
      parameters,
      address
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);
    return result.txid;
  };

  return (
    <WalletProvider
      adapters={[
        new TronLinkAdapter(),
        new WalletConnectAdapter({
          network: 'mainnet', // 或 'shasta' | 'nile'
          options: {
            projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 从 walletconnect.com 获取
            metadata: {
              name: 'My DApp',
              description: 'My Tron DApp',
              url: 'https://mydapp.com',
              icons: ['https://mydapp.com/logo.png'],
            },
          },
        }),
      ]}
    >
      <TronContext.Provider
        value={{
          isConnected: connected,
          address,
          connect,
          disconnect,
          sendTRX,
          sendToken,
          sendContractPayment,
          /*
          isSending,
          error,
          */
          isConnecting: connecting,
        }}
      >
        {children}
      </TronContext.Provider>
    </WalletProvider>
  );
};

export function useTron() {
  const context = useContext(TronContext);
  if (!context) throw new Error('useTron must be used within TronProvider');
  return context;
}
