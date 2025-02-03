import { useState } from 'react';
import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import useTasksQueries from '~/hooks/useTasksQueries';
import { useToggleComplete } from '~/hooks/useTasksMutations';
import { TaskItem } from '~/components/DraggableTaskItem';
import { Box } from '~/components/ui/box';
import Header from '~/components/Header';
interface CompletedTask {
  id: number;
  title: string;
  notes: string;
  is_complete: boolean;
  updated_at: string;
}

export default function CompletedTasks() {
  const { data: tasks, error, isLoading, refetch } = useTasksQueries('completed');
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const { mutate } = useToggleComplete();

  const handleMarkIncomplete = async (taskId: number) => {
    try {
      mutate({ taskId, isComplete: false });
    } catch (error) {
      console.error('Error marking task as incomplete:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium text-gray-700">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-medium text-red-500">Error loading tasks</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Header headerTitle="Completed Tasks" />
      {/* <Text className="mb-4 text-2xl font-bold text-gray-800">Completed Tasks</Text> */}

      {tasks?.length === 0 ? (
        <Text className="text-lg font-medium text-gray-500">No completed tasks</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => (
            <Box
              key={item.item.id}
              className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <View className="flex items-start justify-between">
                <View>
                  <Text className="text-lg font-semibold text-gray-800">{item.item.title}</Text>
                  <Text className="mt-1 text-gray-600">{item.item.notes}</Text>
                  <Text className="mt-2 text-sm text-gray-500">
                    Completed on: TODO get from completion history table
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleMarkIncomplete(item.item.id)}
                  className="ml-4 rounded-md bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600">
                  <Text>Mark as Incomplete</Text>
                </Pressable>
              </View>
            </Box>
          )}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}
