import React, { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

import { Tables } from '@/database.types';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';
import calculateSuccessPercentage from '~/utils/tasks/calculateSuccessPercentage';
import { Center } from './ui/center';
import { Pressable } from './ui/pressable';
import { router } from 'expo-router';

function TaskSuccessPercentage({ task }: Readonly<{ task: Tables<'tasks'> }>) {
  const { data: completionHistory } = useQuery({
    queryKey: ['taskCompletionHistory', task.id],
    queryFn: () => getTaskCompletionHistory(task.id),
  });
  const successPercentage = calculateSuccessPercentage(task, completionHistory || []);
  function onPress(): void {
    router.push(`/(tasks)/${task.id}`);
  }

  return successPercentage > 0 ? (
    <View className="rounded-xl bg-white p-6 shadow-lg">
      <Pressable onPress={onPress}>
        <Text className="mb-2 text-xl font-semibold text-gray-800">{task.title}</Text>
        <Center className="my-3">
          <Progress value={Number(successPercentage.toFixed(2))} size="md" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </Center>
        <Text className="text-3xl font-bold text-green-600">{successPercentage.toFixed(2)}%</Text>
      </Pressable>
    </View>
  ) : null;
}

export default TaskSuccessPercentage;
