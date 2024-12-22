import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Spinner } from '~/components/ui/spinner';

const SignOut = () => {
  const router = useRouter();
  useEffect(() => {
    router.navigate('/(auth)/login');
  }, [router]);

  return <Spinner size={'large'} />;
};

export default SignOut;
