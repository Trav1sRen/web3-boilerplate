import { useAppGlobalStore } from '@/app/store';
import { WALLET_API } from '@/constants/api.constants';
import axiosClient from '@/lib/api/axiosClient';
import { useDynamicChain } from '@/providers/MultiChainProvider';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

const useCheckWallet = () => {
  const { wallet, account, network } = useDynamicChain();
  const { setIsWalletValid } = useAppGlobalStore();

  const params = useMemo<ICheckWalletParams>(() => {
    if (!wallet) {
      throw new Error('Wallet is not connected');
    }
    return {
      fromWallet: account.address || '',
      network: network.caipNetwork?.name || '',
      token: '' /* Handle the token logic when App init */,
    };
  }, [wallet, account, network]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [WALLET_API.QUERY_KEYS.CHECK_WALLET(params)],
    queryFn: () => {
      return axiosClient.post<ICheckWalletResp>(WALLET_API.ENDPOINTS.CHECK_WALLET, {
        params: {} as ICheckWalletParams,
      });
    },
  });

  useEffect(() => {
    if (data) {
      const { isValid } = data.data;

      if (!isValid) {
        // Handle invalid wallet case
        return;
      }
      setIsWalletValid(true);
    }
  }, [data, setIsWalletValid]);

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useCheckWallet;
