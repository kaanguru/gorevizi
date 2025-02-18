import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { resetFirstVisit } from '~/utils/isFirstVisit';
import { useAuth } from '~/utils/auth/auth';
import LogoPortrait from '~/components/lotties/LogoPortrait';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('asdfafga@ff.gg');
  const [password, setPassword] = useState('123qweasd');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();

  const handleResetFirstVisit = async () => {
    Alert.alert(
      'Reset Onboarding',
      'Are you sure you want to reset the onboarding flow? The app will restart.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetFirstVisit();
              await new Promise((resolve) => setTimeout(resolve, 200));
              router.replace('/(onboarding)/splash' as Href);
            } catch (error) {
              console.error('Error resetting first visit:', error);
            }
          },
        },
      ],
    );
  };
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result?.error) {
        Alert.alert('Login Failed', result.error.message);
      } else {
        router.replace('/' as Href);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
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

        <Pressable
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-primary-600 bg-background-dark py-4"
          onPress={handleLogin}>
          <Text className="text-center font-semibold text-typography-900">Login</Text>
        </Pressable>

        <Pressable className={styles.textButton} onPress={() => router.push('/(auth)/register')}>
          <Text className="text-center text-typography-white dark:text-typography-black">
            Don't have an account? Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = {
  smallButtonHolder: 'flex flex-col justify-end items-end',
  smallButton: `mt-80 w-1/2 bg-background-500`,
  textButton: 'mt-8 bg-background-dark dark:bg-background-light rounded p-3',
};
