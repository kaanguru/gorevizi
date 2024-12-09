import { Stack } from 'expo-router';

export default function signOut() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign Out' }} />
    </>
  );
}
