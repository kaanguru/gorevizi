import React, { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/database.types';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';
import calculateSuccessPercentage from '~/utils/tasks/calculateSuccessPercentage';

function TaskSuccessPercentage({ task }: Readonly<{ task: Tables<'tasks'> }>) {
  const { data: completionHistory } = useQuery({
    queryKey: ['taskCompletionHistory', task.id],
    queryFn: () => getTaskCompletionHistory(task.id),
  });

  const successPercentage = calculateSuccessPercentage(task, completionHistory || []);

  return successPercentage > 0 ? (
    <View className="rounded-xl bg-white p-6 shadow-lg">
      <Text className="mb-2 text-xl font-semibold text-gray-800">{task.title}</Text>
      <Text className="text-3xl font-bold text-green-600">{successPercentage.toFixed(2)}%</Text>
    </View>
  ) : null;
}

export default TaskSuccessPercentage;
