interface IGetKytResultParams {
  direction: string;
  hash: string;
  to: string;
  from?: string;
}

interface IGetKytResultResp {
  progress: number;
  riskLevel: string;
  status: 'DOING' | 'DONE';
  timeout: boolean;
}

interface ICheckWalletParams {
  fromWallet: string;
  network: string;
  token: string;
}

interface ICheckWalletResp {
  isValid: boolean;
}

interface IConnectTransferParams {
  fromWallet: string;
  fromWalletIcon: string;
  fromWalletType: string;
  network: string;
  token: string;
}

interface IConnectTransferResp {
  chainId: string;
  progress: number;
  riskLevel: string;
  timeoutFlag: boolean;
  toWallet: string;
  tokenAddress: string;
}
