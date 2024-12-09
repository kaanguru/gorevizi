import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditTask() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold">Edit Task</Text>
      </View>

      <TextInput placeholder="Task title" className="mb-4 rounded-md border border-gray-300 p-2" />

      <TextInput
        placeholder="Notes"
        multiline
        numberOfLines={4}
        className="mb-4 h-32 rounded-md border border-gray-300 p-2"
      />

      <View className="flex-row justify-end space-x-2">
        <TouchableOpacity className="rounded-md bg-red-500 px-4 py-2" onPress={() => router.back()}>
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-md bg-blue-500 px-4 py-2"
          onPress={() => router.back()}>
          <Text className="text-white">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
