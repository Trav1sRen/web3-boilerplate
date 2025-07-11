import { useAppGlobalStore } from '@/app/store';
import useEthBalance from '@/hooks/transfer/eth/useEthBalance';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';

interface IUserTransferEthReturn {
  status: 'success' | 'failed' | 'idle';
  error: Error | null;
  transferEth: () => Promise<void>;
}

const useTransferEth = (): IUserTransferEthReturn => {
  const { transferDetails, transferAmount } = useAppGlobalStore();
  const [transferState, setTransferState] = useState({ status: 'idle', error: null } as Pick<
    IUserTransferEthReturn,
    'status' | 'error'
  >);
  const { ethBalance, getEthBalance } = useEthBalance();

  const transferEth = useCallback(async () => {
    // Check if amount is a positive number (Do it inside form validation?)
    const num = parseFloat(transferAmount);
    if (isNaN(num) || num <= 0) {
      setTransferState({
        status: 'failed',
        error: new Error('Invalid transfer amount. Please enter a positive number.'),
      });
    }

    // Check user balance
    await getEthBalance();
    const amount = new BigNumber(transferAmount);
    const balance = new BigNumber(ethBalance);
    if (amount.gt(balance)) {
      setTransferState({
        status: 'failed',
        error: new Error('Insufficient balance for transfer.'),
      });
    }
  }, [transferAmount, ethBalance, getEthBalance]);

  return { ...transferState, transferEth };
};

export default useTransferEth;
