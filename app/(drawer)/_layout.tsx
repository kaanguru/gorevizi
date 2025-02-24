// app\(drawer)\_layout.tsx
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';
import { useInitializationContext } from '~/components/GluestackModeWrapper';
import { Spinner } from '~/components/ui/spinner';
import { useSessionContext } from '~/context/AuthenticationContext';

const DrawerLayout = () => {
  const { session, isLoading } = useSessionContext();
  const { initialized } = useInitializationContext(); // Use the context

  if (isLoading || !initialized) {
    return (
      <View className="flex-1 justify-center">
        <Spinner size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <DrawerMenuAndScreens />;
};

export default DrawerLayout;
