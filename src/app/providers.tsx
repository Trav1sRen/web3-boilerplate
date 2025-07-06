import queryClient from '@/lib/query/queryClient';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
