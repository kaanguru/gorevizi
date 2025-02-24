// app/_layout.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext } from 'react';

import '@/global.css';

import GluestackModeWrapper from '~/components/GluestackModeWrapper';
import { ThemeProvider, useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { SessionProvider, useSessionContext } from '~/context/AuthenticationContext';

SplashScreen.preventAutoHideAsync();

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
