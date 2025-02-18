/* eslint-disable functional/prefer-immutable-types */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { supabase } from '~/utils/supabase';
import updateTask from '~/utils/tasks/updateTask';
import { TaskFormData } from '~/types';
import { router } from 'expo-router';

export default function useChecklistItemMutations(taskID: number | string) {
  const queryClient = useQueryClient();

  const addChecklistItemMutation = useMutation({
    async mutationFn(content: string) {
      const { data, error } = await supabase
        .from('checklistitems')
        .insert({ content, task_id: +taskID })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['checklistItems', taskID],
      });
    },
    onError(error) {
      Alert.alert('Error', error.message);
    },
  });

  const updateChecklistItemMutation = useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      if (!taskID) throw new Error('No task ID');

      const updatedTask = await updateTask(+taskID, {
        title: formData.title.trim(),
        notes: formData.notes.trim() || null,
        created_at: (formData.customStartDate || new Date()).toISOString(),
        repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
        repeat_frequency: formData.repeatFrequency || null,
        repeat_period: formData.repeatPeriod || null,
      });

      if (!updatedTask) throw new Error('Failed to update task');

      const { error: deleteError } = await supabase
        .from('checklistitems')
        .delete()
        .eq('task_id', +taskID);

      if (deleteError) throw new Error('Failed to clear existing checklist items');

      if (formData.checklistItems.length > 0) {
        const { error: insertError } = await supabase.from('checklistitems').insert(
          formData.checklistItems.map((item, index) => ({
            task_id: +taskID,
            content: item.content.trim(),
            position: index,
            is_complete: item.isComplete || false,
          })),
        );

        if (insertError) throw new Error('Failed to update checklist items');
      }

      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.back();
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      Alert.alert('Error', error.message || 'Failed to update task');
    },
  });

  const deleteChecklistItemMutation = useMutation({
    async mutationFn(checklistItemId: number) {
      const { error } = await supabase.from('checklistitems').delete().eq('id', checklistItemId);

      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['checklistItems', taskID],
      });
    },
    onError(error) {
      Alert.alert('Error', error.message);
    },
  });
  const updateChecklistItemCompletionMutation = useMutation({
    async mutationFn({ id, is_complete }: { id: number; is_complete: boolean }) {
      const { data, error } = await supabase
        .from('checklistitems')
        .update({ is_complete, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['checklistItems', taskID],
      });
    },
    onError(error) {
      Alert.alert('Error', error.message);
    },
  });

  return {
    addChecklistItem: addChecklistItemMutation.mutateAsync,
    updateChecklistItem: updateChecklistItemMutation.mutateAsync,
    deleteChecklistItem: deleteChecklistItemMutation.mutateAsync,
    updateChecklistItemCompletion: updateChecklistItemCompletionMutation.mutateAsync,
  };
}
