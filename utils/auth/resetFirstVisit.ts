import { Href, router } from 'expo-router';

export default async function resetFirstVisit() {
  try {
    await resetFirstVisit();
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.replace('/(onboarding)/splash' as Href);
  } catch (error) {
    console.error('Error resetting first visit:', error);
  }
}
