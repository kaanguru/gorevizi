import { Task } from '~/types';
import { supabase } from '../supabase';

export default async function updateTask(taskId: Task['id'], updates: Readonly<Partial<Task>>) {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', taskId).select();

  if (error) {
    console.error('Error updating task:', error);
    return null; // Return null on error instead of throwing
  }

  return data?.[0] || null; // Handle potential null or undefined data
}
