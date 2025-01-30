import { supabase } from '../auth/supabase';

async function resetRecurringTasks() {
  const { error } = await supabase
    .from('tasks')
    .update({ is_complete: false })
    .neq('repeat_period', null);

  if (error) {
    console.error('Error resetting recurring tasks:', error);
  }
}
export default resetRecurringTasks;
