import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Container } from '~/components/Container';

export default function signOut() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign Out' }} />
      <Container>
        <Text>signout</Text>
      </Container>
    </>
  );
}
