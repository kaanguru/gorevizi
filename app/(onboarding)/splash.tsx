import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import { Box } from '~/components/ui/box';
import { Pressable } from '~/components/ui/pressable';
import { Text } from '~/components/ui/text';
export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/tutorial' as Href);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      <Pressable onPress={() => router.replace('/(onboarding)/tutorial' as Href)}>
        <LogoPortrait />
      </Pressable>
      <Text size="5xl" className="m-3 p-3 font-delaGothicOne">
        GorevIzi
      </Text>
    </Box>
  );
}
