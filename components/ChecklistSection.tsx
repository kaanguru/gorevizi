import { useState, useEffect, useCallback } from 'react';
import DraggableItem from '~/components/DraggableItem';
import { Box } from '~/components/ui/box';
import { HStack } from '~/components/ui/hstack';
import { Icon, AddIcon } from '~/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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

  useEffect(() => {
    setPositions(items.map((_, i) => i));
  }, [items.length]);

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
  }, []);

  const handleDragEnd = useCallback(
    (index: number, translationY: number) => {
      const newIndex = Math.round((translationY + index * 60) / 60);
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
    [items.length, setFormData]
  );

  return (
    <VStack space="md">
      <HStack space="md" className="items-center px-2">
        <Text>Add Routines</Text>
        <Button size="md" variant="link" onPress={onAdd}>
          <Icon as={AddIcon} className="text-typography-500" />
        </Button>
      </HStack>
      <Box className="relative" style={{ height: items.length * 60 + 16 }}>
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
      </Box>
    </VStack>
  );
};

export default ChecklistSection;
