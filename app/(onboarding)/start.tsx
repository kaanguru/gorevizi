import { useRouter } from 'expo-router';
import { View } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import { Button, ButtonText } from '~/components/ui/button';

export default function StartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background-light px-5 dark:bg-background-dark">
      <LogoPortrait />

      <View className="w-full space-y-10">
        <Button
          className=" my-5 w-full rounded-lg border bg-background-light dark:bg-background-dark"
          onPress={() => router.push('/register')}>
          <ButtonText className="text-navy-800 text-center font-semibold text-typography-black dark:text-typography-white">
            Register
          </ButtonText>
        </Button>

        <Button
          className=" w-full rounded-lg border bg-background-primary"
          onPress={() => router.push('/login')}>
          <ButtonText className="text-navy-800 text-center text-base font-semibold">
            Login
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
