import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import React, { createContext, useContext, useState } from 'react';

interface ISolanaContext {
  balance: number;
  fetchBalance: () => Promise<void>;
  sendPayment: (recipientAddress: string, amountInSol: number) => Promise<string>;
  callContract: (programId: string, instructionData: Buffer) => Promise<string>;
  transactionStatus: string;
  error: string;
  clearStatus: () => void;
  publicKey: string;
  isConnected: boolean;
}

const SolanaContext = createContext<Nullable<ISolanaContext>>(null);

interface SolanaProviderProps {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [balance, setBalance] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [error, setError] = useState('');

  // 获取余额
  const fetchBalance = async () => {
    if (!publicKey || !connection) {
      setBalance(0);
      return;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL); // 转换为SOL
    } catch (err) {
      setError('Failed to fetch balance');
      console.error(err);
    }
  };

  // 发送普通支付
  const sendPayment = async (recipientAddress: string, amountInSol: number): Promise<string> => {
    if (!publicKey || !connection) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    try {
      setTransactionStatus('Processing');

      const recipientPublicKey = new PublicKey(recipientAddress);
      const amountInLamports = amountInSol * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: amountInLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTransactionStatus('Confirmed');
      await fetchBalance(); // 更新余额
      return signature;
    } catch (err) {
      setError('Payment failed');
      setTransactionStatus('Failed');
      console.error(err);
      throw err;
    }
  };

  // 调用智能合约
  const callContract = async (programId: string, instructionData: Buffer): Promise<string> => {
    if (!publicKey || !connection) {
      setError('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    try {
      setTransactionStatus('Processing');

      const programPublicKey = new PublicKey(programId);
      const transaction = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
          programId: programPublicKey,
          data: instructionData,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTransactionStatus('Confirmed');
      await fetchBalance(); // 更新余额
      return signature;
    } catch (err) {
      setError('Contract call failed');
      setTransactionStatus('Failed');
      console.error(err);
      throw err;
    }
  };

  // 清空状态
  const clearStatus = () => {
    setTransactionStatus('');
    setError('');
  };

  return (
    <SolanaContext.Provider
      value={{
        balance,
        fetchBalance,
        sendPayment,
        callContract,
        transactionStatus,
        error,
        clearStatus,
        publicKey: publicKey ? publicKey.toString() : '',
        isConnected: !!publicKey,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = (): ISolanaContext => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};
