import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Tables } from '@/database.types';
import useTasksQuery from '~/hooks/useTasksQuery';
import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';

export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery('completed');

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }
  const renderStatItem = ({ item }: Readonly<{ item: Readonly<Tables<'tasks'>> }>) => (
    <TaskSuccessPercentage key={item.id} task={item} />
  );
  return (
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
  );
}
