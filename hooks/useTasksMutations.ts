import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Success, TaskFormData } from '~/types';

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: formData.title.trim(),
          notes: formData.notes.trim() || null,
          created_at: (formData.customStartDate || new Date()).toISOString(),
          repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
          repeat_frequency: formData.repeatFrequency || null,
          repeat_period: formData.repeatPeriod || null,
        })
        .select()
        .single();

      if (taskError) throw new Error('Failed to create task. Please try again.');
      if (!taskData) throw new Error('Failed to create task. No data returned.');

      if (formData.checklistItems.length > 0) {
        const { error: checklistError } = await supabase.from('checklistitems').insert(
          formData.checklistItems.map((item, index) => ({
            task_id: taskData.id,
            content: item.content.trim(),
            position: index,
            is_complete: false,
          }))
        );

        if (checklistError) {
          console.error('Checklist error:', checklistError);
          throw new Error('Failed to create checklist items. Please try again.');
        }
      }

      return taskData;
    },
    onSuccess: () => {
      // Invalidate and refetch the tasks query to update the list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      // Handle error appropriately, possibly with a toast or alert
    },
  });
}

export function useToggleComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: Readonly<{ taskId: number; isComplete: boolean }>
    ): Promise<Success> => {
      if (typeof params.isComplete === 'undefined') {
        return { success: false, error: 'isComplete is undefined!' };
      }

      try {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            is_complete: params.isComplete,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.taskId);

        if (updateError) {
          return { success: false, error: updateError.message };
        }

        if (params.isComplete) {
          const { error: logError } = await supabase
            .from('task_completion_history')
            .insert([{ task_id: params.taskId }]);

          if (logError) {
            return { success: false, error: logError.message };
          }
        }

        return { success: true };
      } catch (err) {
        console.error('Mutation failed:', err);
        return { success: false, error: 'An unexpected error occurred.' };
      }
    },
    onMutate: async (params) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      // Invalidate the query cache for the tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error toggling task completion:', error);
      // Handle error appropriately, possibly with a toast or alert
    },
  });
}
