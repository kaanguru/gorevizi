import { DelaGothicOne_400Regular, useFonts } from '@expo-google-fonts/dela-gothic-one';
import { Inter_900Black } from '@expo-google-fonts/inter';
import { Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { UbuntuMono_400Regular } from '@expo-google-fonts/ubuntu-mono';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, Href, router, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/global.css';

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider';
import { Spinner } from '~/components/ui/spinner';
import { ThemeProvider, useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { useUpdateHealthAndHappiness } from '~/hooks/useHealthAndHappinessMutations';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import useTasksQuery from '~/hooks/useTasksQueries';
import { useUser } from '~/hooks/useUser';
import { SoundProvider } from '~/store/SoundContext';
import { Task } from '~/types';
import genRandomInt from '~/utils/genRandomInt';
import { isFirstLaunchToday } from '~/utils/isFirstLaunchToday';
import { isFirstVisit } from '~/utils/isFirstVisit';
import { supabase } from '~/utils/supabase';
import resetRecurringTasks from '~/utils/tasks/resetRecurringTasks';
import wasTaskDueYesterday from '~/utils/tasks/wasTaskDueYesterday';

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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
          setTimeout(() => {
            router.replace('/(onboarding)/splash' as Href);
          }, 50);
        }
      } catch (error) {
        console.error('Failed to check first visit:', error);
      }
    };

    checkAndRedirect();
  }, [segments, isSupabaseInitialized]);

  if (!isSupabaseInitialized || (!fontsLoaded && !fontError)) {
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
  const { data: notCompletedTasks } = useTasksQuery();
  const { data: user } = useUser();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);
  const { mutate: updateHealthAndHappiness } = useUpdateHealthAndHappiness();

  useEffect(() => {
    async function checkAndResetTasks() {
      try {
        const isFirstLaunchTodayResult = await isFirstLaunchToday();
        if (!isFirstLaunchTodayResult) return;

        const incompleteTasksFromYesterday = getIncompleteTasksFromYesterday();
        handleTaskOutcome(incompleteTasksFromYesterday);
        await resetRecurringTasks();
      } catch (error) {
        console.error('Error initializing tasks:', error);
      }
    }

    function getIncompleteTasksFromYesterday() {
      return notCompletedTasks?.filter(wasTaskDueYesterday) || [];
    }

    function handleTaskOutcome(tasks: Task[]) {
      if (tasks.length === 0) {
        Alert.alert('Well done, no tasks from yesterday!');
        return;
      }
      const punishmentCount = tasks.length;
      updateHealthAndHappiness({
        user_id: user?.id,
        health: (healthAndHappiness?.health ?? 0) - genRandomInt(16, 24) * punishmentCount,
        happiness: (healthAndHappiness?.happiness ?? 0) - genRandomInt(16, 24) * punishmentCount,
      });
      router.push('/(tasks)/tasks-of-yesterday' as Href);
    }
    checkAndResetTasks();
  }, []);

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
