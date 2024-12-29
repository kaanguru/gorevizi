import React from 'react';
import { Box } from './ui/box';
import { Text } from '@/components/ui/text';
import { Tables } from '~/database.types';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import { CheckIcon } from './ui/icon';
import { supabase } from '~/utils/supabase';

// eslint-disable-next-line functional/no-mixed-types
interface TaskItemProps {
  task: Tables<'tasks'>;
  onTaskUpdate: (task: Readonly<Tables<'tasks'>>) => Promise<void>;
  onReorder: (from: number, to: number) => void;
}
export function TaskItem({ task, onTaskUpdate, onReorder }: Readonly<TaskItemProps>) {
  const handleToggleComplete = async (task: Readonly<Tables<'tasks'>>): Promise<boolean> => {
    try {
      const updatedTask = { ...task, is_complete: !task.is_complete };
      const {} = await supabase
        .from('tasks')
        .update({ is_complete: updatedTask.is_complete })
        .eq('id', updatedTask.id);
      return task.is_complete ?? false;
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };
  return (
    <Box className="flex border border-gray-200 p-6">
      <Checkbox
        value={(task.id as number).toString()}
        isChecked={task.is_complete}
        onChange={handleToggleComplete(task)}
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
