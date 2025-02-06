/* eslint-disable functional/immutable-data */
import React from 'react';
import { Pressable } from './ui/pressable';
import { Text } from '@/components/ui/text';
import { TaskItemProps } from '~/types';
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
  withTiming,
} from 'react-native-reanimated';
import { ActivityIndicator, TextStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import shortenText from '~/utils/shortenText';

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
  const opacity = useSharedValue(1);
  const handleFadeOut = () => {
    opacity.value = withTiming(0, {
      duration: 300,
    });
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isDragging.value ? 1 : 0,
    opacity: opacity.value,
  }));

  const handleToggleComplete = () => {
    handleFadeOut();
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
            <>
              <Text size="sm" className="me-2">
                {checkListItemsLength}
              </Text>
              <Icon className="text-end text-typography-500" as={Waypoints} />
            </>
          )}
          {isCheckListItemsLoading && <ActivityIndicator size="small" color="#0000ff" />}
          {task.notes && (
            <Box className="ms-safe-or-16 absolute bottom-0 left-2 right-0 -z-10 max-h-7 bg-background-300 px-2 py-0">
              <Markdown
                mergeStyle={false}
                style={{
                  body: {
                    padding: 0,
                    marginTop: -5,
                    height: 40,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  text: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}>
                {shortenText(task.notes)}
              </Markdown>
            </Box>
          )}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
