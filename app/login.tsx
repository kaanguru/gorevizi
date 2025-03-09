import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

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
import { useSessionContext } from '~/context/AuthenticationContext';
// import { resetFirstVisit } from '~/utils/isFirstVisit';

export default function Login() {
  const router = useRouter();
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPass, setIsInvalidPass] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const { signIn, authError } = useSessionContext();

  const handleLogin = async function () {
    if (email.length < 5 || !email.includes('@')) {
      setIsInvalidEmail(true);
      return;
    } else if (password.length < 8) {
      setIsInvalidPass(true);
      return;
    } else {
      setIsInvalidEmail(false);
      setIsInvalidPass(false);
      await signIn(email, password);
      setTimeout(() => {
        if (authError) {
          router.replace('/login');
        } else {
          router.replace('/');
        }
      }, 200);
    }
  };

  return (
    <View className="bg-background-light px-5 pt-12 dark:bg-background-dark">
      <LogoPortrait height={300} width={110} />

      <Text className="mb-8 mt-2 text-2xl font-bold text-typography-black dark:text-typography-white">
        Welcome Back
      </Text>
      {loading && <ActivityIndicator />}

      <View className="space-y-4">
        <FormControl isInvalid={isInvalidEmail} size="md" isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText className="mb-2 text-typography-900">Email</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="lg">
            <InputField
              className="py-3"
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
              <FormControlLabelText className="my-2 text-typography-900">
                Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="lg">
              <InputField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
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
