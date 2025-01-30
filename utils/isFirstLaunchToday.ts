import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday } from 'date-fns';

const LAUNCH_DATE_KEY = '@gorevizi:lastLaunchDate';

export const isFirstLaunchToday = async (): Promise<boolean> => {
  try {
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');
    const previousDateStored = await AsyncStorage.getItem(LAUNCH_DATE_KEY);

    await AsyncStorage.setItem(LAUNCH_DATE_KEY, formattedToday);

    if (previousDateStored === null) {
      return true; // No previous launch date stored, so it's the first launch today
    }

    const previousDate = new Date(previousDateStored);
    return !isToday(previousDate); // True if previous launch was not today
  } catch (error) {
    console.error('Error checking first launch:', error);
    return false; // Assume not first launch in case of errors
  }
};

export const resetFirstLaunchToday = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LAUNCH_DATE_KEY);
  } catch (error) {
    console.error('Error resetting first launch:', error);
  }
};
