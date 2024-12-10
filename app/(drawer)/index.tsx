import React from 'react';
import { Stack } from 'expo-router';
import { Container } from '~/components/Container';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TaskList() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <Container>
        <Text>Tasks</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tasks)/create-task')}
          style={{
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Add Task</Text>
        </TouchableOpacity>
      </Container>
    </>
  );
}
