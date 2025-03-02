import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import { useSessionContext } from '~/context/AuthenticationContext';
import { resetFirstVisit } from '~/utils/isFirstVisit';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const { signIn } = useSessionContext();

  const handleLogin = async function () {
    try {
      await signIn(email, password);
      router.replace('/');
    } catch (err: any) {
      console.error(err.message || 'An error occurred during login.');
    }
  };

  return (
    <View className="flex-1 bg-background-light px-5 pt-12 dark:bg-background-dark">
      <LogoPortrait height={300} width={110} />

      <Text className="mb-8 text-2xl font-bold text-typography-black dark:text-typography-white">
        Welcome Back
      </Text>
      {loading && <ActivityIndicator />}

      <View className="space-y-4">
        <View>
          <Text className="mb-2 text-typography-900">Email</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-800 bg-background-light px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="mb-2 text-typography-900">Password</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-800 bg-background-light px-4 py-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Button
          size="lg"
          disabled={loading}
          className={styles.registerButton}
          onPress={handleLogin}>
          <ButtonText className={styles.buttonText}>Login</ButtonText>
        </Button>

        <Button
          size="sm"
          className={styles.registerButton}
          onPress={() => router.push('/register')}>
          <ButtonText className={styles.buttonText}>Don't have an account? Register</ButtonText>
        </Button>

        {/*  <Button size="sm" className={styles.registerButton} onPress={resetFirstVisit}>
          <ButtonText className={styles.buttonText}>R-F-W</ButtonText>
        </Button> */}
      </View>
    </View>
  );
}

const styles = {
  registerButton: 'mt-8 bg-background-dark dark:bg-background-light rounded ',
  buttonText: ' text-center text-typography-white dark:text-typography-black',
};
