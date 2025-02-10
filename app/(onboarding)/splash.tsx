import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import LogoPortrait from '~/components/lotties/LogoPortrait';
// import { useFonts, DelaGothicOne_400Regular } from '@expo-google-fonts/dela-gothic-one';

export default function SplashScreen() {
  /*
  const router = useRouter();

     useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/tutorial' as Href);
    }, 7000);

    return () => clearTimeout(timer);
  }, []); */

  return (
    <Box className="flex-1 items-center justify-center bg-background-0">
      <LogoPortrait />
      <Text size="6xl" className="font-DelaGothicOne  m-5">
        GorevIzi
      </Text>
    </Box>
  );
}
