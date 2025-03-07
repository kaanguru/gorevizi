import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '~/components/ui/form-control';
import { Input, InputField } from '~/components/ui/input';
import { useAuth } from '~/utils/auth/auth';

export default function Register() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPass, setIsInvalidPass] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }
    setLoading(true);
    if (email.length < 5 || !email.includes('@')) {
      setIsInvalidEmail(true);
      setLoading(false);
      return;
    } else if (password.length < 8) {
      setIsInvalidPass(true);
      setLoading(false);
      return;
    } else {
      setIsInvalidEmail(false);
      setIsInvalidPass(false);
      try {
        const result = await signUpWithEmail(email, password);
        if (result?.error) {
          Alert.alert('Register Failed', result.error.message);
        } else {
          router.push('/login' as Href);
        }
      } catch (error) {
        console.error('An error occurred during registration:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-background-light px-5 pt-12 dark:bg-background-dark">
      <LogoPortrait height={200} width={75} />
      <Text className="mb-8 text-2xl font-bold text-typography-black dark:text-typography-white">
        Create Account
      </Text>
      {loading && <ActivityIndicator />}

      <View className="space-y-4">
        <FormControl isInvalid={isInvalidEmail} size="md" isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText className={styles.text}>Email</FormControlLabelText>
          </FormControlLabel>
          <Input className="mb-7 mt-1" size="lg">
            <InputField
              className="bg-background-light py-3"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>Must be an email address</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <View>
          <FormControl isInvalid={isInvalidPass} size="md" isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText className={styles.text}>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="lg">
              <InputField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>Must be at least 8 characters.</FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorText>At least 8 characters are required.</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>
        <View className="mb-8">
          <Text className={styles.text}>Confirm Password</Text>
          <TextInput
            className="w-full rounded-lg border border-primary-400 bg-background-light px-4 py-3"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Button size="md" disabled={loading} className={styles.button} onPress={handleRegister}>
          <ButtonText className={styles.buttonText}>Register</ButtonText>
        </Button>

        <Button size="sm" className={styles.button} onPress={() => router.push('/login')}>
          <ButtonText className={styles.buttonText}>Already have an account? Login</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = {
  button: 'mt-8 bg-background-dark dark:bg-background-light rounded ',
  buttonText: 'text-center text-typography-white dark:text-typography-black',
  text: 'mb-2 text-typography-black dark:text-typography-white',
};
