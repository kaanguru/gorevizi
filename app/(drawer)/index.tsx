import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { Tables } from '~/database.types';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Container } from '~/components/Container';
import { Box } from '~/components/ui/box';
import { AddIcon, CalendarDaysIcon, Icon, DownloadIcon, EyeIcon } from '@/components/ui/icon';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/DraggableTaskItem';
import reOrder from '~/utils/tasks/reOrder';
import isTaskDueToday from '~/utils/tasks/isTaskDueToday';
import useTasksQueries from '~/hooks/useTasksQueries';
import { useToggleComplete } from '~/hooks/useTasksMutations';
import useUpdateTaskPositions from '~/hooks/useUpdateTaskPositions';
import { Text } from '~/components/ui/text';
import Confetti from '~/components/lotties/Confetti';
import BiriBirseyDesin from '~/components/lotties/BiriBirseyDesin';
export default function TaskList() {
  const router = useRouter();
  const [isFiltered, setIsFiltered] = useState(true);

  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasksQueries();
  const updateTaskPositionsMutation = useUpdateTaskPositions();

  const toggleComplete = useToggleComplete();
  const [showConfetti, setConfetti] = useState(false);

  const filteredTasks = useMemo(
    () => (isFiltered ? tasks.filter(isTaskDueToday) : tasks),
    [isFiltered, tasks]
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const currentTasks = tasks;
      const currentFilteredTasks = isFiltered ? currentTasks.filter(isTaskDueToday) : currentTasks;
      const sourceArray = [...currentFilteredTasks];

      if (sourceArray.length === 0) {
        console.error('No tasks to reorder');
        return;
      }

      const reorderedTasks = reOrder(from, to, sourceArray);
      updateTaskPositionsMutation.mutate(reorderedTasks);
    },
    [isFiltered, updateTaskPositionsMutation]
  );

  const handleFilterTodayPress = useCallback(() => {
    setIsFiltered(!isFiltered);
  }, [isFiltered]);

  const handleTaskUpdate = useCallback(async (updatedTask: Readonly<Tables<'tasks'>>) => {
    try {
      await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).select().single();
    } catch (error) {
      console.error('Task update failed:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderTaskItem = useCallback(
    ({ item, index }: Readonly<{ item: Tables<'tasks'>; index: number }>) => (
      <TaskItem
        task={item}
        index={index}
        onPress={() => {
          router.push({
            pathname: '/(tasks)/[id]',
            params: { id: item.id },
          });
        }}
        onReorder={handleReorder}
        onTaskUpdate={handleTaskUpdate}
        onToggleComplete={({ taskId, isComplete }) => {
          toggleComplete.mutate({ taskId, isComplete });
          setConfetti(true);
          setTimeout(() => {
            setConfetti(false);
          }, 4000);
        }}
      />
    ),
    [handleReorder, handleTaskUpdate, toggleComplete]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tasks',
          headerRight: () => (
            <>
              <Pressable onPress={() => refetch()} className="p-5">
                <Icon as={DownloadIcon} className="m-1 h-5 w-5 text-typography-100" />
              </Pressable>
              <Pressable onPress={handleFilterTodayPress} className="p-5">
                <Icon
                  as={isFiltered ? CalendarDaysIcon : EyeIcon}
                  className="m-1 h-6 w-6 text-typography-500"
                />
              </Pressable>
              <Text size="xs" className="absolute right-5 top-1 text-center text-typography-500">
                {isFiltered ? "Today's" : 'All'}
              </Text>
            </>
          ),
        }}
      />
      <Container>
        {isLoading || isRefetching ? (
          showConfetti ? (
            <Confetti />
          ) : (
            <Box className="flex-1 items-center justify-center">
              <Spinner size="large" />
            </Box>
          )
        ) : showConfetti ? (
          <Confetti />
        ) : (
          <FlatList
            contentContainerStyle={{
              gap: 16,
              padding: 16,
              paddingBottom: 32,
              marginTop: 24,
            }}
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Box className="flex-1">
                <BiriBirseyDesin />
                <Text>No tasks available. Add some tasks from below button</Text>
              </Box>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                progressViewOffset={100}
                colors={['#000000']}
                progressBackgroundColor="#ffffff"
              />
            }
          />
        )}
        <Fab
          size="md"
          className="absolute bottom-5 right-5"
          onPress={
            tasks.filter(isTaskDueToday).length > 9
              ? () => router.push('/(tasks)/soManyTasksWarning')
              : () => router.push('/(tasks)/create-task')
          }>
          <FabIcon as={AddIcon} color="white" />
          <FabLabel>Add Task</FabLabel>
        </Fab>
      </Container>
    </>
  );
}
