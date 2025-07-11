import { useAppGlobalStore } from '@/app/store';
import { REFETCH_INTERVAL, WALLET_API } from '@/constants/api.constants';
import axiosClient from '@/lib/api/axiosClient';
import { useDynamicChain } from '@/providers/MultiChainProvider';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

const useConnectTransfer = () => {
  const { wallet, account, network } = useDynamicChain();
  const { isWalletValid, setTransferDetails } = useAppGlobalStore();

  const params = useMemo<IConnectTransferParams>(() => {
    if (!wallet) {
      throw new Error('Wallet is not connected');
    }
    return {
      fromWallet: account.address || '',
      fromWalletIcon: wallet.icon || '',
      fromWalletType: wallet.name,
      network: network.caipNetwork?.name || '',
      token: '' /* Handle the token logic when App init */,
    };
  }, [wallet, account, network]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [WALLET_API.QUERY_KEYS.CONNECT_TRANSFER(params)],
    queryFn: () => {
      return axiosClient.post<IConnectTransferResp>(WALLET_API.ENDPOINTS.CONNECT_TRANSFER, {
        params: {} as IConnectTransferParams,
      });
    },
    refetchInterval: (query) => {
      const { data } = query.state;
      if (data) {
        const { timeoutFlag, riskLevel, progress } = data.data;
        if (timeoutFlag || (riskLevel && progress === 100)) {
          return false;
        }
      }
      return REFETCH_INTERVAL;
    },
    enabled: isWalletValid,
  });

  useEffect(() => {
    if (data) {
      // Handle the behaviors based on the response data
      setTransferDetails(data.data);
    }
  }, [data, setTransferDetails]);

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useConnectTransfer;
