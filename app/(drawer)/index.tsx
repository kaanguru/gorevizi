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
  const changePosition = async (from: number, to: number): Promise<void> => {
    console.log('🚀 ~ file: index.tsx:37 ~ from: ' + from + ' to: ' + to);

    // 1. Fetch the current tasks from the database
    await fetchTasks();

    console.log(
      'orginal tasks order',
      tasks.map((t) => t.id)
    );
    const reorderedTasks: Task[] = reOrder(from, to, tasks);

    console.log(
      '🚀reorderedTasks:',
      reorderedTasks.map((t) => t.id)
    );
    // 3. Assign new position values
    const updatedTasks = reorderedTasks.map((task, index) => {
      const newPosition: number | null = index > 0 ? index * 2 : null; // Use ternary operator for concise assignment

      return { ...task, position: newPosition };
    });

    // 4. Update the database with the new positions
    try {
      const updates = updatedTasks
        .filter((task, index) => task.position !== tasks[index].position) // Only update if position changed
        .map((task) => ({
          id: task.id,
          title: task.title,
          position: task.position,
        })); // Map to the correct format

      if (updates.length > 0) {
        const { error: updateError } = await supabase.from('tasks').upsert(updates); // Upsert the updates array

        if (updateError) {
          console.error('Error updating task positions:', updateError);
        } else {
          console.log('Task positions updated successfully');
          fetchTasks();
        }
      }
    } catch (error) {
      console.error('Error updating task positions:', error);
    }
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
