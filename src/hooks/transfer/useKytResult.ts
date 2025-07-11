import { REFETCH_INTERVAL, TRANSFER_API } from '@/constants/api.constants';
import axiosClient from '@/lib/api/axiosClient';
import { useQuery } from '@tanstack/react-query';

const useKytResult = (params: IGetKytResultParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [TRANSFER_API.QUERY_KEYS.CHECK_KYT(params)],
    queryFn: () => {
      return axiosClient.get<IGetKytResultResp>(TRANSFER_API.ENDPOINTS.CHECK_KYT, { params });
    },
    refetchInterval: REFETCH_INTERVAL,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default useKytResult;
