import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // TODO: Implement registration logic
    console.log('Register with:', { email, password });
  };

  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <Text className="text-navy-800 mb-8 text-2xl font-bold">Create Account</Text>

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

        <Pressable
          className="border-navy-800 bg-navy-800 mt-4 w-full rounded-lg border py-4"
          onPress={handleRegister}>
          <Text className="text-center font-semibold text-black">Register</Text>
        </Pressable>

        <Pressable className="mt-4" onPress={() => router.push('/(auth)/login')}>
          <Text className="text-navy-800 text-center">Already have an account? Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
