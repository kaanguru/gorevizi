import { View } from 'react-native';
import { Tables } from '@/database.types';
import useTasksQuery from '~/hooks/useTasksQuery';
import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';

export default function Stats() {
  const { activeTasks, completedTasks } = useTasksQuery();

  return (
    <View>{activeTasks?.map((task) => <TaskSuccessPercentage key={task.id} task={task} />)}</View>
  );
}
