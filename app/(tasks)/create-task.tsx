import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/utils/supabase';

type RepeatPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export default function CreateTask() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [repeatPeriod, setRepeatPeriod] = useState<RepeatPeriod | ''>('');
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
      });

      if (error) {
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
    <View className="flex-1 bg-white p-4">
      <View className="mb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold">Create Task</Text>
      </View>

      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        className="mb-4 rounded-md border border-gray-300 p-2"
      />

      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        className="mb-4 h-32 rounded-md border border-gray-300 p-2"
      />

      <View className="mb-4 rounded-md border border-gray-300">
        <Picker selectedValue={repeatPeriod} onValueChange={setRepeatPeriod} style={{ height: 50 }}>
          <Picker.Item label="No Repeat" value="" />
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Yearly" value="Yearly" />
        </Picker>
      </View>

      <TouchableOpacity
        className={`self-end rounded-md ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500'} px-4 py-2`}
        onPress={handleCreate}
        disabled={isSubmitting}>
        <Text className="text-white">{isSubmitting ? 'Creating...' : 'Create'}</Text>
      </TouchableOpacity>
    </View>
  );
}
