import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function StartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-5">
      <View className="mb-4">
        <Image
          source={require('../../assets/adaptive-icon.png')}
          className="h-32 w-32"
          contentFit="contain"
        />
      </View>
      <Text className="text-navy-800 my-11 mb-10 text-3xl font-bold">GoRevIzi</Text>

      <View className="w-full space-y-10">
        <Pressable
          className="bg-navy-800 border-navy-800 my-3 w-full rounded-lg border px-6 py-3"
          onPress={() => router.push('/(auth)/register')}>
          <Text className="text-navy-800 text-center text-base font-semibold">Register</Text>
        </Pressable>

        <Pressable
          className="border-navy-800 w-full rounded-lg border bg-white px-6 py-3"
          onPress={() => router.push('/(auth)/login')}>
          <Text className="text-navy-800 text-center text-base font-semibold">Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
