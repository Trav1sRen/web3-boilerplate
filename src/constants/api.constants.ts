export const WALLET_API = {
  ENDPOINTS: {
    CHECK_WALLET: '/walletx/checkout/check',
  },
  QUERY_KEYS: {
    CHECK_WALLET: (params: ICheckWalletParams) => JSON.stringify(params),
  },
} as const;

export const TRANSFER_API = {
  ENDPOINTS: {
    CHECK_KYT: '/walletx/kyt/transfer',
    CONNECT_TRANSFER: '/walletx/checkout/connect',
  },
  QUERY_KEYS: {
    CHECK_KYT: (params: IGetKytResultParams) => JSON.stringify(params),
    CONNECT_TRANSFER: (params: IConnectTransferParams) => JSON.stringify(params),
  },
} as const;

export const REFETCH_INTERVAL = 500;
