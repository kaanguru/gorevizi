import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, Alert, ListRenderItem } from 'react-native';

import Header from '~/components/Header';
import { Card } from '~/components/ui/card';
import { Pressable } from '~/components/ui/pressable';
import { Text } from '~/components/ui/text';
import { Tables } from '~/database.types';
import useTasksQuery from '~/hooks/useTasksQueries';
import { Task } from '~/types';
import wasTaskDueYesterday from '~/utils/tasks/wasTaskDueYesterday';

function TasksOfYesterday() {
  const { data: notCompletedTasks } = useTasksQuery('not-completed');
  const [tasksDueYesterday, setTasksDueYesterday] = useState<ReadonlyArray<Tables<'tasks'>>>();

  useEffect(() => {
    const yesterdayTasks = notCompletedTasks?.filter(wasTaskDueYesterday) || [];
    setTasksDueYesterday(yesterdayTasks);
  }, [notCompletedTasks]);

  if (!tasksDueYesterday || tasksDueYesterday.length === 0) {
    return (
      <SafeAreaView>
        <Text>No tasks to mark from yesterday!</Text>
      </SafeAreaView>
    );
  }
  const renderItem: ListRenderItem<Task> = ({ item }) => {
    return (
      <Pressable onPress={() => router.push(`/(tasks)/${item.id}`)}>
        <Card
          size="lg"
          variant="outline"
          className="m-3 bg-background-dark dark:bg-background-light">
          <Text
            size="lg"
            bold
            className="text-center text-typography-white dark:text-typography-black">
            {item.title}
          </Text>
        </Card>
      </Pressable>
    );
  };
  return (
    <SafeAreaView>
      <Header headerTitle="Yesterday's Tasks" />
      <View className="h-full bg-background-light p-4 dark:bg-background-dark">
        <Text
          className="text-center text-typography-black dark:text-typography-white"
          size="lg"
          bold>
          Mark the tasks you did yesterday as complete
        </Text>
        <FlatList
          data={tasksDueYesterday}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

export default TasksOfYesterday;
