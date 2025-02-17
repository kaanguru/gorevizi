/* eslint-disable functional/immutable-data */
//DraggableTaskItem.tsx
import React, { memo } from 'react';
import { Pressable } from './ui/pressable';
import { Text } from '@/components/ui/text';
import { TaskItemProps } from '~/types';
import useChecklistItems from '~/hooks/useCheckListQueries';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from './ui/checkbox';
import { CheckIcon, Icon } from './ui/icon';
import { Box } from './ui/box';
import { Waypoints, GripVertical } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import shortenText from '~/utils/shortenText';

// Define a comparison function for memo
const areEqual = (prevProps: Readonly<TaskItemProps>, nextProps: Readonly<TaskItemProps>) => {
  // Compare relevant props that affect rendering
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.is_complete === nextProps.task.is_complete &&
    prevProps.index === nextProps.index // Important: Compare the index
  );
};

export const TaskItem = memo(
  ({ task, index, onReorder, onToggleComplete, onPress, isFiltered }: Readonly<TaskItemProps>) => {
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
      })
      .enabled(isFiltered); // Conditionally enable/disable the gesture

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
      onToggleComplete({ taskID: task.id, isComplete: !task.is_complete });
    };
    return (
      <Animated.View style={animatedStyle}>
        <Box
          style={{ backgroundColor: '#4F10A8' }}
          className="flex h-[94px] flex-row place-content-baseline justify-between gap-3 rounded-lg pe-0 opacity-100">
          <Checkbox
            value={task.id.toString()}
            isChecked={task.is_complete}
            onChange={handleToggleComplete}
            size="lg"
            className="ms-3 ">
            <CheckboxIndicator
              size="lg"
              className="h-8 w-8  bg-background-400 text-white dark:bg-background-light">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>

          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            className=" flex grow flex-col">
            <Box className="my-auto flex-row justify-center  py-2">
              <Text bold size="lg" className="grow text-typography-white">
                {task.title}
              </Text>

              {taskHasChecklistItems && !isCheckListItemsLoading ? (
                <>
                  <Text size="sm" className="me-1 text-typography-white">
                    {checkListItemsLength}
                  </Text>
                  <Icon className="me-2 text-end text-typography-white" as={Waypoints} />
                </>
              ) : (
                isCheckListItemsLoading && <ActivityIndicator size="small" color="#FF006E" />
              )}
            </Box>
            {task.notes && (
              <Box
                style={{ backgroundColor: '#23074B' }}
                className="absolute bottom-0 left-0 right-1 -z-10 max-h-7 rounded-sm  px-1 py-0 ">
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
                      color: '#fff',
                    },
                  }}>
                  {shortenText(task.notes)}
                </Markdown>
              </Box>
            )}
          </Pressable>
          {isFiltered && (
            <GestureDetector gesture={panGesture}>
              <Box className=" h-full w-9">
                <Icon as={GripVertical} size="xl" className="m-auto  text-white" />
              </Box>
            </GestureDetector>
          )}
        </Box>
      </Animated.View>
    );
  },
  areEqual // Pass the comparison function to memo
);
