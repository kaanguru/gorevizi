import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';
import getCurrentDayOfWeek from '~/utils/getCurrentDayOfWeek';
import { addWeeks, addMonths, addYears, isSameDay, differenceInDays } from 'date-fns';

const today = new Date();
function isTaskDueToday(task: Readonly<Tables<'tasks'>>): boolean {
  const createdAtDate = new Date(task.created_at);

  switch (task.repeat_period) {
    case 'Daily':
      return isDailyTaskDueToday(createdAtDate, task.repeat_frequency);

    case 'Weekly':
      if (!task.repeat_on_wk) return false;
      const currentDayOfWeek = getCurrentDayOfWeek();
      if (!task.repeat_on_wk.includes(currentDayOfWeek as unknown as DayOfWeek)) return false;

      const daysSinceCreation = differenceInDays(today, createdAtDate);
      const weeksSinceCreation = Math.floor(daysSinceCreation / 7);
      const repeatFrequency = task.repeat_frequency ?? 1;

      return daysSinceCreation >= 0 && weeksSinceCreation % repeatFrequency === 0;

    case 'Monthly':
      return isSameDay(addMonths(createdAtDate, task.repeat_frequency ?? 1), today);

    case 'Yearly':
      return isSameDay(addYears(createdAtDate, task.repeat_frequency ?? 1), today);

    case null:
      return true;

    default:
      console.error('Task with unknown repeat_period:', task);
      return true;
  }
}

function isDailyTaskDueToday(createdAtDate: Date, repeat_frequency: number | null): boolean {
  const daysSinceCreation = differenceInDays(today, createdAtDate);
  const repeatFrequency = repeat_frequency ?? 1;
  return daysSinceCreation >= 0 && daysSinceCreation % repeatFrequency === 0;
}
export default isTaskDueToday;
