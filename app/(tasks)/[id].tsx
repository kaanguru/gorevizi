import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskById } from '~/hooks/useTasksQueries';
import useChecklistItemsQuery from '~/hooks/useCheckListQueries';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';
import { VStack } from '~/components/ui/vstack';
import { Heading } from '~/components/ui/heading';
import { Spinner } from '~/components/ui/spinner';
import { Divider } from '~/components/ui/divider';
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon, Icon } from '@/components/ui/icon';
import React from 'react';
import Header from '~/components/Header';
import { Button, ButtonText } from '~/components/ui/button';
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge';
import getRepeatPeriodLabel from '~/utils/getRepeatPeriodLabel';
import useChecklistItemMutations from '~/hooks/useCheckListMutations';
import Markdown from 'react-native-markdown-display';
import { Pencil } from 'lucide-react-native';
import { HStack } from '~/components/ui/hstack';
import { Pressable } from '~/components/ui/pressable';

export default function TaskDetailPage() {
  const router = useRouter();

  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);

  const { data: task, isLoading, isError, error } = useTaskById(taskID);

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
        <HStack className="items-center justify-between ">
          <Header headerTitle="" />
          <Pressable onPress={() => router.push(`/(tasks)/edit/${taskID}`)}>
            <Icon size="xl" className="mx-5 my-0  py-0 text-typography-500" as={Pencil} />
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
          {/* TODO: Add a button to mark the task as complete or incomplete */}
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
