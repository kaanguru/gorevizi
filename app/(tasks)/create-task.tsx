import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import ChecklistSection from '~/components/ChecklistSection';
import { FormInput } from '~/components/FormInput';
import Header from '~/components/Header';
import { RepeatFrequencySlider } from '~/components/RepeatFrequencySlider';
import RepeatPeriodSelector from '~/components/RepeatPeriodSelector';
import { Box } from '~/components/ui/box';
import { Button, ButtonText } from '~/components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '~/components/ui/checkbox';
import { HStack } from '~/components/ui/hstack';
import { Text } from '~/components/ui/text';
import { VStack } from '~/components/ui/vstack';
import WeekdaySelector from '~/components/WeekDaySelector';
import { useUpdateHealthAndHappiness } from '~/hooks/useHealthAndHappinessMutations';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import { useCreateTask } from '~/hooks/useTasksMutations';
import { useUser } from '~/hooks/useUser';
import { RepeatPeriod, TaskFormData } from '~/types';
import genRandomInt from '~/utils/genRandomInt';

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
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { data: user } = useUser();
  const { mutate: updateHealthAndHappiness, isPending: isCreatingHealthAndHappiness } =
    useUpdateHealthAndHappiness();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);
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
      onSuccess: () => {
        updateHealthAndHappiness({
          user_id: user?.id,
          health: (healthAndHappiness?.health ?? 0) + genRandomInt(2, 4),
          happiness: (healthAndHappiness?.happiness ?? 0) + genRandomInt(8, 24),
        });
        router.push('/(drawer)');
      },
      onError: (error) => {
        console.error('Error creating task:', error);
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      },
    });
  };

  const handleAddChecklistItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        {
          content: '',
          isComplete: false,
          position: prev.checklistItems.length,
          id: Date.now().toString(),
        },
      ],
    }));
  }, []);

  const handleRemoveChecklistItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== index),
    }));
  }, []);

  const handleUpdateChecklistItem = useCallback((index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.toSpliced(index, 1, {
        ...prev.checklistItems[index],
        content,
      }),
    }));
  }, []);
  return (
    <VStack space="xl" className="flex-1 bg-background-light dark:bg-background-dark">
      <Header headerTitle="Create Task" />
      <Box className="flex-1">
        <ScrollView className="flex-1 px-4">
          <VStack space="md">
            <FormInput
              title={formData.title}
              notes={formData.notes}
              setTitle={(title: string) => setFormData((prev) => ({ ...prev, title }))}
              setNotes={(notes: string) => setFormData((prev) => ({ ...prev, notes }))}
            />
            <RepeatPeriodSelector
              repeatPeriod={formData.repeatPeriod}
              setRepeatPeriod={(value: string) =>
                setFormData((prev) => ({ ...prev, repeatPeriod: value as RepeatPeriod | '' }))
              }
            />

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
