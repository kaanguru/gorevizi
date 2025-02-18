import React from 'react';
import { View, FlatList } from 'react-native';
import { Tables } from '@/database.types';
import useTasksQuery from '~/hooks/useTasksQueries';

import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import { Spinner } from '~/components/ui/spinner';

export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery('completed');

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }
  const renderStatItem = ({ item }: Readonly<{ item: Readonly<Tables<'tasks'>> }>) => (
    <TaskSuccessPercentage key={item.id.toString()} task={item} />
  );

  return (
    <View className="flex-1 justify-evenly bg-background-light dark:bg-background-dark">
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
