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
import { DraggableTaskItem } from '~/components/DraggableTaskItem';

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Readonly<Tables<'tasks'>[]>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<number[]>([]);

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
  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
  }, []);
  const handleDragEnd = useCallback(
    (index: number, translationY: number) => {
      const itemHeight = 60; // Match ITEM_HEIGHT from DraggableTaskItem
      const newIndex = Math.round(index + translationY / itemHeight);

      if (newIndex < 0 || newIndex >= tasks.length) {
        setDraggingIndex(null);
        return;
      }

      const newPositions = [...positions];
      [newPositions[index], newPositions[newIndex]] = [newPositions[newIndex], newPositions[index]];

      setPositions(newPositions);
      setDraggingIndex(null);

      const updatedTasks = tasks.map((task, i) => ({
        ...task,
        position: newPositions[i],
      }));

      setTasks(updatedTasks);

      // Batch update to reduce database calls
      void supabase.from('tasks').upsert(updatedTasks);
    },
    [positions, tasks]
  );
  useFocusEffect(
    useCallback(() => {
      fetchTasks().then(() => {
        setPositions(tasks.map((_, index) => index));
      });
    }, [fetchTasks])
  );
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );
  const onUpdate = () => {};

  const onRemove = () => {};

  const renderTaskItem = useCallback(
    (props: Readonly<{ item: Tables<'tasks'>; index: number }>) => (
      <DraggableTaskItem
        task={props.item}
        index={props.item.position ?? 0}
        onTaskUpdate={fetchTasks}
        onUpdate={onUpdate}
        onRemove={onRemove}
        isDragging={draggingIndex === props.index}
        key={`${props.item.id}`}
        position={positions[props.index] || props.index}
        onDragStart={() => handleDragStart(props.index)}
        onDragEnd={(translationY) => handleDragEnd(props.index, translationY)}
      />
    ),
    [fetchTasks]
  );

  return (
    <Container>
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
              paddingBottom: 80, // Add space for FAB
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
    </Container>
  );
}
