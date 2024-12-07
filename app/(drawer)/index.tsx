import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Container } from '~/components/Container';

export default function TaskList() {
  return (
    <>
      <Stack.Screen options={{ title: 'TaskList' }} />
      <Container>
        <Text>TaskList</Text>
      </Container>
    </>
  );
}
