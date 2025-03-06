import { DelaGothicOne_400Regular, useFonts } from '@expo-google-fonts/dela-gothic-one';
import { Inter_900Black } from '@expo-google-fonts/inter';
import { Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { UbuntuMono_400Regular } from '@expo-google-fonts/ubuntu-mono';
import { Stack, Href, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider';
import { Spinner } from '~/components/ui/spinner';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { useSessionContext } from '~/context/AuthenticationContext';
import { SoundProvider } from '~/context/SoundContext';
import useInitializeDailyTasks from '~/hooks/useInitializeDailyTasks';
import { isFirstLaunchToday } from '~/utils/isFirstLaunchToday';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { supabase } from '~/utils/supabase';

const InitializationContext = createContext<
  Readonly<{
    initialized: boolean;
    hasTasksFromYesterday: boolean;
  }>
>({
  initialized: false,
  hasTasksFromYesterday: false,
});

export const useInitializationContext = () => useContext(InitializationContext);
SplashScreen.preventAutoHideAsync();

export default function GluestackModeWrapper() {
  const { theme } = useTheme();
  const [fontsLoaded, fontError] = useFonts({
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
  const { session, isLoading: sessionLoading } = useSessionContext();
  const { initialized, hasTasksFromYesterday } = useInitializeDailyTasks();

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        supabase; // Ensure supabase is initialized
        setSupabaseInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
      }
    };
    initializeSupabase();
  }, []);
  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
      // Proceed without custom fonts
      SplashScreen.hideAsync();
    }
  }, [fontError]);

  useEffect(() => {
    if (!isSupabaseInitialized || !fontsLoaded || fontError || sessionLoading || !initialized) {
      if (fontError) {
        SplashScreen.hideAsync();
      }
      return;
    }

    const checkAndRedirect = async () => {
      try {
        const isFirstInstall = await isFirstVisit();

        if (isFirstInstall && !segments[0]?.includes('onboarding')) {
          router.replace('/(onboarding)/splash' as Href);
          return;
        }
        const isFirstToday = await isFirstLaunchToday();
        if (isFirstToday && session) {
          if (hasTasksFromYesterday) {
            router.push('/(tasks)/tasks-of-yesterday' as Href);
          } else {
            router.push('/(drawer)' as Href);
          }
        }
      } catch (error) {
        console.error('Failed to check first visit or session:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    checkAndRedirect();
  }, [
    isSupabaseInitialized,
    fontsLoaded,
    fontError,
    segments,
    session,
    initialized,
    hasTasksFromYesterday,
  ]);

  if (!isSupabaseInitialized || (!fontsLoaded && !fontError) || sessionLoading || !initialized) {
    return (
      <View className="flex-1 justify-center">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <InitializationContext.Provider value={{ initialized, hasTasksFromYesterday }}>
      <GluestackUIProvider mode={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SoundProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}>
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
    </InitializationContext.Provider>
  );
}
