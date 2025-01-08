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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true, nullsFirst: true });
      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const updateTaskPositions = async (tasks: Tables<'tasks'>[]) => {
    try {
      const updates = tasks.map((task, index) =>
        supabase.from('tasks').update({ position: index }).eq('id', task.id)
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Error updating task positions:', error);
    }
  };
  const changePosition = async (from: number, to: number) => {
    await fetchTasks(); // Fetch the latest tasks before reordering

    const updatePositions = async () => {
      try {
        console.log('🚀 ~ file: index.tsx:50 ~ from: ' + from + ' to ' + to);
        console.log(
          '🚀 orginalTasks:',
          tasks.map((t) => t.id)
        );
        // Reorder the tasks locally
        const reorderedTasks = reOrder(from, to, tasks);
        console.log(
          '🚀 reorderedTasks:',
          reorderedTasks.map((t) => t.id)
        );

        setTasks(reorderedTasks);

        // Update the positions in the database
        await updateTaskPositions(reorderedTasks);

        // Fetch the latest tasks from the database
        await fetchTasks(); // Directly call fetchTasks here
      } catch (error) {
        console.error('Error changing task position:', error);
      }
    };
    useEffect(() => {
      updatePositions();
    }, [tasks]);
  };
  const handleToggleComplete = async (taskid: number, is_complete: boolean): Promise<void> => {
    try {
      const {} = await supabase.from('tasks').update({ is_complete: is_complete }).eq('id', taskid);
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
        onReorder={changePosition}
        onToggleComplete={handleToggleComplete}
      />
    ),
    [fetchTasks]
  );

  const compareTasksByPosition = (
    a: Readonly<Tables<'tasks'>>,
    b: Readonly<Tables<'tasks'>>
  ): number => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return -1;
    if (b.position === null) return 1;
    return a.position - b.position;
  };

  const sortedTasks = tasks.slice().sort(compareTasksByPosition);

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
              gap: 9,
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
