/* eslint-disable functional/immutable-data */
import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { GripVerticalIcon, Icon, TrashIcon } from './ui/icon';
import { Input, InputField } from './ui/input';
import { TaskFormData } from '~/types';

const DraggableItem = ({
  item,
  index,
  isDragging,
  onUpdate,
  onRemove,
  position,
  onDragStart,
  onDragActive,
  onDragEnd,
}: Readonly<{
  item: TaskFormData['checklistItems'][number];
  index: number;
  isDragging: boolean;
  onUpdate: (index: number, content: string) => void;
  onRemove: (index: number) => void;
  position: number;
  onDragStart: () => void;
  onDragActive: (translationY: number) => void;
  onDragEnd: (translationY: number) => void;
}>) => {
  const animatedValue = useSharedValue(position * 60);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    animatedValue.value = withSpring(position * 1);
  }, [position]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [item.content]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(onDragStart)();
    })
    .onChange((event) => {
      animatedValue.value = event.translationY + position * 20;
      runOnJS(onDragActive)(event.translationY);
    })
    .onEnd((event) => {
      runOnJS(onDragEnd)(event.translationY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedValue.value }],
    zIndex: isDragging ? 1 : 0,
    position: 'absolute',
    left: 0,
    right: 0,
  }));

  return (
    <GestureHandlerRootView>
      <Animated.View style={animatedStyle}>
        <Box className="mb-2 px-2">
          <HStack space="sm" className="items-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View>
                <Icon as={GripVerticalIcon} className="m-2 h-4 w-4 text-typography-500" />
              </Animated.View>
            </GestureDetector>
            <Input className="flex-1 bg-white" variant="rounded" size="md">
              <InputField
                ref={inputRef as any}
                placeholder="Checklist item"
                value={item.content}
                onChangeText={(text) => {
                  onUpdate(index, text);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                className="min-h-[40px] py-2 text-typography-900"
                placeholderTextColor="#9CA3AF"
              />
            </Input>
            <Button size="sm" variant="link" onPress={() => onRemove(index)}>
              <Icon as={TrashIcon} className="m-2 h-4 w-4 text-typography-500" />
            </Button>
          </HStack>
        </Box>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default DraggableItem;
