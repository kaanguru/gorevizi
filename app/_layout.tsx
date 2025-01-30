import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React, { useEffect, useState } from 'react';
import { Href, useRouter, useSegments } from 'expo-router';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { Text } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '~/utils/auth/supabase';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60_000, // Prevent over-fetching
    },
  },
});
export default function RootLayout() {
  const [isSupabaseInitialized, setSupabaseInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
