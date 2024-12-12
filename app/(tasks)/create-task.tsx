import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
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
import { ArrowLeftIcon, ChevronDownIcon } from '~/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/ui/slider';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

// Types
type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface TaskFormData {
  title: string;
  notes: string;
  repeatPeriod: RepeatPeriod | '';
  repeatFrequency: number;
  repeatOnWk: DayOfWeek[];
  customStartDate: Date | null;
  isCustomStartDateEnabled: boolean;
}

const INITIAL_FORM_STATE: TaskFormData = {
  title: '',
  notes: '',
  repeatPeriod: '',
  repeatFrequency: 1,
  repeatOnWk: [],
  customStartDate: null,
  isCustomStartDateEnabled: false,
};

const periodMapping = {
  Daily: { singular: 'day', plural: 'days' },
  Weekly: { singular: 'week', plural: 'weeks' },
  Monthly: { singular: 'month', plural: 'months' },
  Yearly: { singular: 'year', plural: 'years' },
} as const;

// Components
const Header = ({ onBack }: { onBack: () => void }) => (
  <HStack id="header" space="4xl">
    <Box className="m-4">
      <Button variant="link" onPress={onBack}>
        <ButtonIcon as={ArrowLeftIcon} className="lg m-2 text-typography-900" />
      </Button>
    </Box>
    <Box className="my-auto ms-16">
      <Text bold size="xl">
        Create Task
      </Text>
    </Box>
  </HStack>
);

const RepeatFrequencySlider = ({
  period,
  frequency,
  onChange,
}: Readonly<{
  period: RepeatPeriod;
  frequency: number;
  onChange: (value: number) => void;
}>) => (
  <Box className="mt-4">
    <HStack space="xl">
      <Text>Repeat Every</Text>
      <Text className="my-auto">{calculateRepeatText(period, frequency)}</Text>
    </HStack>
    <HStack space="xl">
      <Center className="m-auto h-1/6 w-4/6">
        <Slider
          className="mt-8"
          defaultValue={1}
          minValue={1}
          maxValue={period === 'Monthly' ? 12 : 30}
          onChange={onChange}
          size="lg"
          orientation="horizontal"
          isDisabled={false}
          isReversed={false}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Center>
    </HStack>
  </Box>
);

const WeekdaySelector = ({
  selectedDays,
  onDayToggle,
}: Readonly<{
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek, isSelected: boolean) => void;
}>) => (
  <HStack space="sm" className="flex-wrap">
    {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as DayOfWeek[]).map((day) => (
      <Checkbox
        key={day}
        value={day}
        isChecked={selectedDays.includes(day)}
        onChange={(isSelected) => onDayToggle(day, isSelected)}>
        <CheckboxIndicator>
          <CheckboxIcon />
        </CheckboxIndicator>
        <CheckboxLabel>{day}</CheckboxLabel>
      </Checkbox>
    ))}
  </HStack>
);

// Utility functions
function calculateRepeatText(repeatPeriod: RepeatPeriod | '', repeatFrequency: number) {
  if (!repeatPeriod) return '';
  const period = periodMapping[repeatPeriod];
  return `${repeatFrequency} ${repeatFrequency > 1 ? period.plural : period.singular}`;
}

// Main component
export default function CreateTask() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<TaskFormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        title: formData.title.trim(),
        notes: formData.notes.trim() || null,
        created_at: (formData.customStartDate || new Date()).toISOString(),
        repeat_on_wk: formData.repeatOnWk.length > 0 ? formData.repeatOnWk : null,
        repeat_frequency: formData.repeatFrequency || null,
        repeat_period: formData.repeatPeriod || null,
      });

      if (error) {
        console.error('Error creating task:', error);
        Alert.alert('Error', 'Failed to create task. Please try again.');
        return;
      }

      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Readonly<Partial<TaskFormData>>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Box>
      <Header onBack={() => router.back()} />

      <Box id="form" className="my-4 justify-center px-2">
        <VStack space="lg" reversed={false}>
          <Input variant="rounded" size="lg">
            <InputField
              placeholder="Task title"
              value={formData.title}
              onChangeText={(text) => updateFormData({ title: text })}
              testID="task-title-input"
            />
          </Input>

          <Textarea>
            <TextareaInput
              placeholder="Notes"
              value={formData.notes}
              onChangeText={(text) => updateFormData({ notes: text })}
              testID="task-notes-input"
            />
          </Textarea>

          <Select
            selectedValue={formData.repeatPeriod}
            onValueChange={(value) => updateFormData({ repeatPeriod: value as RepeatPeriod | '' })}>
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
              onChange={(value) => updateFormData({ repeatFrequency: value })}
            />
          )}

          {formData.repeatPeriod === 'Weekly' && (
            <Box className="mt-4 p-2">
              <HStack space="md" className="mb-4">
                <Text className="w-1/6">Repeat Every</Text>
                <RepeatFrequencySlider
                  period={formData.repeatPeriod}
                  frequency={formData.repeatFrequency}
                  onChange={(value) => updateFormData({ repeatFrequency: value })}
                />
              </HStack>
              <HStack space="md">
                <Text className="mb-2">Repeat on</Text>
              </HStack>
              <WeekdaySelector
                selectedDays={formData.repeatOnWk}
                onDayToggle={(day, isSelected) => {
                  updateFormData({
                    repeatOnWk: isSelected
                      ? [...formData.repeatOnWk, day]
                      : formData.repeatOnWk.filter((d) => d !== day),
                  });
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
                  updateFormData({
                    isCustomStartDateEnabled: isSelected,
                    customStartDate: isSelected ? new Date() : null,
                  });
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
                  updateFormData({ customStartDate: selectedDate });
                }
              }}
            />
          )}

          <Button onPress={handleCreate} testID="create-task-button" disabled={isSubmitting}>
            <ButtonText>{isSubmitting ? 'Creating...' : 'Create'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
