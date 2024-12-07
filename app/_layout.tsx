import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '~/utils/auth';
import React, { useEffect, useState } from 'react';
import { Href, useRouter, useSegments } from 'expo-router';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { Text } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';
import { View } from 'react-native';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

/**
 * The top-level layout component that wraps the entire app.
 *
 * It waits for supabase to be initialized and then checks if it's the user's first visit.
 * If it is, it redirects to the onboarding flow.
 *
 * @returns The root layout component.
 */
export default function RootLayout() {
  const [isSupabaseInitialized, setSupabaseInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const initializeSupabase = async () => {
      await supabase;
      setSupabaseInitialized(true);
    };
    initializeSupabase();
  }, []);

  useEffect(() => {
    if (!isSupabaseInitialized) return;

    const checkAndRedirect = async () => {
      const isFirst = await isFirstVisit();

      // If it's first visit and not already in onboarding
      if (isFirst && !segments[0]?.includes('onboarding')) {
        router.replace('/(onboarding)/splash' as Href);
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
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
