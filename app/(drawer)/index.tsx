import React from 'react';
import { Stack } from 'expo-router';
import { Container } from '~/components/Container';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Box } from '~/components/ui/box';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '~/components/ui/icon';
import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { FlatList } from 'react-native';
import { Tables } from '~/database.types';
export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      setTasks(data || []);
    };
    fetchTasks();
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <Container>
        <Text>Tasks</Text>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <Box>
              <Text>{item.title}</Text>
            </Box>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
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
