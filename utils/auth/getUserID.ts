import { supabase } from '../supabase';

export default async function getUserID(): Promise<string | undefined> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return session?.user.id;
  if (error) {
    console.error('Error creating task: User not authenticated', error);
  }
}
