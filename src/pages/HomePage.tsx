import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDynamicChain } from '@/providers/MultiChainProvider';
import type { ChainType } from '@/types/chain';
import { useEffect, useMemo } from 'react';

interface IChainItem {
  value: ChainType;
  label: React.ReactNode;
}

export default function HomePage() {
  const {
    chainType,
    setChainType,
    account: { status, address },
    connect,
    disconnect,
    network: { caipNetwork, switchNetwork },
  } = useDynamicChain();
  const chains = useMemo<IChainItem[]>(
    () => [
      { value: 'eth', label: 'Ethereum' },
      { value: 'sol', label: 'Solana' },
      { value: 'tron', label: 'Tron' },
    ],
    []
  );
  const isConnected = useMemo(() => status === 'connected', [status]);

  useEffect(() => {
    if (chainType) {
      switchNetwork();
    }

    // Disconnect from current account when chain is switched
    if (isConnected) {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainType]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-[300px] flex-col gap-4">
        <p className="text-sm">Status: [{status || 'disconnected'}]</p>
        <p className="text-sm">Network: {caipNetwork?.name}</p>
        <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
          Address: {address}
        </p>
        <Select value={chainType} onValueChange={(chain) => setChainType(chain as ChainType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select chain..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chains</SelectLabel>
              {chains.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex w-full justify-between">
          <Button disabled={!chainType || isConnected} onClick={connect}>
            Connect
          </Button>
          <Button variant="secondary" disabled={!isConnected} onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      </div>
    </main>
  );
}
