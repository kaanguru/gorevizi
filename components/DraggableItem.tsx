/* eslint-disable functional/immutable-data */
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useEffect, memo } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

import { Input, InputField } from './ui/input';

import { Box } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { TaskFormData } from '~/types';
import { Pressable } from './ui/pressable';

const ITEM_HEIGHT = 42;

const DraggableItem = memo(
  ({
    item,
    index,
    isDragging,
    onUpdate,
    onRemove,
    position,
    onDragStart,
    onDragEnd,
  }: Readonly<{
    item: TaskFormData['checklistItems'][number];
    index: number;
    isDragging: boolean;
    onUpdate: (index: number, content: string) => void;
    onRemove: (index: number) => void;
    position: number;
    onDragStart: () => void;
    onDragEnd: (translationY: number) => void;
  }>) => {
    const animatedValue = useSharedValue(position * ITEM_HEIGHT);
    const { theme } = useTheme();

    useEffect(() => {
      animatedValue.value = position * ITEM_HEIGHT;
    }, [position]);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        runOnJS(onDragStart)();
      })
      .onChange((event) => {
        animatedValue.value = event.translationY + position * ITEM_HEIGHT;
      })
      .onEnd((event) => {
        runOnJS(onDragEnd)(event.translationY);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: animatedValue.value }],
      zIndex: isDragging ? 1 : 0,
      position: 'relative',
      left: 0,
      right: 0,
    }));

    return (
      <GestureHandlerRootView>
        <Animated.View style={animatedStyle}>
          <Box className="my-1px-2 py-1">
            <HStack space="sm" className="items-center">
              <GestureDetector gesture={panGesture}>
                <Animated.View>
                  <FontAwesome5
                    name="grip-vertical"
                    size={18}
                    color={theme === 'dark' ? '#FFFAEB' : '#051824'}
                  />
                </Animated.View>
              </GestureDetector>
              <Input className="flex-1 bg-white" variant="rounded" size="md">
                <InputField
                  placeholder="Checklist item"
                  value={item.content}
                  onChangeText={(text) => {
                    onUpdate(index, text);
                  }}
                  className="min-h-[40px] py-2 text-typography-black"
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />
              </Input>
              <Pressable
                className="rounded-full bg-background-light p-1 dark:bg-background-dark"
                onPress={() => onRemove(index)}>
                <Ionicons
                  name="trash-bin"
                  size={24}
                  color={theme === 'dark' ? '#FFFAEB' : '#051824'}
                />
              </Pressable>
            </HStack>
          </Box>
        </Animated.View>
      </GestureHandlerRootView>
    );
  },
);

export default DraggableItem;
