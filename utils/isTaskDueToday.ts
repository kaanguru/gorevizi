import { Tables } from '~/database.types';
import { DayOfWeek } from '~/types';
import getCurrentDayOfWeek from '~/utils/getCurrentDayOfWeek';
import {
  addWeeks,
  addMonths,
  addYears,
  isSameDay,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

const today = new Date();
function isTaskDueToday(task: Readonly<Tables<'tasks'>>): boolean {
  const createdAtDate = new Date(task.created_at);
  const repeatFrequency = task.repeat_frequency ?? 1;
  const daysSinceCreation = differenceInDays(today, createdAtDate);
  switch (task.repeat_period) {
    case 'Daily':
      return isDailyTaskDueToday(daysSinceCreation, task.repeat_frequency);

    case 'Weekly':
      if (!task.repeat_on_wk) return false;
      const currentDayOfWeek = getCurrentDayOfWeek();
      if (!task.repeat_on_wk.includes(currentDayOfWeek as unknown as DayOfWeek)) return false;
      return differenceInWeeks(today, createdAtDate) % repeatFrequency === 0;

    case 'Monthly': {
      const monthsDiff = differenceInMonths(today, createdAtDate);
      if (monthsDiff <= 0) return false;
      if (monthsDiff % repeatFrequency !== 0) return false;
      const expectedDate = addMonths(createdAtDate, monthsDiff);
      console.log('🚀 ~ file: isTaskDueToday.ts:35 ~ expectedDate:', expectedDate);
      return isSameDay(expectedDate, today);
    }
    case 'Yearly': {
      const yearsDiff = differenceInYears(today, createdAtDate);
      if (yearsDiff < 0) return false;
      const expectedDate = addYears(createdAtDate, yearsDiff);
      return isSameDay(expectedDate, today);
    }
    case null:
      return true;

    default:
      console.error('Task with unknown repeat_period:', task);
      return true;
  }
}

function isDailyTaskDueToday(daysSinceCreation: number, repeat_frequency: number | null): boolean {
  const repeatFrequency = repeat_frequency ?? 1;
  return daysSinceCreation >= 0 && daysSinceCreation % repeatFrequency === 0;
}
export default isTaskDueToday;
