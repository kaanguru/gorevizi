import React from 'react';
import { View, FlatList } from 'react-native';
import { Tables } from '@/database.types';
import useTasksQuery from '~/hooks/useTasksQueries';
import { useTaskCompletionCount } from '~/hooks/useTaskCompletionHistory';

import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
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
    <TaskSuccessPercentage key={item.id.toString()} task={item} />
  );

  return (
    <View className="flex-1 justify-evenly bg-background-light dark:bg-background-dark">
      <Text
        size="lg"
        bold
        className="mt-2 text-center font-heading text-typography-black dark:text-typography-white">
        Total Completed Tasks: {completedTasksCount}
      </Text>
      <FlatList
        contentContainerStyle={{
          gap: 8,
          padding: 8,
          paddingBottom: 16,
          marginTop: 12,
          justifyContent: 'space-evenly',
        }}
        data={data || []}
        keyExtractor={(task: Readonly<Tables<'tasks'>>) => task.id.toString()}
        renderItem={renderStatItem}
        ListEmptyComponent={<Text>No tasks available</Text>}
      />
    </View>
  );
}
