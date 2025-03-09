import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isRunningInExpoGo } from 'expo';
import { useNavigationContainerRef } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import '@/global.css';

import GluestackModeWrapper from '~/components/GluestackModeWrapper';
import ThemeProvider from '~/components/ui/ThemeProvider/ThemeProvider';
import SessionProvider from '~/context/AuthenticationContext';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
Sentry.init({
  dsn: 'https://e521762f4a2f9df73ba107839ee47bd6@o4508883408846848.ingest.de.sentry.io/4508883745964112',
  debug: true,
  tracesSampleRate: 1,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const refNav = useNavigationContainerRef();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Wait for navigation container to be ready
  useEffect(() => {
    if (refNav?.current) {
      navigationIntegration.registerNavigationContainer(refNav);
      setIsNavigationReady(true);
    }
  }, [refNav]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {isNavigationReady ? (
          <SessionProvider>
            <GluestackModeWrapper />
          </SessionProvider>
        ) : (
          <View style={{ flex: 1, backgroundColor: '#FFFAEB' }} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
