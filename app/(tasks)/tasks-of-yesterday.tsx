import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, Alert, ListRenderItem } from 'react-native';

import Header from '~/components/Header';
import TuneUp from '~/components/lotties/TuneUp';
import WellDone from '~/components/lotties/WellDone';
import { Box } from '~/components/ui/box';
import { Button, ButtonText } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Divider } from '~/components/ui/divider';
import { Pressable } from '~/components/ui/pressable';
import { Text } from '~/components/ui/text';
import { Tables } from '~/database.types';
import useTasksQuery from '~/hooks/useTasksQueries';
import { Task } from '~/types';
import wasTaskDueYesterday from '~/utils/tasks/wasTaskDueYesterday';

export default function TasksOfYesterday() {
  const { data: notCompletedTasks } = useTasksQuery('not-completed');
  const [tasksDueYesterday, setTasksDueYesterday] = useState<ReadonlyArray<Tables<'tasks'>>>();

  useEffect(() => {
    const yesterdayTasks = notCompletedTasks?.filter(wasTaskDueYesterday) || [];
    setTasksDueYesterday(yesterdayTasks);
  }, [notCompletedTasks]);

  if (!tasksDueYesterday || tasksDueYesterday.length === 0) {
    return (
      <Box className="flex-1 flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
        <WellDone />
        <Text className=" my-10 text-center text-typography-black dark:text-typography-white">
          No tasks to complete from yesterday!
        </Text>
        <Button action="primary" variant="solid" size="md" onPress={() => router.push('/')}>
          <ButtonText>Go to Today's Tasks</ButtonText>
        </Button>
      </Box>
    );
  }
  const taskOfYesterday: ListRenderItem<Task> = ({ item }) => {
    return (
      <Pressable onPress={() => router.push(`/(tasks)/${item.id}`)}>
        <Card size="md" variant="outline" className="m-6 rounded">
          <Text
            size="lg"
            bold
            className="text-center text-typography-black dark:text-typography-white">
            {item.title}
          </Text>
        </Card>
      </Pressable>
    );
  };
  return (
    <SafeAreaView>
      <Header headerTitle=" 🎶    🎵 Tasklist Tune-Up! 🎹" />
      <View className="h-full bg-background-light p-4 dark:bg-background-dark">
        <Text size="md" className="text-center text-typography-black dark:text-typography-white">
          Deadlines sound like heavy metal 🎸 and your brain’s stuck on elevator music 🎵
        </Text>
        <Text
          className="my-10 text-center text-typography-black dark:text-typography-white"
          size="lg"
          bold>
          Your to-do list hit a sour note yesterday—no worries, we’ll remix it! 🎶
        </Text>
        <Text
          size="sm"
          className="m-5 text-center text-typography-black dark:text-typography-white">
          🎧 Check your tasks before you turn into a human metronome
        </Text>
        <TuneUp />
        <Divider className="my-4" />
        <FlatList
          data={tasksDueYesterday}
          renderItem={taskOfYesterday}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
