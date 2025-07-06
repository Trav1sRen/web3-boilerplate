export const AUTH_API = {
  ENDPOINTS: {
    LOGIN: '/auth/login',
    USER_PROFILE: (id: string) => `/users/${id}`,
  },
  QUERY_KEYS: {
    LOGIN: 'auth',
    USER_PROFILE: (id: string) => `user-${id}`,
  },
} as const;
