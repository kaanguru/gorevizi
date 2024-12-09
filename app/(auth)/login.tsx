import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { resetFirstVisit } from '~/utils/isFirstVisit';
import { useAuth } from '~/utils/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);

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
              // Force a small delay to ensure AsyncStorage is updated
              await new Promise((resolve) => setTimeout(resolve, 1000));
              router.replace('/(onboarding)/splash' as Href);
            } catch (error) {
              console.error('Error resetting first visit:', error);
              Alert.alert('Error', 'Failed to reset onboarding flow');
            }
          },
        },
      ]
    );
  };
  const handleLogin = async () => {
    const result = await signInWithEmail(email, password);
    if (result?.error) {
      Alert.alert('Login Failed', result.error.message);
    } else {
      router.replace('/' as Href);
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <Text className="mb-8 text-2xl font-bold text-black">Welcome Back</Text>
      <View>{loading && <ActivityIndicator />}</View>

      <View className="space-y-4">
        <View>
          <Text className="mb-2 text-black">Email</Text>
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
          <Text className="mb-2 text-black">Password</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-black py-4"
          onPress={handleLogin}>
          <Text className="text-center font-semibold text-black">Login</Text>
        </Pressable>

        <Pressable className="mt-4" onPress={() => router.push('/(auth)/register')}>
          <Text className="text-center text-black">Don't have an account? Register</Text>
        </Pressable>
        <Pressable className="mt-8 rounded-lg bg-red-500 px-4 py-3" onPress={handleResetFirstVisit}>
          <Text className="text-center text-base font-semibold text-white">
            Reset Onboarding Flow
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
