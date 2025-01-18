import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';
import getCurrentDayOfWeek from '~/utils/getCurrentDayOfWeek';
import { addDays, addWeeks, addMonths, addYears, isSameDay } from 'date-fns';

function isTaskDueToday(task: Readonly<Tables<'tasks'>>): boolean {
  const createdAtDate = new Date(task.created_at);
  const today = new Date();

  switch (task.repeat_period) {
    case 'Daily':
      return isSameDay(addDays(createdAtDate, task.repeat_frequency ?? 0), today);

    case 'Weekly':
      if (!task.repeat_on_wk) return false;
      const currentDayOfWeek = getCurrentDayOfWeek();
      return (
        task.repeat_on_wk.includes(currentDayOfWeek as unknown as DayOfWeek) &&
        isSameDay(addWeeks(createdAtDate, task.repeat_frequency ?? 0), today)
      );

    case 'Monthly':
      return isSameDay(addMonths(createdAtDate, task.repeat_frequency ?? 1), today);

    case 'Yearly':
      return isSameDay(addYears(createdAtDate, task.repeat_frequency ?? 1), today);

    case null:
      return true;

    default:
      return false;
  }
}

export default isTaskDueToday;
