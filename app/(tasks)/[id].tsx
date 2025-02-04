import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchTaskById } from '~/hooks/useTasksQueries';
import { Tables } from '~/database.types';
import useChecklistItemsQuery from '~/hooks/useCheckListQueries';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { VStack } from '~/components/ui/vstack';
import { Heading } from '~/components/ui/heading';
import { Spinner } from '~/components/ui/spinner';
import { Divider } from '~/components/ui/divider';
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import React from 'react';
import Header from '~/components/Header';
import { Button, ButtonText } from '~/components/ui/button';
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge';
import getRepeatPeriodLabel from '~/utils/getRepeatPeriodLabel';
import useChecklistItemMutations from '~/hooks/useCheckListMutations';
import Markdown from 'react-native-markdown-display';
export default function TaskDetailPage() {
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Tables<'tasks'> | null>(null);
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);

  useEffect(() => {
    async function fetchTask() {
      const taskData = await fetchTaskById(taskID);
      setTask(taskData);
    }

    fetchTask();
  }, [taskID]);

  if (!task || isChecklistItemsLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <ScrollView>
      <VStack space="xl" className="flex-1 bg-white">
        <Header headerTitle="Task Details" />
        <Heading size="2xl" className="p-4 text-center">
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
          <Text size="md">{task.is_complete ? 'Completed' : 'Not Completed'}</Text>
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
              <VStack>
                {task.repeat_on_wk.map((day) => (
                  <Badge key={day} variant="outline" className="px-2 py-1">
                    <Text size="sm" className="text-gray.700">
                      {day}
                    </Text>
                  </Badge>
                ))}
              </VStack>
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
                  onPress={() =>
                    updateChecklistItemCompletion({
                      id: item.id,
                      is_complete: !item.is_complete,
                    })
                  }>
                  <CheckboxIndicator size="lg" className="h-8 w-8">
                    <CheckboxIcon className="p-4" as={CheckIcon} />
                  </CheckboxIndicator>
                  <Text>{item.content}</Text>
                </Checkbox>
              </Box>
            ))}
            <Divider />
          </VStack>
        ) : (
          <Text className="text-muted.strong p-4 text-center">No checklist items found.</Text>
        )}

        <Button
          className="mx-4 my-2"
          size="lg"
          variant="solid"
          action="primary"
          onPress={() => {
            router.push({
              pathname: '/(tasks)/edit/[id]',
              params: { id: taskID },
            });
          }}>
          <ButtonText>Edit {task.title}</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
