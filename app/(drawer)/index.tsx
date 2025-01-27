import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, GestureResponderEvent, Pressable } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Tables } from '~/database.types';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Container } from '~/components/Container';
import { Box } from '~/components/ui/box';
import { AddIcon, CalendarDaysIcon, Icon, DownloadIcon, EyeIcon } from '@/components/ui/icon';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/DraggableTaskItem';
import reOrder from '~/utils/reOrder';
import isTaskDueToday from '~/utils/isTaskDueToday';

export default function TaskList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFiltered, setIsFiltered] = useState(false);
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_complete', false)
      .order('position', { ascending: true, nullsFirst: true });

    if (error) throw new Error(error.message);
    return data;
  };
  // Query for fetching tasks
  const {
    data: tasks = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
  useEffect(() => {
    console.log('Fetched tasks:', tasks.length);
  }, [tasks]);
  useEffect(() => {
    console.log('Component re-rendered. Tasks:', tasks.length);
  }, [tasks]);
  // Mutation for updating task positions
  const updateTaskPositionsMutation = useMutation({
    mutationFn: async (reorderedTasks: Tables<'tasks'>[]) => {
      const updates = reorderedTasks.map((task, index) =>
        supabase.from('tasks').update({ position: index }).eq('id', task.id)
      );
      await Promise.all(updates);
    },
    onMutate: async (reorderedTasks) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Tables<'tasks'>[]>(['tasks']);
      queryClient.setQueryData(['tasks'], reorderedTasks);
      return { previousTasks };
    },
    onError: (err, _, context) =>
      context?.previousTasks && queryClient.setQueryData(['tasks'], context.previousTasks),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Mutation for toggling task completion
  const toggleCompleteMutation = useMutation({
    mutationFn: async (params: Readonly<{ taskId: number; isComplete: boolean }>) => {
      const { error } = await supabase
        .from('tasks')
        .update({ is_complete: params.isComplete })
        .eq('id', params.taskId);

      if (error) throw new Error(error.message);
    },
    onMutate: async ({ taskId, isComplete }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Tables<'tasks'>[]>(['tasks']);
      const newTasks = previousTasks?.map((task) =>
        task.id === taskId ? { ...task, is_complete: isComplete } : task
      );
      queryClient.setQueryData(['tasks'], newTasks);
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Filtered tasks memoization
  const filteredTasks = useMemo(
    () => (isFiltered ? tasks.filter(isTaskDueToday) : tasks),
    [isFiltered, tasks]
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const currentTasks = queryClient.getQueryData<Tables<'tasks'>[]>(['tasks']) || [];
      const currentFilteredTasks = isFiltered ? currentTasks.filter(isTaskDueToday) : currentTasks;
      const sourceArray = [...currentFilteredTasks];

      if (currentTasks.length === 0 && currentFilteredTasks.length === 0) {
        console.warn('filtered and tasks arrays are empty, cannot reorder');
        return;
      }

      if (sourceArray.length === 0) {
        console.error('No tasks to reorder');
        return;
      }

      const reorderedTasks = reOrder(from, to, sourceArray);
      updateTaskPositionsMutation.mutate(reorderedTasks, {
        onSuccess: () => {
          console.log('Task positions updated successfully.');
        },
        onError: (error) => {
          console.error('Failed to update task positions:', error);
        },
      });
    },
    [isFiltered, queryClient, updateTaskPositionsMutation]
  );

  const handleFilterTodayPress = () => {
    setIsFiltered(!isFiltered);
  };
  const handleTaskUpdate = async (updatedTask: Readonly<Tables<'tasks'>>) => {
    try {
      await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).select().single();
    } catch (error) {
      console.error('Task update failed:', error);
    }
  };
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
        onReorder={handleReorder}
        onTaskUpdate={handleTaskUpdate}
        onToggleComplete={(taskId, isComplete) =>
          toggleCompleteMutation.mutateAsync({ taskId, isComplete })
        }
      />
    ),
    [toggleCompleteMutation.mutate, handleReorder]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tasks',
          headerRight: () => (
            <>
              <Pressable onPress={() => refetch()} className="p-5">
                <Icon as={DownloadIcon} className="m-1 h-6 w-6 text-typography-100" />
              </Pressable>

              <Pressable onPress={handleFilterTodayPress} className="p-5">
                <Icon
                  as={isFiltered ? CalendarDaysIcon : EyeIcon}
                  className="m-1 h-6 w-6 text-typography-500"
                />
              </Pressable>
            </>
          ),
        }}
      />
      <Container>
        {isLoading || isRefetching ? (
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
            data={filteredTasks}
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
