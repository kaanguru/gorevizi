import { useQuery } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Database } from '~/database.types';

type ChecklistItem = Database['public']['Tables']['checklistitems']['Row'];

export default function useChecklistItems(taskId: number | string) {
  const checklistItemsQuery = useQuery<ChecklistItem[], Error>({
    queryKey: ['checklistItems', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklistitems')
        .select('*')
        .eq('task_id', +taskId)
        .order('position', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!taskId, // Only run the query if taskId is truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3, // Retry on failure up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with a max of 30 seconds
  });

  return {
    ...checklistItemsQuery,
    checkListItems: checklistItemsQuery.data,
    isCheckListItemsLoading: checklistItemsQuery.isLoading,
    isCheckListItemsError: checklistItemsQuery.isError,
    checkListItemsError: checklistItemsQuery.error,
    checkListItemsLength: checklistItemsQuery.data?.length || 0,
  };
}
