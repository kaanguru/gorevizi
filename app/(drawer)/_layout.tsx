// app\(drawer)\_layout.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';
import { useSession } from '~/hooks/useSession';

const DrawerLayout = () => {
  const { data: session, isPending, isError, isSuccess } = useSession();

  useEffect(() => {
    if ((!isPending && isError) || !session) {
      router.replace('/(auth)/login');
    }
  }, [isPending, isError, session, router]);

  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isSuccess || session) {
    return <DrawerMenuAndScreens />;
  }
};

export default DrawerLayout;
