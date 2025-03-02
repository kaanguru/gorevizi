import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as R from 'ramda';
import React, { useCallback, useState, useEffect } from 'react';
import { Pressable, View, Text } from 'react-native';

import { TaskItem } from '~/components/DraggableTaskItem';
import Confetti from '~/components/lotties/Confetti';
import TaskListDisplay from '~/components/TaskListDisplay';
import { Box } from '~/components/ui/box';
import { Fab, FabIcon } from '~/components/ui/fab';
import { Spinner } from '~/components/ui/spinner';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { useSoundContext } from '~/context/SoundContext';
import useFilteredTasks from '~/hooks/useFilteredTasks';
import { useUpdateHealthAndHappiness } from '~/hooks/useHealthAndHappinessMutations';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import useTaskCompleteSound from '~/hooks/useTaskCompleteSound';
import { useToggleComplete } from '~/hooks/useTasksMutations';
import useTasksQueries from '~/hooks/useTasksQueries';
import useUpdateTaskPositions from '~/hooks/useUpdateTaskPositions';
import { useUser } from '~/hooks/useUser';
import { Task } from '~/types';
import genRandomInt from '~/utils/genRandomInt';
import isTaskDueToday from '~/utils/tasks/isTaskDueToday';
import reOrder from '~/utils/tasks/reOrder';

export default function Index() {
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
  const [reorderedTasks, setReorderedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const newReorderedTasks = isFiltered ? filteredTasks : tasks;
    if (!R.equals(reorderedTasks, newReorderedTasks)) {
      setReorderedTasks(newReorderedTasks);
    }
  }, [filteredTasks, tasks, isFiltered, reorderedTasks]);

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const newTasks = reOrder(from, to, [...reorderedTasks]);
      setReorderedTasks(newTasks);

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
              {reorderedTasks.length > 0 && (
                <Pressable onPress={handleFilterTodayPress} className="p-5">
                  {isFiltered ? (
                    <FontAwesome6
                      name="calendar-days"
                      size={18}
                      color={theme === 'dark' ? '#FFFAEB' : '#051824'}
                    />
                  ) : (
                    <FontAwesome6
                      name="eye"
                      size={18}
                      color={theme === 'dark' ? '#FFFAEB' : '#051824'}
                    />
                  )}
                </Pressable>
              )}
            </>
          ),
        }}
      />
      {
        <View className="flex-1 bg-background-light  p-5 dark:bg-background-dark">
          {showLoading ? (
            <Box className="flex-1 items-center justify-center">
              {showConfetti ? <Confetti /> : <Spinner size="large" />}
            </Box>
          ) : (
            <>
              <TaskListDisplay
                isFiltered={isFiltered}
                reorderedTasks={reorderedTasks}
                renderTaskItem={renderTaskItem}
                keyExtractor={keyExtractor}
                isRefetching={isRefetching}
                refetch={refetch}
              />
            </>
          )}
          {
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
              <FontAwesome6 name="add" size={24} color="#ff006e" />
            </Fab>
          }
        </View>
      }
    </>
  );
}
