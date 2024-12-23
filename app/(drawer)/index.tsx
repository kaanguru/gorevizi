import React, { useCallback } from 'react';
import { Stack, useFocusEffect } from 'expo-router';
import { Container } from '~/components/Container';
import { useRouter } from 'expo-router';
import { Box } from '~/components/ui/box';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '~/components/ui/icon';
import { useState } from 'react';
import { supabase } from '~/utils/supabase';
import { FlatList } from 'react-native';
import { Tables } from '~/database.types';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/TaskItem';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const renderTaskItem = useCallback(
    ({ item }: Readonly<{ item: Tables<'tasks'> }>) => <TaskItem task={item} />,
    []
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <Container>
        {isLoading ? (
          <Box className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </Box>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <Fab
          size="md"
          className="absolute bottom-5 right-5"
          onPress={() => router.push('/(tasks)/create-task')}>
          <FabIcon as={AddIcon} color="white" />
          <FabLabel> Add Task </FabLabel>
        </Fab>
      </Container>
    </>
  );
}
