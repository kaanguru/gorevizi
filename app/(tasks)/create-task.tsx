import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from '@/components/ui/alert-dialog';
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
import { AlertCircleIcon, TrashIcon, AddIcon, ChevronDownIcon, Icon } from '~/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { RepeatPeriod, TaskFormData } from '../../types';
import { useCreateTaskMutation } from '~/hooks/useTasksQuery';
import ChecklistSection from './ChecklistSection';
import Header from '~/components/Header';
import DraggableItem from '~/components/DraggableItem';
import WeekdaySelector from '~/components/WeekDaySelector';
import { RepeatFrequencySlider } from '~/components/RepeatFrequencySlider';

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
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTaskMutation();

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (formData.checklistItems.some((item) => !item.content.trim())) {
      Alert.alert('Error', 'All checklist items must have content');
      return;
    }
    createTask(formData, {
      onSuccess: () => router.back(),
      onError: (error) => {
        console.error('Error creating task:', error);
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      },
    });
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
                onChangeText={(text: string) => setFormData((prev) => ({ ...prev, title: text }))}
                className="min-h-[40px] py-2 text-typography-900"
                placeholderTextColor="#9CA3AF"
              />
            </Input>

            <Textarea size="md" className="bg-white">
              <TextareaInput
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(text: string) => setFormData((prev) => ({ ...prev, notes: text }))}
                className="min-h-[80px] py-2 text-typography-900"
                placeholderTextColor="#9CA3AF"
              />
            </Textarea>

            <Select
              selectedValue={formData.repeatPeriod}
              onValueChange={(value: string) =>
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
                  onChange={(isSelected: boolean) => {
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
        <Button onPress={handleCreate} testID="create-task-button" disabled={isCreatingTask}>
          <ButtonText>{isCreatingTask ? 'Creating...' : 'Create'}</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
}
