import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const Storage =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => {
          try {
            return Promise.resolve(window.localStorage.getItem(key));
          } catch (e) {
            return Promise.resolve(null);
          }
        },
        setItem: (key: string, value: string) => {
          try {
            window.localStorage.setItem(key, value);
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        },
        removeItem: (key: string) => {
          try {
            window.localStorage.removeItem(key);
            return Promise.resolve();
          } catch (e) {
            return Promise.resolve();
          }
        },
      }
    : AsyncStorage;

const FIRST_VISIT_KEY = '@gorevizi:first_visit';

export const isFirstVisit = async (): Promise<boolean> => {
  try {
    const value = await Storage.getItem(FIRST_VISIT_KEY);
    if (value === null) {
      // If no value is stored, it's the first visit
      await Storage.setItem(FIRST_VISIT_KEY, 'false');
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
    await Storage.removeItem(FIRST_VISIT_KEY);
  } catch (error) {
    console.error('Error resetting first visit:', error);
  }
};
