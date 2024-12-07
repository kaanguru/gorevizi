import { Image } from 'expo-image';
import { View, Text } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

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
      <View className="mb-4">
        <Image
          source={require('../../assets/adaptive-icon.png')}
          className="h-32 w-32"
          contentFit="contain"
        />
      </View>
      <Text className="text-navy-800 text-3xl font-bold">GoRevIzi</Text>
    </View>
  );
}
