export const WALLET_API = {
  ENDPOINTS: {
    CHECK_KYT: '/walletx/kyt/transfer',
    CHECK_WALLET: '/walletx/checkout/check',
    CONNECT_TRANSFER: '/walletx/checkout/connect',
  },
  QUERY_KEYS: {
    CHECK_KYT: (params: IGetKytResultParams) => JSON.stringify(params),
    CHECK_WALLET: (params: ICheckWalletParams) => JSON.stringify(params),
    CONNECT_TRANSFER: (params: IConnectTransferParams) => JSON.stringify(params),
  },
} as const;

export const REFETCH_INTERVAL = 500;
