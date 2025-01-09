import React, { useCallback, useEffect, useState } from 'react';
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
import reOrder from '~/utils/reOrder';
import { Task } from '~/types';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ReadonlyArray<Task>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true, nullsFirst: true });

      error ? console.error('Error fetching tasks:', error.message) : setTasks(data ?? []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const updateTaskPositions = async (tasks: ReadonlyArray<Tables<'tasks'>>) => {
    try {
      const updates = tasks.map((task, index) =>
        supabase.from('tasks').update({ position: index }).eq('id', task.id)
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Error updating task positions:', error);
    }
  };

  const handleReorder = async (from: number, to: number) => {
    const mutableTasks = [...tasks];
    const reorderedTasks = reOrder(from, to, mutableTasks);
    setTasks(reorderedTasks);
    await updateTaskPositions(reorderedTasks);
  };

  const handleToggleComplete = async (taskId: number, isComplete: boolean): Promise<void> => {
    try {
      await supabase.from('tasks').update({ is_complete: isComplete }).eq('id', taskId);
      await fetchTasks();
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
    ({ item, index }: Readonly<{ item: Tables<'tasks'>; index: number }>) => (
      <TaskItem
        task={item}
        index={index}
        onTaskUpdate={fetchTasks}
        onReorder={handleReorder}
        onToggleComplete={handleToggleComplete}
      />
    ),
    [fetchTasks, handleReorder, handleToggleComplete]
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
            contentContainerStyle={{
              gap: 16,
              padding: 16,
              paddingBottom: 80,
            }}
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
