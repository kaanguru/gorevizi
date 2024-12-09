import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_VISIT_KEY = '@gorevizi:first_visit';

export const isFirstVisit = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(FIRST_VISIT_KEY);
    if (value === null) {
      // If no value is stored, it's the first visit
      await AsyncStorage.setItem(FIRST_VISIT_KEY, 'false');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking first visit:', error);
    return false;
  }
};

export const resetFirstVisit = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FIRST_VISIT_KEY);
  } catch (error) {
    console.error('Error resetting first visit:', error);
  }
};
