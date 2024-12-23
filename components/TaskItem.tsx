import React from 'react';
import { Box } from './ui/box';
import { Text } from '@/components/ui/text';
import { Tables } from '~/database.types';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import { CheckIcon } from './ui/icon';
import { supabase } from '@/utils/supabase';

// eslint-disable-next-line functional/no-mixed-types
interface TaskItemProps {
  task: Tables<'tasks'>;
  onTaskUpdate: () => void;
}
export function TaskItem({ task, onTaskUpdate }: Readonly<TaskItemProps>) {
  const handleToggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_complete: !task.is_complete })
        .eq('id', task.id);

      if (error) {
        console.error('Error toggling task completion:', error);
        // Optionally handle the error, e.g., show a toast message
      } else {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Optionally handle the error, e.g., show a toast message
    }
  };
  return (
    <Box className="flex border border-gray-200 p-6">
      <Checkbox
        value={(task.id as number).toString()}
        isChecked={task.is_complete}
        onChange={handleToggleComplete}
        size="lg">
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>{task.title}</CheckboxLabel>
      </Checkbox>
      <Box className="mt-1 justify-center bg-blue-500 p-1">
        <Text className="font-bold text-typography-0"> {task.notes} </Text>
      </Box>
    </Box>
  );
}
