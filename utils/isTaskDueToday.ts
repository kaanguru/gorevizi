import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';
import getCurrentDayOfWeek from '~/utils/getCurrentDayOfWeek';

export default function isTaskDueToday(task: Readonly<Tables<'tasks'>>): boolean {
  return task.repeat_on_wk ? true : false;
  /* if (!task.repeat_on_wk && !task.repeat_frequency && !task.repeat_period) {
    return true; // Task has no due date
  }

  if (task.repeat_period === 'Daily') {
    return true; // TODO: Add logic to check if the task is due today based on the start date and repeat frequency
  }

  if (task.repeat_period === 'Weekly' && task.repeat_on_wk) {
    const today = getCurrentDayOfWeek;
    return task.repeat_on_wk.includes(today as unknown as DayOfWeek);
  }

  // Add more logic for Monthly and Yearly tasks if needed

  return false; */
}
