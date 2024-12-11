import React from 'react';
import { Stack } from 'expo-router';
import { Container } from '~/components/Container';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '~/components/ui/box';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '~/components/ui/icon';
export default function TaskList() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <Container>
        <Text>Tasks</Text>
        <Box className="absolute bottom-5 right-5 bg-background-50">
          <Fab
            size="md"
            onPress={() => router.push('/(tasks)/create-task')}
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={false}>
            <FabIcon as={AddIcon} />
            <FabLabel>Add Task</FabLabel>
          </Fab>
        </Box>
      </Container>
    </>
  );
}
