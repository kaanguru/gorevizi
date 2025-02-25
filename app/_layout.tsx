import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/global.css';

import GluestackModeWrapper from '~/components/GluestackModeWrapper';
import { ThemeProvider } from '~/components/ui/ThemeProvider/ThemeProvider';
import { SessionProvider } from '~/context/AuthenticationContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>
          <GluestackModeWrapper />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
