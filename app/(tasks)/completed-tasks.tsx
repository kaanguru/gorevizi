import { router } from 'expo-router';
import { Undo } from 'lucide-react-native';
import { useCallback } from 'react';
import React, { View, FlatList } from 'react-native';

import Header from '~/components/Header';
import { Button, ButtonIcon } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Pressable } from '~/components/ui/pressable';
import { Text } from '~/components/ui/text';
import { Tables } from '~/database.types';
import { useToggleComplete } from '~/hooks/useTasksMutations';
import useTasksQueries from '~/hooks/useTasksQueries';

export default function CompletedTasks() {
  const {
    data: tasks,
    error: completedTasksError,
    isLoading,
    refetch,
  } = useTasksQueries('completed');
  const { mutate: toggleComplete } = useToggleComplete();

  const handleMarkIncomplete = useCallback(
    (taskID: number) => toggleComplete({ taskID, isComplete: false }),
    [],
  );

  function renderItem({ item }: Readonly<{ item: Tables<'tasks'> }>) {
    return (
      <Card size="lg" variant="outline" className="m-3 bg-background-dark dark:bg-background-light">
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/(tasks)/[id]',
              params: { id: item.id },
            });
          }}>
          <View className="flex flex-row items-start justify-between">
            <View className="flex-1">
              <Text bold size="lg" className=" text-typography-gray ">
                {item.title}
              </Text>
              {item.notes && (
                <Text className="mt-1 py-3 text-white dark:text-black">{item.notes}</Text>
              )}
              {item.repeat_period && (
                <Text size="sm" className="mt-2  text-white dark:text-black">
                  Repeats: {item.repeat_frequency} times {item.repeat_period.toLowerCase()}
                </Text>
              )}
              {item.updated_at && (
                <Text size="sm" className="mt-2  text-white dark:text-black">
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
    <View className="flex-1 bg-background-light p-4 dark:bg-background-dark">
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
