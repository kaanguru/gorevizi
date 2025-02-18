import React, { useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';

import getRepeatPeriodLabel from '~/utils/getRepeatPeriodLabel';
import { useTaskById } from '~/hooks/useTasksQueries';
import { useDeleteTask, useToggleComplete } from '~/hooks/useTasksMutations';
import useChecklistItemsQuery from '~/hooks/useCheckListQueries';
import useChecklistItemMutations from '~/hooks/useCheckListMutations';

import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import { VStack } from '~/components/ui/vstack';
import { Heading } from '~/components/ui/heading';
import { Spinner } from '~/components/ui/spinner';
import { Divider } from '~/components/ui/divider';
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '~/components/ui/checkbox';
import { CheckIcon, Icon, TrashIcon } from '~/components/ui/icon';
import { CalendarSync, Pencil, Trash2, Waypoints } from 'lucide-react-native';
import { HStack } from '~/components/ui/hstack';
import { Badge } from '~/components/ui/badge';
import { Pressable } from '~/components/ui/pressable';
import { Card } from '~/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
  AlertDialogHeader,
} from '~/components/ui/alert-dialog';

import Header from '~/components/Header';
import { Button, ButtonText } from '~/components/ui/button';

export default function TaskDetailPage() {
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);
  const {
    mutate: toggleComplete,
    isError: isToggleCompleteError,
    error: toggleCompleteError,
    isPending: toggleCompleteIsPending,
  } = useToggleComplete();

  const { data: task, isLoading, isError, error, refetch } = useTaskById(taskID);
  const { mutate: deleteTask } = useDeleteTask();

  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const handleClose = () => setShowAlertDialog(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleToggleComplete = () => {
    task ? toggleComplete({ taskID: +taskID, isComplete: !task.is_complete }) : null;
    refetch();
  };

  if (!task || isChecklistItemsLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  // Added null check for task
  if (!task) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Task not found.</Text>
      </Box>
    );
  }
  const handleDeleteTask = (taskID: string): void => {
    setShowAlertDialog(false);
    deleteTask(taskID);
    router.push('/(drawer)/');
  };
  return (
    <ScrollView className=" flex-1 bg-background-light dark:bg-background-dark">
      <VStack space="sm" className="flex-1 ">
        <Header headerTitle="" />
        <HStack className="-mt-12 justify-end">
          <Pressable onPress={() => router.push(`/(tasks)/edit/${taskID}`)}>
            <Icon
              size="xl"
              className="mx-5 my-0  py-0 text-typography-black dark:text-typography-white"
              as={Pencil}
            />
          </Pressable>
          <Pressable onPress={() => setShowAlertDialog(true)}>
            <Icon
              size="xl"
              className="mx-5 my-0  py-0 text-typography-black dark:text-typography-white"
              as={Trash2}
            />
          </Pressable>
          <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-full max-w-[415px] items-center gap-4">
              <Box className="h-[52px] w-[52px] items-center justify-center rounded-full bg-background-error">
                <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
              </Box>
              <AlertDialogHeader className="mb-2">
                <Heading size="md">Delete Task?</Heading>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text size="sm" className="text-center">
                  The Task will be deleted from the database. This cannot be undone.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter className="mt-5">
                <Button
                  size="sm"
                  action="negative"
                  onPress={() => handleDeleteTask(taskID)}
                  className="px-[30px]">
                  <ButtonText className="text-error-100">Delete</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  size="sm"
                  className="px-[30px]">
                  <ButtonText>Cancel</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HStack>
        <Card className="mx-5 bg-background-dark text-typography-white dark:bg-background-light dark:text-typography-black">
          <Heading
            size="2xl"
            className="justify-self-center p-4 text-center text-typography-white dark:text-typography-black">
            {task.title}
          </Heading>
          {task.notes && (
            <Box className="rounded-sm bg-background-light p-3">
              <Markdown>{task.notes}</Markdown>
            </Box>
          )}
          <Divider className="my-3" />

          {/* Task Status */}
          <VStack className="mx-auto my-5 w-full items-center justify-center px-4" space="xl">
            {toggleCompleteIsPending ? (
              <Spinner size="small" />
            ) : (
              <Checkbox
                size="lg"
                isChecked={task.is_complete}
                onChange={handleToggleComplete}
                className="mx-auto rounded-md bg-background-light p-2 dark:bg-background-dark"
                value="is_complete">
                <CheckboxLabel>{task.is_complete ? 'Completed' : 'Not Completed'}</CheckboxLabel>
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} className="bg-success-100" />
                </CheckboxIndicator>
              </Checkbox>
            )}
          </VStack>
          {!task.repeat_period && (
            <Text
              size="md"
              className="text-center text-typography-white dark:text-typography-black">
              It is not a repeating task
            </Text>
          )}
          {task.repeat_period && (
            <VStack className="bg-gray.50 rounded-lg p-4">
              <VStack className="items-center justify-center">
                <Icon as={CalendarSync} size="xl" color="#CC9900" className="t m-3 " />
                <Text size="md" bold className="text-typography-white  dark:text-typography-black">
                  Every {task.repeat_frequency} {getRepeatPeriodLabel(task.repeat_period)}{' '}
                </Text>
              </VStack>
              {task.repeat_on_wk && task.repeat_on_wk.length > 0 && (
                <HStack space="sm" className="flex-wrap justify-center">
                  {task.repeat_on_wk.map((day) => (
                    <Badge key={day} variant="outline" className="my-3 p-1">
                      <Text size="md" bold className="text-gray.700 p-3">
                        {day}
                      </Text>
                    </Badge>
                  ))}
                </HStack>
              )}
            </VStack>
          )}
        </Card>

        {task.updated_at && (
          <VStack className="items-end px-4">
            <Text size="xs" bold>
              update
            </Text>
            <Text size="md">{new Date(task.updated_at!).toLocaleDateString()}</Text>
            <Divider />
          </VStack>
        )}

        {checklistItems && checklistItems.length > 0 ? (
          <VStack className="m-3 flex-col p-4" space="xl">
            <HStack>
              <Icon
                size="md"
                as={Waypoints}
                className="me-2 text-typography-black dark:text-typography-white"
              />
              <Text size="lg" className="pb-2 text-typography-black dark:text-typography-white">
                Routine Steps
              </Text>
            </HStack>
            {checklistItems.map((item) => (
              <Box key={item.id} className="my-2 flex-row items-center py-2">
                <Checkbox
                  value={item.id.toString()}
                  isChecked={item.is_complete}
                  onChange={() =>
                    updateChecklistItemCompletion({
                      id: item.id,
                      is_complete: !item.is_complete,
                    })
                  }>
                  <CheckboxIndicator size="lg" className="h-8 w-8">
                    <CheckboxIcon className="p-4" as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel className="ms-3">{item.content}</CheckboxLabel>
                </Checkbox>
              </Box>
            ))}
            <Divider />
          </VStack>
        ) : (
          <Text className="text-muted p-4 text-center dark:text-typography-white">
            No Routines found. Edit Task to add some
          </Text>
        )}
      </VStack>
    </ScrollView>
  );
}
