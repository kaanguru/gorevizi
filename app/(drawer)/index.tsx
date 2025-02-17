import React, { useCallback, useState, memo } from 'react';
import { FlatList, Pressable, RefreshControl } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Task } from '~/types';

import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Container } from '~/components/Container';
import { Box } from '~/components/ui/box';
import { AddIcon, CalendarDaysIcon, Icon, DownloadIcon, EyeIcon } from '@/components/ui/icon';
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
import { useSoundContext } from '~/store/SoundContext';

export default function TaskList() {
  const [isFiltered, setIsFiltered] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { isSoundEnabled } = useSoundContext();

  const router = useRouter();
  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasksQueries('not-completed');
  const { filteredTasks } = useFilteredTasks(tasks, isFiltered);
  const updateTaskPositionsMutation = useUpdateTaskPositions();
  const { playSound } = useTaskCompleteSound();
  const toggleComplete = useToggleComplete();

  const handleReorder = useCallback(
    (from: number, to: number) => {
      updateTaskPositionsMutation.mutate(
        reOrder(from, to, isFiltered ? [...filteredTasks] : [...tasks])
      );
    },
    [filteredTasks, tasks, isFiltered]
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
            if (isSoundEnabled) {
              playSound();
            }
            setTimeout(() => {
              setShowConfetti(false);
            }, 2000);
          },
        }
      );
    },
    [toggleComplete, playSound, isSoundEnabled]
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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
      />
    ),
    [router, handleReorder, handleOnToggleComplete]
  );

  const showLoading = isLoading || isRefetching || showConfetti;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Due Tasks',
          headerRight: () => (
            <>
              <Pressable onPress={handleFilterTodayPress} className="p-5">
                <Icon
                  as={isFiltered ? CalendarDaysIcon : EyeIcon}
                  className="m-1 h-6 w-6 text-typography-white"
                />
              </Pressable>
              <Text
                size="xs"
                className="absolute right-5 top-1 text-center font-mono text-typography-white">
                {isFiltered ? "Today's" : 'All'}
              </Text>
            </>
          ),
        }}
      />
      <Container>
        {showLoading ? (
          <Box className="flex-1 items-center justify-center">
            {showConfetti ? <Confetti /> : <Spinner size="large" />}
          </Box>
        ) : (
          <FlatList
            contentContainerStyle={{
              gap: 16,
              marginTop: 24,
            }}
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
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
              length: 79,
              offset: 79 * index,
              index,
            })}
          />
        )}
        <Fab
          size="md"
          className="absolute bottom-5 right-5 bg-background-dark"
          onPress={() => {
            if (tasks.filter(isTaskDueToday).length > 9) {
              router.push('/(tasks)/soManyTasksWarning');
            } else {
              router.push('/(tasks)/create-task');
            }
          }}>
          <FabIcon as={AddIcon} color="white" />
          <FabLabel className="p-2 font-delaGothicOne">Add Task</FabLabel>
        </Fab>
      </Container>
    </>
  );
}
