// app\(drawer)\_layout.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';
import { useSession } from '~/hooks/useSession';

const DrawerLayout = () => {
  const { data: session, isLoading, isError, isFetched } = useSession();

  useEffect(() => {
    if (!isLoading && isFetched && (isError || !session)) {
      router.replace('/(auth)/login');
    }
  }, [session, isLoading, isError, isFetched, router]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (session) {
    return <DrawerMenuAndScreens />;
  }

  return null;
};

export default DrawerLayout;
