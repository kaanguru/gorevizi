import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React, { useEffect, useState } from 'react';
import { Href, useRouter, useSegments } from 'expo-router';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { Text } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '~/utils/supabase';
import { useAuth } from '../utils/auth';
import { View } from 'react-native';

export const unstable_settings = {
  // Ensure that reloading keeps a back button present.
  initialRouteName: '(tasks)',
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
      try {
        await supabase;
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
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
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
  );
}
