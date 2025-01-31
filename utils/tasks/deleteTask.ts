import { Task } from '~/types';
import { supabase } from '../supabase';

export default async function deleteTask(taskId: Task['id']) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    return null; // Return null on error instead of throwing
  }

  return null; // Return null to indicate successful deletion
}
