import { useQuery } from '@tanstack/react-query';
import { Tables } from '~/database.types';
import { supabase } from '~/utils/supabase';
import { TaskFilter } from '~/types';

export default function useTasksQuery(filter: TaskFilter = 'not-completed') {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => {
      if (filter === 'completed') return fetchCompletedTasks();
      if (filter === 'not-completed') return fetchNotCompletedTasks();
      return fetchAllTasks();
    },
  });
}
async function fetchNotCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', false)
    .order('position', { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}

async function fetchCompletedTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_complete', true)
    .order('position', { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}

async function fetchAllTasks(): Promise<Tables<'tasks'>[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return data;
}
