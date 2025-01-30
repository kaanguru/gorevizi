import { useQuery } from '@tanstack/react-query';
import { Tables } from '~/database.types';
import { supabase } from '~/utils/auth/supabase';

export default function useTasksQuery() {
  const active = useQuery<Tables<'tasks'>[]>({
    queryKey: ['tasks', 'active'],
    queryFn: fetchNotCompletedTasks,
  });

  const completed = useQuery<Tables<'tasks'>[]>({
    queryKey: ['tasks', 'completed'],
    queryFn: fetchCompletedTasks,
  });
  const all = useQuery<Tables<'tasks'>[]>({
    queryKey: ['tasks', 'all'],
    queryFn: fetchAllTasks,
  });

  return {
    activeTasks: active.data || [],
    completedTasks: completed.data || [],
    allTasks: all.data || [],
    isLoading: active.isLoading || completed.isLoading || all.isLoading,
    status: [active.status, completed.status, all.status],
    error: active.error || completed.error || all.error,
    refetch: () => {
      active.refetch();
      completed.refetch();
      all.refetch();
    },
    isRefetching: active.isRefetching || completed.isRefetching || all.isRefetching,
  };
}
async function fetchNotCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', false)
    .order('position', { ascending: true, nullsFirst: true });

  if (error) return Promise.reject(new Error(error.message));
  return data;
}
async function fetchCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', true)
    .order('position', { ascending: true, nullsFirst: true });

  if (error) return Promise.reject(new Error(error.message));
  return data;
}
async function fetchAllTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true, nullsFirst: true });

  if (error) return Promise.reject(new Error(error.message));
  return data;
}
