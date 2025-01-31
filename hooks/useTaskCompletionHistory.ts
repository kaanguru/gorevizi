import { useMutation, useQueryClient } from '@tanstack/react-query';
import getTaskCompletionHistory from '~/utils/tasks/getTaskCompletionHistory';
import resetTaskCompletionHistory from '~/utils/tasks/resetTaskCompletionHistory';

export default function useTaskCompletionHistory(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getTaskCompletionHistory(taskId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory', taskId] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory', taskId]);
      queryClient.setQueryData(['taskCompletionHistory', taskId], (old: unknown) => [
        ...(old as Array<unknown>),
        { task_id: taskId, completed_at: new Date() },
      ]);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['taskCompletionHistory', taskId], context?.previousHistory);
      console.error('Error logging task completion:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCompletionHistory', taskId] });
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
