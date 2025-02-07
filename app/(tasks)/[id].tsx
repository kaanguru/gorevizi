import React from 'react';
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
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon, Icon } from '@/components/ui/icon';
import { Pencil, Trash2 } from 'lucide-react-native';
import { HStack } from '~/components/ui/hstack';
import { Badge } from '@/components/ui/badge';
import { Pressable } from '~/components/ui/pressable';

import Header from '~/components/Header';

export default function TaskDetailPage() {
  const router = useRouter();

  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);
  const { data: task, isLoading, isError, error, refetch } = useTaskById(taskID);
  const { mutate: deleteTask } = useDeleteTask();
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );
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
    //TODO: ADD Confirmation dialog

    deleteTask(taskID);
    router.push('/(drawer)/');
  };

  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack space="xl" className="flex-1 bg-background-50">
        <HStack className="place-items-end justify-items-end ">
          <Header headerTitle="" />
          <Pressable onPress={() => router.push(`/(tasks)/edit/${taskID}`)}>
            <Icon size="xl" className="mx-5 my-0  py-0 text-typography-500" as={Pencil} />
          </Pressable>
          <Pressable onPress={() => handleDeleteTask(taskID)}>
            <Icon size="xl" className="mx-5 my-0  py-0 text-typography-500" as={Trash2} />
          </Pressable>
        </HStack>
        <Heading size="2xl" className="justify-self-center p-4 text-center">
          {task.title}
        </Heading>
        {task.notes && (
          <Text size="lg" className="p-4">
            <Markdown>{task.notes}</Markdown>
          </Text>
        )}
        <Divider />

        {/* Task Status */}
        <VStack className="items-center px-4" space="xl">
          <Text size="md" bold>
            {task.is_complete ? 'Completed' : 'Not Completed'}
          </Text>
        </VStack>
        {!task.repeat_period && (
          <Text size="md" className="text-center">
            It is not a repeating task
          </Text>
        )}
        {task.repeat_period && (
          <VStack className="bg-gray.50 rounded-lg p-4">
            <VStack className="items-center justify-center">
              <Heading size="md">Repeat</Heading>
              <Text size="md" className="text-bold">
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

        {task.updated_at && (
          <VStack className="items-center px-4">
            <Text size="md">Last updated: {new Date(task.updated_at!).toLocaleDateString()}</Text>
          </VStack>
        )}

        {checklistItems && checklistItems.length > 0 ? (
          <VStack className="flex-col p-4" space="xl">
            <Text className="text-muted.strong ">Routine Steps Checklist</Text>
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
                  <CheckboxLabel>{item.content}</CheckboxLabel>
                </Checkbox>
              </Box>
            ))}
            <Divider />
          </VStack>
        ) : (
          <Text className="text-muted.strong p-4 text-center">No checklist items found.</Text>
        )}
      </VStack>
    </ScrollView>
  );
}
