// Types

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface TaskFormData {
  title: string;
  notes: string;
  repeatPeriod: RepeatPeriod | '';
  repeatFrequency: number;
  repeatOnWk: DayOfWeek[];
  customStartDate: Date | null;
  isCustomStartDateEnabled: boolean;
  checklistItems: Array<{
    content: string;
    isComplete: boolean;
    position: number;
  }>; 
}

export type { RepeatPeriod, DayOfWeek, TaskFormData };
