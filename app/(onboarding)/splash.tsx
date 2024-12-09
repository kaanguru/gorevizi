import { View, Text } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
//@ts-ignore
import Logo from '~/assets/logo.svg';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/tutorial' as Href);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>
        <Logo width={356} height={589} />
      </Text>
    </View>
  );
}
