/* eslint-disable functional/immutable-data */
import { supabase } from '@/utils/supabase';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Box } from './ui/box';
import { CheckIcon, GripVerticalIcon, Icon } from './ui/icon';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { DraggableTaskProps } from '~/types';

export function DraggableTaskItem({
  task,
  index,
  position,
  onDragStart,
  onDragEnd,
  onTaskUpdate,
}: Readonly<DraggableTaskProps>) {
  const ITEM_HEIGHT = 60;
  const animatedValue = useSharedValue(position * ITEM_HEIGHT);
  const startY = useSharedValue(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    animatedValue.value = withSpring(position * ITEM_HEIGHT);
  }, [position]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = animatedValue.value;
      setDragging(true);
    })
    .onChange((event) => {
      animatedValue.value = event.translationY + startY.value;
    })
    .onFinalize((event) => {
      onDragEnd(event.translationY);
      setDragging(false);
    })
    .simultaneousWithExternalGesture(Gesture.Fling());
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedValue.value }],
    zIndex: dragging ? 1 : 0,
  }));

  const handleToggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_complete: !task.is_complete })
        .eq('id', task.id);

      if (error) {
        console.error('Error toggling task completion:', error);
      } else {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  useEffect(() => {
    if (dragging) {
      onDragStart(index);
    }
  }, [dragging, onDragStart, index]);

  return (
    <Animated.View style={animatedStyle}>
      <Box className="flex border border-gray-200 p-6">
        <GestureDetector gesture={panGesture}>
          <Animated.View>
            <Icon as={GripVerticalIcon} className="m-2 h-4 w-4 text-typography-500" />
          </Animated.View>
        </GestureDetector>
        <Checkbox
          value={(task.id as number).toString()}
          isChecked={task.is_complete}
          onChange={handleToggleComplete}
          size="lg">
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel>{task.title}</CheckboxLabel>
        </Checkbox>
        <Box className="mt-1 justify-center bg-blue-500 p-1">
          <Text className="font-bold text-typography-0"> {task.notes} </Text>
        </Box>
      </Box>
    </Animated.View>
  );
}
