import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-white p-5">
      <Text className="mb-5 text-2xl font-bold">Settings</Text>
      <View className="mb-5">
        <Text className="mb-3 text-lg font-semibold">App Settings</Text>
      </View>
    </View>
  );
}
