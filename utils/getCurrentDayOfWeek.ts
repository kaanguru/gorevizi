import { DayOfWeek } from '~/app/(tasks)/types';

export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return days[today.getDay()];
}
