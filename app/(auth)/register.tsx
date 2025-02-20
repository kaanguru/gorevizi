import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '~/utils/auth/auth';
import LogoPortrait from '~/components/lotties/LogoPortrait';

export default function Register() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }
    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password);
      if (result?.error) {
        Alert.alert('Register Failed', result.error.message);
      } else {
        router.push('/(auth)/login' as Href);
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-light px-5 pt-12 dark:bg-background-dark">
      <LogoPortrait height={300} width={110} />
      <Text className="mb-8 text-2xl font-bold text-typography-black dark:text-typography-white">
        Create Account
      </Text>
      {loading && <ActivityIndicator />}

      <View className="space-y-4">
        <View>
          <Text className={styles.text}>Email</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-400 bg-background-light px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className={styles.text}>Password</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-400  bg-background-light px-4 py-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View>
          <Text className={styles.text}>Confirm Password</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-400  bg-background-light px-4 py-3"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Pressable disabled={loading} className={styles.button} onPress={handleRegister}>
          <Text className={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable className={styles.textButton} onPress={() => router.push('/(auth)/login')}>
          <Text className="dark: text-center text-typography-white">
            Already have an account? Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  button:
    'border-primary-500 bg-background-dark dark:bg-background-light mt-6 w-full rounded-lg border py-4',
  buttonText:
    'text-center font-semibold text-white dark:text-black bg-background-dark dark:bg-background-light rounded',
  textButton: 'mt-8 bg-background-dark dark:bg-background-light rounded p-3',
  text: 'mb-2 text-typography-black dark:text-typography-white',
};
