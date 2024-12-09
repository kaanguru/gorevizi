import React from 'react';
import { Stack } from 'expo-router';
import { Container } from '~/components/Container';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TaskList() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <Container>
        <Text>Tasks</Text>
      </Container>
    </>
  );
}
