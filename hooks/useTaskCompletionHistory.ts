import { useMutation, useQueryClient } from '@tanstack/react-query';
import getTaskCompletionHistory from '~/utils/getTaskCompletionHistory';

export default function useTaskCompletionHistory(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getTaskCompletionHistory(taskId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['taskCompletionHistory', taskId] });
      const previousHistory = queryClient.getQueryData(['taskCompletionHistory', taskId]);
      queryClient.setQueryData(['taskCompletionHistory', taskId], (old: any) => [
        ...old,
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
