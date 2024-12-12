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

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

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
        repeat_period: repeatPeriod || null,
        repeat_frequency: repeatFrequency || null,
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
      <HStack space="4xl">
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
      <Box className="my-4 justify-center  px-2">
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
            <SelectTrigger variant="rounded" size="xl" style={{ justifyContent: 'space-between' }}>
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

          {repeatPeriod !== '' && (
            <Box className="mt-4">
              <Text>Repeat Every</Text>
              <HStack space="md">
                <Input variant="outline" className="h-14 w-20 rounded-lg bg-white">
                  <InputField
                    size="xl"
                    className="h-full px-2 text-center text-lg font-semibold"
                    placeholder="1"
                    keyboardType="numeric"
                    value={repeatFrequency.toString()}
                    onChangeText={(v) => {
                      const num = parseInt(v);
                      if (!isNaN(num) && num > 0) {
                        setRepeatFrequency(num);
                      } else if (v === '') {
                        setRepeatFrequency(1);
                      }
                    }}
                  />
                  <InputSlot>
                    <InputIcon as={ChevronUpIcon} />
                    <InputIcon as={ChevronDownIcon} />
                  </InputSlot>
                </Input>
                <Text className="my-auto">
                  {calculateRepeatText(repeatPeriod, repeatFrequency)}
                </Text>
              </HStack>
            </Box>
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
  return ` ${repeatFrequency > 1 ? period.plural : period.singular}`;
}
