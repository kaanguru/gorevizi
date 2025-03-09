// app\(drawer)\_layout.tsx
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import React from 'react';

import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';
import { useInitializationContext } from '~/components/GluestackModeWrapper';
import { useSessionContext } from '~/context/AuthenticationContext';

export default function DrawerLayout() {
  const { session, isLoading } = useSessionContext();
  const { initialized } = useInitializationContext(); // Use the context

  console.log('Is Hermes running?', typeof HermesInternal);

  if (isLoading || !initialized) {
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <DrawerMenuAndScreens />;
}
