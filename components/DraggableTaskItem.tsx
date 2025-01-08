/* eslint-disable functional/immutable-data */
import React from 'react';
import { Box } from './ui/box';
import { Text } from '@/components/ui/text';
import { Tables } from '~/database.types';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import { CheckIcon } from './ui/icon';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// eslint-disable-next-line functional/no-mixed-types
interface TaskItemProps {
  task: Tables<'tasks'>;
  index: number;
  onTaskUpdate: (task: Readonly<Tables<'tasks'>>) => Promise<void>;
  onReorder: (from: number, to: number) => void;
  onToggleComplete: (taskid: number, is_complete: boolean) => Promise<void>;
}

export function TaskItem({ task, index, onReorder, onToggleComplete }: Readonly<TaskItemProps>) {
  const pressed = useSharedValue(false);
  const itemHeight = 69;
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      const newIndex = Math.round(translateY.value / itemHeight) + index;
      if (newIndex !== index && newIndex >= 0 && newIndex < 20) {
        runOnJS(onReorder)(index, newIndex);
      }
      translateY.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isDragging.value ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Box className="flex flex-row border border-primary-800 p-6">
          <Checkbox
            className="basis-1/6"
            value={(task.id as number).toString()}
            isChecked={task.is_complete}
            onChange={(isChecked) => onToggleComplete(task.id, isChecked)}
            size="lg">
            <CheckboxIndicator className="h-8 w-8">
              <CheckboxIcon className="h-5 w-5 p-4" as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          <Text className="basis-5/6"> {task.title} </Text>
        </Box>
        {task.notes && (
          <Box className="mb-1 flex-row bg-background-300 p-1">
            <Text className="min-h-6 font-bold text-typography-700"> {task.notes} </Text>
          </Box>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
