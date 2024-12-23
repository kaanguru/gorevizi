import React from 'react';
import { Box } from './ui/box';
import { Text } from '@/components/ui/text';
import { Tables } from '~/database.types';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import { CheckIcon } from './ui/icon';
interface TaskItemProps {
  task: Tables<'tasks'>;
}
export function TaskItem({ task }: Readonly<TaskItemProps>) {
  const handleToggleComplete = () => {
    return null;
  };
  return (
    <Box className="flex flex-row items-center border border-gray-200 p-6">
      <Checkbox value={(task.id as number).toString()} onChange={handleToggleComplete} size="md">
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>{task.title}</CheckboxLabel>
      </Checkbox>
      <Box className="h-45 w-80 items-center justify-center bg-blue-500">
        <Text className="font-bold text-typography-0">BOX</Text>
      </Box>
    </Box>
  );
}
