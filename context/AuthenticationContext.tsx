/* eslint-disable functional/no-throw-statements */
// context/AuthenticationContext.tsx
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { useSession } from '~/hooks/useSession';
import { useAuth } from '~/utils/auth/auth';
import initializeDailyTasks from '~/utils/initializeDailyTasks';

type SessionContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading: queryIsLoading, refetch, isSuccess: sessionIsSuccess } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {
    signInWithEmail,
    signUpWithEmail,
    signOut: authSignOut,
    loading: authLoading,
  } = useAuth(); // Use useAuth

  useEffect(() => {
    if (!queryIsLoading) {
      setIsLoading(false);
    }
  }, [queryIsLoading]);

  useEffect(() => {
    if (sessionIsSuccess) {
      const initializeTasks = async () => {
        await initializeDailyTasks();
      };
      initializeTasks();
    }
  }, [sessionIsSuccess]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result && result.error) {
      console.error('Sign in error:', result.error.message);
      return;
    }
    await refetch(); // Refetch session data
    router.replace('/');
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    if (result && result.error) {
      console.error('Sign up error:', result.error.message);
      return;
    }
    await refetch();
    router.replace('/'); // Redirect after successful sign-up (or to a welcome screen)
  };

  const signOut = async () => {
    await authSignOut(); // Use the signOut function from useAuth
    await refetch(); // Refetch to clear the session
    router.replace('/login');
  };

  // Combine loading states.  authLoading is from useAuth, isLoading is the initial load.
  const combinedLoading = isLoading || authLoading;

  return (
    <SessionContext.Provider
      value={{
        session: data?.session || null,
        signIn,
        signUp,
        signOut,
        isLoading: combinedLoading,
      }}>
      {children}
    </SessionContext.Provider>
  );
}
