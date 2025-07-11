import { useAppGlobalStore } from '@/app/store';
import { useDynamicChain } from '@/providers/MultiChainProvider';
import { useCallback, useState } from 'react';
import { erc20Abi, formatUnits, type Address } from 'viem';
import { usePublicClient } from 'wagmi';

interface IUseEthBalanceReturn {
  ethBalance: string;
  getEthBalance: () => Promise<void>;
}

const useEthBalance = (): IUseEthBalanceReturn => {
  const {
    account: { address },
  } = useDynamicChain();
  const {
    transferDetails: { tokenAddress },
  } = useAppGlobalStore();
  const publicClient = usePublicClient();

  const [ethBalance, setEthBalance] = useState('');

  const getEthBalance = useCallback(async () => {
    if (!publicClient) {
      throw new Error('ETH public client is not available');
    }

    const [balance, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
    ]);
    setEthBalance(formatUnits(balance, decimals));
  }, [address, tokenAddress, publicClient]);

  return {
    ethBalance,
    getEthBalance,
  };
};

export default useEthBalance;
