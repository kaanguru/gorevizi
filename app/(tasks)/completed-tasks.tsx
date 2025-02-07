import { useCallback } from 'react';
import React, { View, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Tables } from '~/database.types';
import useTasksQueries from '~/hooks/useTasksQueries';
import { useToggleComplete } from '~/hooks/useTasksMutations';
import { Undo } from 'lucide-react-native';
import { Button, ButtonIcon } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Card } from '@/components/ui/card';
import { Pressable } from '~/components/ui/pressable';
import Header from '~/components/Header';

export default function CompletedTasks() {
  const {
    data: tasks,
    error: completedTasksError,
    isLoading,
    refetch,
  } = useTasksQueries('completed');
  const { mutate: toggleComplete } = useToggleComplete();

  const handleMarkIncomplete = useCallback(
    (taskId: number) => toggleComplete({ taskId, isComplete: false }),
    [toggleComplete]
  );

  function renderItem({ item }: Readonly<{ item: Tables<'tasks'> }>) {
    return (
      <Card size="lg" variant="outline" className="m-3">
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/(tasks)/[id]',
              params: { id: item.id },
            });
          }}>
          <View className="flex flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </Text>
              {item.notes && (
                <Text className="mt-1 text-gray-600 dark:text-gray-400">{item.notes}</Text>
              )}
              {item.repeat_period && (
                <Text className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Repeats: {item.repeat_frequency} times {item.repeat_period.toLowerCase()}
                </Text>
              )}
              {item.updated_at && (
                <Text className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Completed on: {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              )}
            </View>
            <Button
              variant="outline"
              action="positive"
              onPress={() => handleMarkIncomplete(item.id)}>
              <ButtonIcon as={Undo}></ButtonIcon>
            </Button>
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <View className="p-4">
      <Header headerTitle="Completed Tasks" />

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="m-4 text-center text-gray-500">No completed tasks found</Text>
        }
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={{ paddingBottom: 20, paddingEnd: 20 }}
        maxToRenderPerBatch={3}
        windowSize={6}
        removeClippedSubviews={true}
      />
    </View>
  );
}
