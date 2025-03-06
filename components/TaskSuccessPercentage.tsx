import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { View } from 'react-native';

import { Tables } from '@/database.types';

import { Card } from './ui/card';
import { Center } from './ui/center';
import { Pressable } from './ui/pressable';
import { Text } from './ui/text';

import { Progress, ProgressFilledTrack } from '~/components/ui/progress';
import calculateSuccessPercentage from '~/utils/tasks/calculateSuccessPercentage';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';

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
    <Card
      size="lg"
      variant="elevated"
      className="rounded-xl bg-background-50 p-6 shadow-lg dark:bg-background-info">
      <Pressable onPress={onPress}>
        <Text
          bold
          size="xl"
          className="text-typography-dark mb-2  p-2 font-semibold dark:text-white">
          {task.title}
        </Text>
        <Center className="my-3">
          <Progress value={Number(successPercentage.toFixed(2))} size="md" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </Center>
        <Text size="xl" className="font-bold text-[#537817] dark:text-success-300">
          {successPercentage.toFixed(2)}%
        </Text>
      </Pressable>
    </Card>
  ) : null;
}

export default TaskSuccessPercentage;
