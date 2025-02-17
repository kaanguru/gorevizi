import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React, { useEffect, useState } from 'react';
import { Href, useRouter, useSegments } from 'expo-router';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { isFirstLaunchToday } from '~/utils/isFirstLaunchToday';
import resetRecurringTasks from '~/utils/tasks/resetRecurringTasks';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spinner } from '~/components/ui/spinner';
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { DelaGothicOne_400Regular } from '@expo-google-fonts/dela-gothic-one';
import { UbuntuMono_400Regular } from '@expo-google-fonts/ubuntu-mono';
import { Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import * as SplashScreen from 'expo-splash-screen';
import { SoundProvider } from '~/store/SoundContext';
import { ThemeProvider, useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60_000,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_900Black,
    DelaGothicOne_400Regular,
    UbuntuMono_400Regular,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  const [isSupabaseInitialized, setSupabaseInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  useEffect(() => {
    async function checkAndResetTasks() {
      try {
        const isFirstToday = await isFirstLaunchToday();
        if (isFirstToday) {
          await resetRecurringTasks();
        }
      } catch (error) {
        console.error('Error initializing tasks:', error);
      }
    }

    checkAndResetTasks();
  }, []);
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        supabase;
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
      }
    };
    initializeSupabase();
  }, []);

  useEffect(() => {
    if (!isSupabaseInitialized) return;

    const checkAndRedirect = async () => {
      try {
        const isFirst = await isFirstVisit();

        // If it's first visit and not already in onboarding
        if (isFirst && !segments[0]?.includes('onboarding')) {
          router.replace('/(onboarding)/splash' as Href);
        }
      } catch (error) {
        console.error('Failed to check first visit:', error);
      }
    };

    checkAndRedirect();
  }, [segments, isSupabaseInitialized]);

  if (!isSupabaseInitialized) {
    return (
      <View className="flex-1 justify-center">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GluestackModeWrapper />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function GluestackModeWrapper() {
  const { theme } = useTheme();

  return (
    <GluestackUIProvider mode={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SoundProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen
              name="(onboarding)"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </Stack>
        </SoundProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
