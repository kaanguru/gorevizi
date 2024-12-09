import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '~/utils/auth';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUpWithEmail } = useAuth();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }
    const result = await signUpWithEmail(email, password);
    if (result?.error) {
      Alert.alert('Register Failed', result.error.message);
    } else {
      router.push('/(auth)/login' as Href);
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <Text className="text-navy-800 mb-8 text-2xl font-bold">Create Account</Text>
      <View>{loading && <ActivityIndicator />}</View>
      <View className="space-y-4">
        <View>
          <Text className="text-navy-800 mb-2">Email</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-navy-800 mb-2">Password</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View>
          <Text className="text-navy-800 mb-2">Confirm Password</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
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
          <Text className="text-navy-800 text-center">Already have an account? Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = {
  button: 'border-navy-800 bg-navy-800 mt-4 w-full rounded-lg border py-4',
  buttonText: 'text-center font-semibold text-black',
  textButton: 'mt-8 bg-slate-50 p-3',
};
