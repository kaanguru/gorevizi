import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepeatPeriod, TaskFormData } from '~/types';

import { supabase } from '~/utils/supabase';
import updateTask from '~/utils/tasks/updateTask';

import { useTaskById } from '~/hooks/useTasksQueries';
import useChecklistItems from '~/hooks/useCheckListQueries';

import { RepeatFrequencySlider } from '~/components/RepeatFrequencySlider';
import ChecklistSection from '~/components/ChecklistSection';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TrashIcon } from '~/components/ui/icon';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '~/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { FormInput } from '~/components/FormInput';
import RepeatPeriodSelector from '~/components/RepeatPeriodSelector';
import WeekdaySelector from '~/components/WeekDaySelector';
import Header from '~/components/Header';

export default function EditTask() {
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { checkListItems, isCheckListItemsLoading, isCheckListItemsError } =
    useChecklistItems(taskID);
  const { data: task, isLoading, isError, error: taskError } = useTaskById(taskID);

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

  useEffect(() => {
    const loadTaskData = async () => {
      if (task) {
        setFormData({
          title: task.title || '',
          notes: task.notes || '',
          repeatPeriod: task.repeat_period || '',
          repeatFrequency: task.repeat_frequency || 1,
          repeatOnWk: task.repeat_on_wk || [],
          customStartDate: task.created_at ? new Date(task.created_at) : null,
          isCustomStartDateEnabled: !!task.created_at,
          checklistItems:
            checkListItems?.map((item) => ({
              id: item.id.toString(),
              content: item.content,
              isComplete: item.is_complete,
              position: item.position ?? 0,
            })) || [],
        });
        setInitialLoad(false);
      }
    };

    loadTaskData();
  }, [task, taskID, checkListItems]);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (formData: Readonly<TaskFormData>) => {
      if (!taskID) throw new Error('No task ID');

      const updatedTask = await updateTask(+taskID, {
        title: formData.title.trim(),
        notes: formData.notes.trim() || null,
        created_at: (formData.customStartDate || new Date()).toISOString(),
        repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
        repeat_frequency: formData.repeatFrequency || null,
        repeat_period: formData.repeatPeriod || null,
      });

      if (!updatedTask) throw new Error('Failed to update task');

      const { error: deleteError } = await supabase
        .from('checklistitems')
        .delete()
        .eq('task_id', +taskID);

      if (deleteError) throw new Error('Failed to clear existing checklist items');

      if (formData.checklistItems.length > 0) {
        const { error: insertError } = await supabase.from('checklistitems').insert(
          formData.checklistItems.map((item, index) => ({
            task_id: +taskID,
            content: item.content.trim(),
            position: index,
            is_complete: item.isComplete || false,
          }))
        );

        if (insertError) throw new Error('Failed to update checklist items');
      }

      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.back();
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      Alert.alert('Error', error.message || 'Failed to update task');
    },
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (formData.checklistItems.some((item) => !item.content.trim())) {
      Alert.alert('Error', 'All checklist items must have content');
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleDelete = async () => {
    if (!taskID) return;

    const { error } = await supabase.from('tasks').delete().eq('id', +taskID);

    if (error) {
      Alert.alert('Error', 'Failed to delete task');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    router.back();
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
        i === index ? { ...item, content } : item
      ),
    }));
  };

  if (initialLoad || isLoading || isCheckListItemsLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <VStack space="xl" className="flex-1 bg-white">
      <Header headerTitle="Edit Task" />
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
            {isCheckListItemsLoading && <Spinner accessibilityLabel="Loading checklist items" />}
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
        </ScrollView>
      </Box>
      <Box className="px-4 py-2">
        <HStack space="md" className="justify-between">
          <Button
            size="md"
            variant="solid"
            action="negative"
            onPress={handleDelete}
            className="flex-1">
            <ButtonText className="text-destructive-500">Delete</ButtonText>
            <ButtonIcon className="text-white" as={TrashIcon} />
          </Button>
          <Button
            onPress={handleSave}
            testID="save-task-button"
            className="flex-1"
            disabled={updateMutation.isPending}>
            <ButtonText>{updateMutation.isPending ? 'Saving...' : 'Save'}</ButtonText>
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
