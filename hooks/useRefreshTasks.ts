import { useCallback } from 'react';
import useTasksQueries from './useTasksQueries';

function useRefreshTasks() {
  const { refetch, isRefetching } = useTasksQueries();
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return { handleRefresh, isRefreshing: isRefetching };
}

export default useRefreshTasks;
