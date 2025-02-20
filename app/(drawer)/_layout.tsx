// app\(drawer)\_layout.tsx
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '~/hooks/useSession';
import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';

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
