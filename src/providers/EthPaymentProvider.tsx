import wagmiConfig from '@/config/wagmi';
import { createContext, useContext } from 'react';
import { parseEther, type Abi } from 'viem';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useWriteContract,
  WagmiProvider,
  type Connector,
  type UseConnectReturnType,
  type UseDisconnectReturnType,
} from 'wagmi';

type ContractPaymentParams = {
  contractAddress: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: unknown[];
  value: string;
};

interface IEthPaymentContext {
  isConnected: boolean;
  address?: `0x${string}`;
  connectors: Connector[];
  connect: UseConnectReturnType['connect'];
  disconnect: UseDisconnectReturnType['disconnect'];
  sendPayment: (to: `0x${string}`, amount: string) => void;
  sendContractPayment: (params: ContractPaymentParams) => void;
  isSending: boolean;
  error: Nullable<Error>;
  isConnecting: boolean;
}

const EthPaymentContext = createContext<Nullable<IEthPaymentContext>>(null);

interface EthPaymentProviderProps {
  children: React.ReactNode;
}

export const EthPaymentProvider: React.FC<EthPaymentProviderProps> = ({ children }) => {
  const { connectors, connect, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const {
    sendTransaction,
    isPending: isSendingTransaction,
    error: sendError,
  } = useSendTransaction();
  const { writeContract, isPending: isSendingContract, error: contractError } = useWriteContract();

  const isSending = isSendingTransaction || isSendingContract;
  const error = sendError || contractError;
  const isConnecting = connectStatus === 'pending';

  const sendPayment = (to: `0x${string}`, amount: string) => {
    if (!isConnected) throw new Error('Wallet not connected');

    sendTransaction({
      to,
      value: parseEther(amount),
    });
  };

  const sendContractPayment = (params: ContractPaymentParams) => {
    if (!isConnected) throw new Error('Wallet not connected');

    writeContract({
      address: params.contractAddress,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
      value: parseEther(params.value),
    });
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <EthPaymentContext.Provider
        value={{
          isConnected,
          address,
          connectors: [...connectors],
          connect,
          disconnect,
          sendPayment,
          sendContractPayment,
          isSending,
          error,
          isConnecting,
        }}
      >
        {children}
      </EthPaymentContext.Provider>
    </WagmiProvider>
  );
};

export const useEthPayment = () => {
  const context = useContext(EthPaymentContext);
  if (!context) {
    throw new Error('useEthPayment must be used within a EthPaymentProvider');
  }
  return context;
};
