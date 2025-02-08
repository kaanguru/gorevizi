import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';
import resetTaskCompletionHistory from '~/utils/tasks/resetTaskCompletionHistory';

export default function useTaskCompletionHistory(taskID: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getTaskCompletionHistory(taskID),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory', taskID] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory', taskID]);
      queryClient.setQueryData(['taskCompletionHistory', taskID], (old: unknown) => [
        ...(old as Array<unknown>),
        { task_id: taskID, completed_at: new Date() },
      ]);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['taskCompletionHistory', taskID], context?.previousHistory);
      console.error('Error logging task completion:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCompletionHistory', taskID] });
    },
  });
}

export function useResetCompletionHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetTaskCompletionHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory'] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory']);
      queryClient.setQueryData(['taskCompletionHistory'], []);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['taskCompletionHistory'], context?.previousHistory);
      console.error('Error resetting completion history:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['taskCompletionHistory'],
        refetchType: 'active',
      });
    },
  });
}
export function useTaskCompletionCount() {
  return useQuery({
    queryKey: ['completedTasksCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('task_completion_history')
        .select('id', { count: 'exact', head: true });
      return count;
    },
  });
}
