/* eslint-disable functional/immutable-data */
import React from 'react';
import { Pressable } from './ui/pressable';
import { Text } from '@/components/ui/text';
import { Tables } from '~/database.types';
import useChecklistItems from '~/hooks/useCheckListQueries';

import { Checkbox, CheckboxIcon, CheckboxIndicator } from './ui/checkbox';
import { CheckIcon, Icon } from './ui/icon';
import { Box } from './ui/box';
import { Waypoints } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';

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

  const { checkListItemsLength, isCheckListItemsLoading } = useChecklistItems(task.id);

  const taskHasChecklistItems = checkListItemsLength > 0;
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
          className="flex flex-row border border-primary-800 p-7">
          <Checkbox
            value={task.id.toString()}
            isChecked={task.is_complete}
            onChange={handleToggleComplete}
            size="lg">
            <CheckboxIndicator size="lg" className="h-8 w-8 basis-1/12">
              <CheckboxIcon className="p-4" as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          <Text className="ms-3 basis-5/6 text-typography-700">{task.title}</Text>
          {taskHasChecklistItems && !isCheckListItemsLoading && (
            <Icon className="text-end text-typography-500" as={Waypoints} />
          )}
          {isCheckListItemsLoading && <ActivityIndicator size="small" color="#0000ff" />}
          {task.notes && (
            <Box className="ms-safe-or-16 absolute bottom-0 left-0 right-0 bg-background-300 px-2">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="min-h-6 font-bold text-typography-700">
                {task.notes}
              </Text>
            </Box>
          )}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
