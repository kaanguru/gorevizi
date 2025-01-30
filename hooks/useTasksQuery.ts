import { useQuery } from '@tanstack/react-query';
import { Tables } from '~/database.types';
import { supabase } from '~/utils/auth/supabase';

export default function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchNotCompletedTasks,
  });
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
