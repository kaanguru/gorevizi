import { supabase } from './supabase';

async function getTaskCompletionHistory(taskId: number) {
  const { data, error } = await supabase
    .from('task_completion_history')
    .select('*')
    .eq('task_id', taskId)
    .order('completed_at', { ascending: true });

  if (error) {
    console.error('Error fetching completion history:', error);
    return [];
  }

  return data;
}
export default getTaskCompletionHistory;
