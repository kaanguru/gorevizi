import React, { useCallback, useState, memo, useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Task } from '~/types';
import * as R from 'ramda';

import { Fab, FabIcon } from '~/components/ui/fab';
import { Box } from '~/components/ui/box';
import { AddIcon, CalendarDaysIcon, Icon, DownloadIcon, EyeIcon } from '~/components/ui/icon';
import { Spinner } from '~/components/ui/spinner';
import { TaskItem } from '~/components/DraggableTaskItem';
import reOrder from '~/utils/tasks/reOrder';
import isTaskDueToday from '~/utils/tasks/isTaskDueToday';
import useTasksQueries from '~/hooks/useTasksQueries';
import useFilteredTasks from '~/hooks/useFilteredTasks';

import { useToggleComplete } from '~/hooks/useTasksMutations';
import useUpdateTaskPositions from '~/hooks/useUpdateTaskPositions';
import useTaskCompleteSound from '~/hooks/useTaskCompleteSound';
import { Text } from '~/components/ui/text';
import Confetti from '~/components/lotties/Confetti';
import TaskListEmptyComponent from '~/components/TaskListEmptyComponent';
import { useSoundContext } from '~/context/SoundContext';
import { useUpdateHealthAndHappiness } from '~/hooks/useHealthAndHappinessMutations';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import { useUser } from '~/hooks/useUser';
import genRandomInt from '~/utils/genRandomInt';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';

export default function TaskList() {
  const [isFiltered, setIsFiltered] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { isSoundEnabled } = useSoundContext();
  const { theme } = useTheme();

  const router = useRouter();
  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasksQueries('not-completed');
  const { filteredTasks } = useFilteredTasks(tasks, isFiltered);
  const { mutate: updateTaskPositionsMutation, isPending: isUpdatingTaskPositions } =
    useUpdateTaskPositions();
  const { playSound } = useTaskCompleteSound();
  const toggleComplete = useToggleComplete();
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useUser();
  const { mutate: updateHealthAndHappiness, isPending: isCreatingHealthAndHappiness } =
    useUpdateHealthAndHappiness();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);
  // Create a state variable to hold the reordered tasks
  const [reorderedTasks, setReorderedTasks] = useState<Task[]>([]);

  // Update reorderedTasks whenever filteredTasks or tasks change
  useEffect(() => {
    const newReorderedTasks = isFiltered ? filteredTasks : tasks;
    if (!R.equals(reorderedTasks, newReorderedTasks)) {
      setReorderedTasks(newReorderedTasks);
    }
  }, [filteredTasks, tasks, isFiltered, reorderedTasks]);

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const newTasks = reOrder(from, to, [...reorderedTasks]); // Create a new array
      setReorderedTasks(newTasks); // Update the state with the new array

      updateTaskPositionsMutation(newTasks);
    },
    [reorderedTasks, updateTaskPositionsMutation],
  );

  const handleFilterTodayPress = useCallback(() => {
    setIsFiltered((prevIsFiltered) => !prevIsFiltered);
  }, []);

  const handleOnToggleComplete = useCallback(
    ({ taskID, isComplete }: Readonly<{ taskID: number; isComplete: boolean }>) => {
      toggleComplete.mutate(
        { taskID, isComplete },
        {
          onSuccess: () => {
            setShowConfetti(true);
            updateHealthAndHappiness({
              user_id: user?.id,
              health: (healthAndHappiness?.health ?? 0) + genRandomInt(8, 24),
              happiness: (healthAndHappiness?.happiness ?? 0) + genRandomInt(2, 8),
            });
            if (isSoundEnabled) {
              playSound();
            }
            setTimeout(() => {
              setShowConfetti(false);
            }, 2000);
          },
        },
      );
    },
    [toggleComplete, playSound, isSoundEnabled],
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const renderTaskItem = useCallback(
    ({ item, index }: Readonly<{ item: Task; index: number }>) => (
      <TaskItem
        task={item}
        index={index}
        onPress={() => {
          router.push({
            pathname: '/(tasks)/[id]',
            params: { id: item.id.toString() },
          });
        }}
        onReorder={handleReorder}
        onToggleComplete={handleOnToggleComplete}
        isFiltered={isFiltered} // Pass the isFiltered state
      />
    ),
    [router, handleReorder, handleOnToggleComplete, isFiltered],
  );

  const keyExtractor = useCallback((item: Readonly<Task>) => item.id.toString(), []);

  const showLoading = isLoading || isRefetching || showConfetti;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Due Tasks',
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#051824' : '#FFFAEB',
          },
          headerTintColor: theme === 'dark' ? '#FFFAEB' : '#051824',
          headerTitleStyle: {
            color: theme === 'dark' ? '#FFFAEB' : '#051824',
            fontFamily: 'DelaGothicOne_400Regular',
            fontSize: 14,
            fontWeight: '400',
          },
          headerRight: () => (
            <>
              <Pressable onPress={handleFilterTodayPress} className="p-5">
                <Icon
                  as={isFiltered ? CalendarDaysIcon : EyeIcon}
                  className="m-1 h-6 w-6 text-typography-black dark:text-typography-white"
                />
              </Pressable>
            </>
          ),
        }}
      />
      <View className="flex-1 bg-background-light  p-5 dark:bg-background-dark">
        {showLoading ? (
          <Box className="flex-1 items-center justify-center">
            {showConfetti ? <Confetti /> : <Spinner size="large" />}
          </Box>
        ) : (
          <>
            <Text
              size="xs"
              className="absolute right-5 top-1 text-center font-mono text-typography-black dark:text-typography-white">
              {isFiltered ? "Today's" : 'All Tasks'}
            </Text>
            <FlatList
              contentContainerStyle={{
                gap: 16,
                margin: 3,
              }}
              data={reorderedTasks} // Use the reorderedTasks state
              renderItem={renderTaskItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={<TaskListEmptyComponent />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  progressViewOffset={100}
                  colors={['#000000']}
                  progressBackgroundColor="#ffffff"
                />
              }
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              initialNumToRender={10}
              maxToRenderPerBatch={3}
              windowSize={6}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => ({
                length: 94,
                offset: 110 * index,
                index,
              })}
            />
          </>
        )}
        <Fab
          size="lg"
          className="absolute bottom-5 right-5 "
          onPress={() => {
            if (tasks.filter(isTaskDueToday).length > 8) {
              router.push('/(tasks)/soManyTasksWarning');
            } else {
              router.push('/(tasks)/create-task');
            }
          }}>
          <FabIcon size="xl" stroke={'#ff006e'} as={AddIcon} />
        </Fab>
      </View>
    </>
  );
}
