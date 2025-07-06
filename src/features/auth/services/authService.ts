import { AUTH_API } from '@/features/auth/constants/api.constants';
import axiosClient from '@/lib/api/axiosClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosClient.post(AUTH_API.ENDPOINTS.LOGIN, credentials);
      return response.data;
    },
    mutationKey: [AUTH_API.QUERY_KEYS.LOGIN],
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: [AUTH_API.QUERY_KEYS.USER_PROFILE(userId), userId],
    queryFn: async () => {
      const response = await axiosClient.get(AUTH_API.ENDPOINTS.USER_PROFILE(userId));
      return response.data;
    },
  });
};
