/* eslint-disable functional/immutable-data */
import React from 'react';
import { Pressable } from './ui/pressable';
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
import { Box } from './ui/box';

interface TaskItemProps {
  task: Readonly<Tables<'tasks'>>;
  index: number;
  onTaskUpdate: (task: Readonly<Tables<'tasks'>>) => Promise<void>;
  onReorder: (from: number, to: number) => void;
  onToggleComplete: (params: Readonly<{ taskId: number; isComplete: boolean }>) => void;
  onPress: () => void;
}

export function TaskItem({
  task,
  index,
  onReorder,
  onToggleComplete,
  onPress,
}: Readonly<TaskItemProps>) {
  const pressed = useSharedValue(false);
  const itemHeight = 94;
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

  const handleToggleComplete = () => {
    onToggleComplete({ taskId: task.id, isComplete: !task.is_complete });
  };
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Task: ${task.title}`}
          className="flex flex-row border border-primary-800 p-6">
          <Checkbox
            className="basis-1/6"
            value={task.id.toString()}
            isChecked={task.is_complete}
            onChange={handleToggleComplete}
            size="lg">
            <CheckboxIndicator className="h-8 w-8">
              <CheckboxIcon className="h-5 w-5 p-4" as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          <Text className="basis-5/6">{task.title}</Text>
        </Pressable>
        {task.notes && (
          <Box className="mb-1 flex-row bg-background-300 p-1">
            <Text className="min-h-6 font-bold text-typography-700">{task.notes}</Text>
          </Box>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
