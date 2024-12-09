import { Stack } from 'expo-router';
export default function signOut() {
  return (
    <>
      <Stack>
        <Stack.Screen name="Sign Out" options={{ title: 'Sign Out' }} />
      </Stack>
    </>
  );
}
