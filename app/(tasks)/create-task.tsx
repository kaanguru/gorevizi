import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup } from '@/components/ui/button';
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
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, Icon } from '~/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/ui/slider';
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from '@/components/ui/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

const periodMapping = {
  Daily: { singular: 'day', plural: 'days' },
  Weekly: { singular: 'week', plural: 'weeks' },
  Monthly: { singular: 'month', plural: 'months' },
  Yearly: { singular: 'year', plural: 'years' },
} as const;

export default function CreateTask() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [repeatPeriod, setRepeatPeriod] = useState<RepeatPeriod | ''>('');
  const [repeatFrequency, setRepeatFrequency] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repeat_on_wk, setRepeatOnWk] = useState([] as DayOfWeek[]);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [isCustomStartDateEnabled, setIsCustomStartDateEnabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        title: title.trim(),
        notes: notes.trim() || null,
        created_at: (customStartDate || new Date()).toISOString(),
        repeat_on_wk: repeat_on_wk || null,
        repeat_frequency: repeatFrequency || null,
        repeat_period: repeatPeriod || null,
      });

      if (error) {
        console.log('🚀 ~ handleCreate ~ error:', error);
        Alert.alert('Error', 'Failed to create task. Please try again.');
        return;
      }

      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <HStack id="header" space="4xl">
        <Box className="m-4">
          <Button variant="link" onPress={() => router.back()}>
            <Icon as={ArrowLeftIcon} className="lg m-2  text-typography-900" />
          </Button>
        </Box>
        <Box className="my-auto ms-16">
          <Text bold size="xl">
            Create Task
          </Text>
        </Box>
      </HStack>
      <Box id="form" className="my-4 justify-center  px-2">
        <VStack space="lg" reversed={false}>
          <Input variant="rounded" size="lg">
            <InputField placeholder="Task title" value={title} onChangeText={setTitle} />
          </Input>
          <Textarea>
            <TextareaInput placeholder="Notes" value={notes} onChangeText={setNotes} />
          </Textarea>

          <Select
            selectedValue={repeatPeriod}
            onValueChange={(v) => setRepeatPeriod(v as RepeatPeriod | '')}>
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

          {repeatPeriod == 'Daily' || repeatPeriod == 'Monthly' ? (
            <Box className="mt-4">
              <HStack space="xl">
                <Text className="">Repeat Every</Text>
                <Text className="my-auto">
                  {calculateRepeatText(repeatPeriod, repeatFrequency)}
                </Text>
              </HStack>
              <HStack space="xl">
                <Center className="m-auto h-1/6 w-4/6 ">
                  <Slider
                    className="mt-8"
                    defaultValue={1}
                    minValue={1}
                    maxValue={repeatPeriod === 'Monthly' ? 12 : 30}
                    onChange={setRepeatFrequency}
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
          ) : null}
          {repeatPeriod === 'Weekly' && (
            <Box className="mt-4 p-2">
              <HStack space="md" className="mb-4 me-2">
                <Text className=" w-1/6">Repeat Every</Text>
                <HStack space="md">
                  <Center className="m-auto h-1/6 w-4/6 ">
                    <Slider
                      defaultValue={1}
                      minValue={1}
                      maxValue={4}
                      onChange={setRepeatFrequency}
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
                <Text className="my-auto">
                  {calculateRepeatText(repeatPeriod, repeatFrequency)}
                </Text>
              </HStack>
              <HStack space="md">
                <Text className="mb-2">Repeat on</Text>
              </HStack>
              <HStack space="sm" className="flex-wrap">
                <Checkbox
                  value="Mon"
                  isChecked={repeat_on_wk.includes('Mon')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Mon'] : prev.filter((day) => day !== 'Mon')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Mon</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Tue"
                  isChecked={repeat_on_wk.includes('Tue')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Tue'] : prev.filter((day) => day !== 'Tue')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Tue</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Wed"
                  isChecked={repeat_on_wk.includes('Wed')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Wed'] : prev.filter((day) => day !== 'Wed')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Wed</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Thu"
                  isChecked={repeat_on_wk.includes('Thu')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Thu'] : prev.filter((day) => day !== 'Thu')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Thu</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Fri"
                  isChecked={repeat_on_wk.includes('Fri')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Fri'] : prev.filter((day) => day !== 'Fri')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Fri</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Sat"
                  isChecked={repeat_on_wk.includes('Sat')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Sat'] : prev.filter((day) => day !== 'Sat')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Sat</CheckboxLabel>
                </Checkbox>
                <Checkbox
                  value="Sun"
                  isChecked={repeat_on_wk.includes('Sun')}
                  onChange={(isSelected) => {
                    setRepeatOnWk((prev) =>
                      isSelected ? [...prev, 'Sun'] : prev.filter((day) => day !== 'Sun')
                    );
                  }}>
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Sun</CheckboxLabel>
                </Checkbox>
              </HStack>
            </Box>
          )}
          {repeatPeriod === 'Yearly' && (
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
                isChecked={isCustomStartDateEnabled}
                onChange={(isSelected) => {
                  setIsCustomStartDateEnabled(isSelected);
                  if (isSelected && !customStartDate) {
                    setCustomStartDate(new Date());
                  }
                }}>
                <CheckboxIndicator>
                  <CheckboxIcon />
                </CheckboxIndicator>
                <CheckboxLabel>Custom Start Date</CheckboxLabel>
              </Checkbox>
            </HStack>
          </Box>

          {isCustomStartDateEnabled && (
            <Box className="mt-4">
              <HStack space="xl">
                <Text className="my-auto text-typography-black">Start Date</Text>
                <Text className="my-auto">{customStartDate?.toDateString()}</Text>
                <Button size="xs" variant="outline" onPress={() => setShowDatePicker(true)}>
                  <ButtonText>Change Date</ButtonText>
                </Button>
              </HStack>
            </Box>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={customStartDate || new Date()}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setCustomStartDate(selectedDate);
                }
              }}
            />
          )}

          <Button onPress={handleCreate} disabled={isSubmitting}>
            <ButtonText>{isSubmitting ? 'Creating...' : 'Create'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

function calculateRepeatText(repeatPeriod: RepeatPeriod | '', repeatFrequency: number) {
  if (!repeatPeriod) return '';

  const period = periodMapping[repeatPeriod as RepeatPeriod];
  return `${repeatFrequency}  ${repeatFrequency > 1 ? period.plural : period.singular}`;
}
