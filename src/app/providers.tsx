import { AppKitProvider } from '@/providers/AppKitProvider';
import { MultiChainProvider } from '@/providers/MultiChainProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppKitProvider>
        <MultiChainProvider>{children}</MultiChainProvider>
      </AppKitProvider>
    </ThemeProvider>
  );
}
