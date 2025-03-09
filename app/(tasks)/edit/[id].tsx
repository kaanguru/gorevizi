// app/(tasks)/edit/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';

import ChecklistSection from '~/components/ChecklistSection';
import { FormInput } from '~/components/FormInput';
import Header from '~/components/Header';
import { RepeatFrequencySlider } from '~/components/RepeatFrequencySlider';
import RepeatPeriodSelector from '~/components/RepeatPeriodSelector';
import { Box } from '~/components/ui/box';
import { Button, ButtonText } from '~/components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxLabel } from '~/components/ui/checkbox';
import { HStack } from '~/components/ui/hstack';
import { Text } from '~/components/ui/text';
import { VStack } from '~/components/ui/vstack';
import WeekdaySelector from '~/components/WeekDaySelector';
import useChecklistItemMutations from '~/hooks/useCheckListMutations';
import useChecklistItems from '~/hooks/useCheckListQueries';
import { useUpdateTask, useDeleteTask } from '~/hooks/useTasksMutations';
import { useTaskById } from '~/hooks/useTasksQueries';
import { RepeatPeriod, TaskFormData } from '~/types';
import createTaskUpdate from '~/utils/createTaskUpdate';

const EditTask = () => {
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { checkListItems, isCheckListItemsLoading, isCheckListItemsError } =
    useChecklistItems(taskID);
  const { data: theTask, isLoading, isError } = useTaskById(taskID);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { updateChecklistItem } = useChecklistItemMutations(taskID);

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
  const [initialLoad, setInitialLoad] = useState(true);

  // Memoize the loading state to prevent unnecessary re-renders
  const loading = useMemo(
    () => initialLoad || isLoading || isCheckListItemsLoading,
    [initialLoad, isLoading, isCheckListItemsLoading],
  );

  useEffect(() => {
    const loadTaskData = async () => {
      if (theTask) {
        // Use functional updates for state
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: theTask.title || '',
          notes: theTask.notes || '',
          repeatPeriod: theTask.repeat_period || '',
          repeatFrequency: theTask.repeat_frequency || 1,
          repeatOnWk: theTask.repeat_on_wk || [],
          customStartDate: theTask.created_at ? new Date(theTask.created_at) : null,
          isCustomStartDateEnabled: !!theTask.created_at,
          checklistItems:
            checkListItems?.map((item) => ({
              id: item.id.toString(),
              content: item.content,
              isComplete: item.is_complete,
              position: item.position ?? 0,
            })) || [],
        }));
        setInitialLoad(false);
      }
    };

    loadTaskData();
  }, [theTask, taskID, checkListItems]);

  const handleSave = () => {
    if (!theTask) {
      Alert.alert('Error', 'Task data is not available');
      return;
    }

    const taskToUpdate = createTaskUpdate(formData, theTask, taskID);

    updateTaskMutation.mutate(taskToUpdate, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to update task');
        console.error(error);
      },
    });
    updateChecklistItem(formData);
  };

  const handleDelete = async () => {
    deleteTaskMutation.mutate(taskID);
    router.push('/(drawer)');
  };

  const handleAddChecklistItem = () => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        {
          id: (prev.checklistItems.length + 1).toString(),
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
        i === index ? { ...item, content } : item,
      ),
    }));
  };

  if (loading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <VStack space="md" className="flex-1  bg-background-light dark:bg-background-dark">
      <Header headerTitle={formData.title} />
      <ScrollView className="my-4 pb-6">
        <Box className="flex-1  p-4">
          <VStack space="md">
            <FormInput
              title={formData.title}
              notes={formData.notes}
              setTitle={(title: string) => setFormData((prev) => ({ ...prev, title }))}
              setNotes={(notes: string) => setFormData((prev) => ({ ...prev, notes }))}
            />

            <RepeatPeriodSelector
              repeatPeriod={formData.repeatPeriod}
              setRepeatPeriod={(value: RepeatPeriod | '' | null) =>
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
                  <CheckboxIndicator></CheckboxIndicator>
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
            {isCheckListItemsLoading && <ActivityIndicator />}
            {isCheckListItemsError ? (
              <Text>Error loading checklist items</Text>
            ) : (
              <ChecklistSection
                items={formData.checklistItems}
                onAdd={handleAddChecklistItem}
                onRemove={handleRemoveChecklistItem}
                onUpdate={handleUpdateChecklistItem}
                setFormData={setFormData}
              />
            )}
          </VStack>
        </Box>
      </ScrollView>
      <HStack space="md" className="mx-5 justify-between">
        <Button
          size="md"
          variant="solid"
          action="negative"
          onPress={handleDelete}
          className="flex-1">
          <ButtonText className="text-destructive-500">Delete</ButtonText>
          <Ionicons name="trash-bin" size={24} color="white" />
        </Button>
        <Button
          onPress={handleSave}
          testID="save-task-button"
          className="flex-1"
          disabled={updateTaskMutation.isPending}>
          <ButtonText>{updateTaskMutation.isPending ? 'Saving...' : 'Save'}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default EditTask;
