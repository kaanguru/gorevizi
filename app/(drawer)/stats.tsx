import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Tables } from '@/database.types';
import useTasksQuery from '~/hooks/useTasksQueries';
import { useTaskCompletionCount } from '~/hooks/useTaskCompletionHistory';

import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';
import { Box } from '~/components/ui/box';
import { Spinner } from '~/components/ui/spinner';

export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery('completed');
  const {
    data: completedTasksCount,
    isLoading: isCountLoading,
    error: countError,
  } = useTaskCompletionCount();

  if (isLoading || isCountLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error || countError) {
    return (
      <View>
        <Text>Error: {error?.message || countError?.message}</Text>
      </View>
    );
  }
  const renderStatItem = ({ item }: Readonly<{ item: Readonly<Tables<'tasks'>> }>) => (
    <TaskSuccessPercentage key={item.id} task={item} />
  );

  return (
    <View>
      <Text className="mb-4 text-lg font-bold">Total Completed Tasks: {completedTasksCount}</Text>
      <FlatList
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 32,
          marginTop: 24,
        }}
        data={data || []}
        keyExtractor={(task: Readonly<Tables<'tasks'>>) => task.id.toString()}
        renderItem={renderStatItem}
        ListEmptyComponent={<Text>No tasks available</Text>}
      />
    </View>
  );
}
