import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppGlobalState {
  isWalletValid: boolean;
  setIsWalletValid: (bool: boolean) => void;

  transferDetails: IConnectTransferResp;
  setTransferDetails: (details: IConnectTransferResp) => void;

  transferAmount: string;
  setTransferAmount: (amount: string) => void;
}

export const useAppGlobalStore = create<AppGlobalState>()(
  immer((set) => ({
    isWalletValid: false,
    setIsWalletValid: (bool) =>
      set((state: AppGlobalState) => {
        state.isWalletValid = bool;
      }),

    transferDetails: {} as IConnectTransferResp,
    setTransferDetails: (details) =>
      set((state: AppGlobalState) => {
        state.transferDetails = details;
      }),

    transferAmount: '',
    setTransferAmount: (amount) =>
      set((state: AppGlobalState) => {
        state.transferAmount = amount;
      }),
  }))
);
