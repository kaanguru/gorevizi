import React, { useCallback, useState } from 'react';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Container } from '~/components/Container';
import { Box } from '~/components/ui/box';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '~/components/ui/icon';
import { supabase } from '~/utils/supabase';
import { FlatList } from 'react-native';
import { Tables } from '~/database.types';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/TaskItem';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Readonly<Tables<'tasks'>[]>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);

    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data ?? []);
    }

    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const renderTaskItem = useCallback(
    (props: Readonly<{ item: Tables<'tasks'> }>) => (
      <TaskItem task={props.item} onTaskUpdate={fetchTasks} />
    ),
    [fetchTasks]
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
            contentContainerStyle={{ gap: 9 }}
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
