import { Tables } from '~/database.types';

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

type TaskItemProps = {
  task: Tables<'tasks'>;
  onTaskUpdate: () => Promise<void>;
};

type DraggableTaskProps = TaskItemProps & {
  index: number;
  isDragging: boolean;
  onUpdate: (updatedTask: Readonly<Tables<'tasks'>>) => void;
  onRemove: (taskId: number) => void;
  position: number;
  onDragStart: (index: number) => void;
  onDragEnd: (index: number) => void;
};
interface DraggableItemProps {
  item: TaskFormData['checklistItems'][number];
  index: number;
  isDragging: boolean;
  onUpdate: (index: number, content: string) => void;
  onRemove: (index: number) => void;
  position: number;
  onDragStart: () => void;
  onDragEnd: (translationY: number) => void;
}
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

export type {
  RepeatPeriod,
  DayOfWeek,
  TaskFormData,
  TaskItemProps,
  DraggableTaskProps,
  DraggableItemProps,
};
