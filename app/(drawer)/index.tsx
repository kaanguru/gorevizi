import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { Tables } from '~/database.types';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Container } from '~/components/Container';
import { Box } from '~/components/ui/box';
import { AddIcon } from '~/components/ui/icon';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/DraggableTaskItem';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Tables<'tasks'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: true });
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
  const changePosition = (from: number, to: number): void => {
    console.error('Function not implemented.');
  };
  const handleToggleComplete = async (taskid: number, is_complete: boolean): Promise<void> => {
    try {
      const {} = await supabase.from('tasks').update({ is_complete: is_complete }).eq('id', taskid);
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const renderTaskItem = useCallback(
    ({ item }: Readonly<{ item: Tables<'tasks'> }>) => (
      <TaskItem
        task={item}
        onTaskUpdate={fetchTasks}
        onReorder={changePosition}
        onToggleComplete={handleToggleComplete}
      />
    ),
    [fetchTasks]
  );
  // const sortedByIDTasks = [...tasks].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
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
