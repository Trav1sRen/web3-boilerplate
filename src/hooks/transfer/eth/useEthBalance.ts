import { useAppGlobalStore } from '@/app/store';
import { useDynamicChain } from '@/providers/MultiChainProvider';
import { useCallback, useState } from 'react';
import { createPublicClient, erc20Abi, formatUnits, http, type Address } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

interface IUseEthBalanceReturn {
  ethBalance: string;
  getEthBalance: () => Promise<void>;
}

const ethClient = createPublicClient({
  chain: import.meta.env.DEV ? sepolia : mainnet,
  transport: http(),
});

const useEthBalance = (): IUseEthBalanceReturn => {
  const {
    account: { address },
  } = useDynamicChain();
  const {
    transferDetails: { tokenAddress },
  } = useAppGlobalStore();

  const [ethBalance, setEthBalance] = useState('');

  const getEthBalance = useCallback(async () => {
    const [balance, decimals] = await Promise.all([
      ethClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      }),
      ethClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
    ]);
    setEthBalance(formatUnits(balance, decimals));
  }, [address, tokenAddress]);

  return {
    ethBalance,
    getEthBalance,
  };
};

export default useEthBalance;
