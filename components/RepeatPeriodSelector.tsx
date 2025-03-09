import { FontAwesome6 } from '@expo/vector-icons'; // Import the icon
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

import { RepeatPeriod } from '~/types';

interface RepeatPeriodSelectorProps {
  repeatPeriod: RepeatPeriod | null | '';
  setRepeatPeriod: (value: RepeatPeriod | null | '') => void;
}

export default function RepeatPeriodSelector({
  repeatPeriod,
  setRepeatPeriod,
}: Readonly<RepeatPeriodSelectorProps>) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View className="my-4" style={styles.container}>
      <Picker
        selectedValue={repeatPeriod}
        onValueChange={(itemValue) => setRepeatPeriod(itemValue as RepeatPeriod | '' | null)}
        mode="dropdown"
        dropdownIconColor="black"
        style={styles.picker}>
        <Picker.Item label="No Repeat" value="" />
        <Picker.Item label="Daily" value="Daily" />
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
        <Picker.Item label="Yearly" value="Yearly" />
      </Picker>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="circle-chevron-right" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange picker and icon horizontally
    alignItems: 'center', // Vertically center items
    // You might need to add padding or margin to your container based on your design
  },
  picker: {
    flex: 1, // Allow picker to take available space
    height: 60,
  },
  iconContainer: {
    paddingLeft: 8, // Add some space between picker and icon
  },
});
