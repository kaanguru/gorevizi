import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import resetRecurringTasks from './resetRecurringTasks';

TaskManager.defineTask('resetRecurringTasks', async () => {
  await resetRecurringTasks();
});

BackgroundFetch.registerTaskAsync('resetRecurringTasks', {
  minimumInterval: 60 * 60 * 24, // 24 hours
});
