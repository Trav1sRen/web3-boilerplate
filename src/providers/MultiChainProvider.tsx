import useEthChain from '@/hooks/chain/useEthChain';
import useSolChain from '@/hooks/chain/useSolChain';
import type { ChainType, IChainBase } from '@/types/chain';
import { createContext, useContext, useState } from 'react';

interface IMultiChainState {
  chainType: ChainType | '';
  setChainType: (chainType: ChainType) => void;
}

const MultiChainContext = createContext({
  chainType: '',
  setChainType: () => {},
} as IMultiChainState);

interface IMultiChainProviderProps {
  children: React.ReactNode;
}

export const MultiChainProvider: React.FC<IMultiChainProviderProps> = ({ children }) => {
  const [chainType, setChainType] = useState<IMultiChainState['chainType']>('');

  return (
    <MultiChainContext.Provider value={{ chainType, setChainType }}>
      {children}
    </MultiChainContext.Provider>
  );
};

type MergedChainState = IChainBase & IMultiChainState;

export const useDynamicChain = (): MergedChainState => {
  const ethChain = useEthChain();
  const solChain = useSolChain();
  const context = useContext(MultiChainContext);

  if (!context) throw new Error('useDynamicChain must be used within a MultiChainProvider');

  let chain: IChainBase;
  switch (context.chainType) {
    case 'eth':
      chain = ethChain;
      break;
    case 'sol':
      chain = solChain;
      break;
    default:
      chain = { account: {}, network: {} } as IChainBase;
  }

  return {
    ...context,
    ...chain,
  };
};
