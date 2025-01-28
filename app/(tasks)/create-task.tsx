import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import { AddIcon, ChevronDownIcon, Icon } from '~/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { ScrollView } from 'react-native';
import { RepeatPeriod, TaskFormData } from '../../types';
import { supabase } from '@/utils/supabase';
import { useMutation } from '@tanstack/react-query';
import Header from '~/components/Header';
import DraggableItem from '~/components/DraggableItem';
import WeekdaySelector from '~/components/WeekDaySelector';
import { RepeatFrequencySlider } from '~/components/RepeatFrequencySlider';

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

  const handleDragActive = useCallback(() => {
    // Optional: Add any active drag handling logic
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
            key={`${index}-${item.content}`}
            item={item}
            index={index}
            isDragging={draggingIndex === index}
            onUpdate={onUpdate}
            onRemove={onRemove}
            position={positions[index] || index}
            onDragStart={() => handleDragStart(index)}
            onDragActive={handleDragActive}
            onDragEnd={(translationY) => handleDragEnd(index, translationY)}
          />
        ))}
      </Box>
    </VStack>
  );
};

export default function CreateTask() {
  const router = useRouter();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    notes: '',
    repeatPeriod: '',
    repeatFrequency: 1,
    repeatOnWk: [],
    customStartDate: null,
    isCustomStartDateEnabled: false,
    checklistItems: [],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insertMutation = useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: formData.title.trim(),
          notes: formData.notes.trim() || null,
          created_at: (formData.customStartDate || new Date()).toISOString(),
          repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
          repeat_frequency: formData.repeatFrequency || null,
          repeat_period: formData.repeatPeriod || null,
        })
        .select()
        .single();

      if (taskError) throw new Error('Failed to create task. Please try again.');
      if (!taskData) throw new Error('Failed to create task. No data returned.');

      if (formData.checklistItems.length > 0) {
        const { error: checklistError } = await supabase.from('checklistitems').insert(
          formData.checklistItems.map((item, index) => ({
            task_id: taskData.id,
            content: item.content.trim(),
            position: index,
            is_complete: false,
          }))
        );

        if (checklistError) {
          console.error('Checklist error:', checklistError);
          throw new Error('Failed to create checklist items. Please try again.');
        }
      }

      return taskData;
    },
    onSuccess: () => router.back(),
    onError: (error) => {
      console.error('Error creating task:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    },
  });
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (formData.checklistItems.some((item) => !item.content.trim())) {
      Alert.alert('Error', 'All checklist items must have content');
      return;
    }
    insertMutation.mutate(formData);
  };

  const handleAddChecklistItem = () => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        {
          content: '',
          isComplete: false,
          position: prev.checklistItems.length,
        },
      ],
    }));
  };

  const handleRemoveChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateChecklistItem = (index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.map((item, i) =>
        i === index ? { ...item, content } : item
      ),
    }));
  };

  return (
    <VStack space="xl" className="flex-1 bg-white">
      <Header onBack={() => router.back()} />
      <Box className="flex-1">
        <ScrollView className="flex-1 px-4">
          <VStack space="md">
            <Input size="md" variant="rounded" className="bg-white">
              <InputField
                placeholder="Task title"
                value={formData.title}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
                className="min-h-[40px] py-2 text-typography-900"
                placeholderTextColor="#9CA3AF"
              />
            </Input>

            <Textarea size="md" className="bg-white">
              <TextareaInput
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, notes: text }))}
                className="min-h-[80px] py-2 text-typography-900"
                placeholderTextColor="#9CA3AF"
              />
            </Textarea>

            <Select
              selectedValue={formData.repeatPeriod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, repeatPeriod: value as RepeatPeriod | '' }))
              }>
              <SelectTrigger variant="rounded" size="xl" className="justify-between">
                <SelectInput placeholder="Select repeat period" />
                <SelectIcon className="ml-auto" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="No Repeat" value="" />
                  <SelectItem label="Daily" value="Daily" />
                  <SelectItem label="Weekly" value="Weekly" />
                  <SelectItem label="Monthly" value="Monthly" />
                  <SelectItem label="Yearly" value="Yearly" />
                </SelectContent>
              </SelectPortal>
            </Select>

            {(formData.repeatPeriod === 'Daily' || formData.repeatPeriod === 'Monthly') && (
              <RepeatFrequencySlider
                period={formData.repeatPeriod}
                frequency={formData.repeatFrequency}
                onChange={(value) => setFormData((prev) => ({ ...prev, repeatFrequency: value }))}
              />
            )}

            {formData.repeatPeriod === 'Weekly' && (
              <Box className="mt-4 p-2">
                <HStack space="md" className="mb-4">
                  <Text className="w-1/6">Repeat Every</Text>
                  <RepeatFrequencySlider
                    period={formData.repeatPeriod}
                    frequency={formData.repeatFrequency}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, repeatFrequency: value }))
                    }
                  />
                </HStack>
                <HStack space="md">
                  <Text className="mb-2">Repeat on</Text>
                </HStack>
                <WeekdaySelector
                  selectedDays={formData.repeatOnWk}
                  onDayToggle={(day, isSelected) => {
                    setFormData((prev) => ({
                      ...prev,
                      repeatOnWk: isSelected
                        ? [...prev.repeatOnWk, day]
                        : prev.repeatOnWk.filter((d) => d !== day),
                    }));
                  }}
                />
              </Box>
            )}

            {formData.repeatPeriod === 'Yearly' && (
              <Box className="mt-4">
                <HStack space="md">
                  <Text>Repeat Every Year</Text>
                </HStack>
              </Box>
            )}

            <Box className="mt-4">
              <HStack space="md" className="items-center">
                <Checkbox
                  value="custom-start-date"
                  isChecked={formData.isCustomStartDateEnabled}
                  onChange={(isSelected) => {
                    setFormData((prev) => ({
                      ...prev,
                      isCustomStartDateEnabled: isSelected,
                      customStartDate: isSelected ? new Date() : null,
                    }));
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Custom Start Date</CheckboxLabel>
                </Checkbox>
              </HStack>
            </Box>

            {formData.isCustomStartDateEnabled && (
              <Box className="mt-4">
                <HStack space="xl">
                  <Text className="my-auto text-typography-black">Start Date</Text>
                  <Text className="my-auto">{formData.customStartDate?.toDateString()}</Text>
                  <Button size="xs" variant="outline" onPress={() => setShowDatePicker(true)}>
                    <ButtonText>Change Date</ButtonText>
                  </Button>
                </HStack>
              </Box>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={formData.customStartDate || new Date()}
                mode="date"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData((prev) => ({ ...prev, customStartDate: selectedDate }));
                  }
                }}
              />
            )}

            <ChecklistSection
              items={formData.checklistItems}
              onAdd={handleAddChecklistItem}
              onRemove={handleRemoveChecklistItem}
              onUpdate={handleUpdateChecklistItem}
              setFormData={setFormData}
            />
          </VStack>
        </ScrollView>
      </Box>
      <Box className="px-4 py-2">
        <Button
          onPress={handleCreate}
          testID="create-task-button"
          disabled={insertMutation.isPending}>
          <ButtonText>{insertMutation.isPending ? 'Creating...' : 'Create'}</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
}
