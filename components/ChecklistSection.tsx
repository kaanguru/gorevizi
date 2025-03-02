import { FontAwesome6 } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';

import DraggableItem from '~/components/DraggableItem';
import { Button, ButtonText } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { VStack } from '~/components/ui/vstack';
import { TaskFormData } from '~/types';

const ChecklistSection = ({
  items,
  onAdd,
  onRemove,
  onUpdate,
  setFormData,
}: Readonly<{
  items: TaskFormData['checklistItems'];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, content: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}>) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<number[]>([]);
  const { theme } = useTheme();
  const ITEM_HEIGHT = 42;

  useEffect(() => {
    setPositions(items.map((_, i) => i));
  }, [items.length]);

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
  }, []);

  const handleDragEnd = useCallback(
    (index: number, translationY: number) => {
      const newIndex = Math.round((translationY + index * ITEM_HEIGHT) / ITEM_HEIGHT);
      const validIndex = Math.max(0, Math.min(newIndex, items.length - 1));

      if (validIndex !== index) {
        setFormData((prev) => {
          const newItems = [...prev.checklistItems];
          // eslint-disable-next-line functional/immutable-data
          const [movedItem] = newItems.splice(index, 1);
          // eslint-disable-next-line functional/immutable-data
          newItems.splice(validIndex, 0, movedItem);

          return {
            ...prev,
            checklistItems: newItems.map((item, idx) => ({
              ...item,
              position: idx,
            })),
          };
        });
      }
      setDraggingIndex(null);
    },
    [items.length, setFormData],
  );

  return (
    <VStack space="sm" className="my-0">
      <HStack space="md" className="my-0 items-center px-2">
        <Button size="md" variant="outline" action="secondary" onPress={onAdd}>
          <ButtonText size="lg" className="text-typography-black dark:text-typography-white">
            Add Routines
          </ButtonText>
          <FontAwesome6 name="add" size={16} color={theme === 'dark' ? '#FFFAEB' : '#051824'} />
        </Button>
      </HStack>
      <VStack
        className="relative mb-6"
        style={{
          height: ITEM_HEIGHT * items.length,
        }}>
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            index={index}
            isDragging={draggingIndex === index}
            onUpdate={onUpdate}
            onRemove={onRemove}
            position={positions[index] || index}
            onDragStart={() => handleDragStart(index)}
            onDragEnd={(translationY) => handleDragEnd(index, translationY)}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default ChecklistSection;
