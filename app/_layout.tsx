import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isRunningInExpoGo } from 'expo';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';

import '@/global.css';

import GluestackModeWrapper from '~/components/GluestackModeWrapper';
import { ThemeProvider } from '~/components/ui/ThemeProvider/ThemeProvider';
import { SessionProvider } from '~/context/AuthenticationContext';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
Sentry.init({
  dsn: 'https://e521762f4a2f9df73ba107839ee47bd6@o4508883408846848.ingest.de.sentry.io/4508883745964112',

  debug: false,
  tracesSampleRate: 0.51,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

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
