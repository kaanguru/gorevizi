import { View } from 'react-native';
import { Tables } from '@/database.types';
import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';

export default function Stats() {
  const task = { id: '1', name: 'Sample Task', completed: false } as unknown as Tables<'tasks'>;

  return (
    <View>
      <TaskSuccessPercentage task={task} />
    </View>
  );
}
