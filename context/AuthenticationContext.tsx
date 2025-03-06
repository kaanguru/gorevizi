// context/AuthenticationContext.tsx
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { useSession } from '~/hooks/useSession';
import { useAuth } from '~/utils/auth/auth';

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
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

export default function SessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading: queryIsLoading, refetch } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    signInWithEmail,
    signUpWithEmail,
    signOut: authSignOut,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    if (!queryIsLoading) {
      setIsLoading(false);
    }
  }, [queryIsLoading]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result && result.error) {
      //TODO: handle error in UI
      console.error('Sign in error:', result.error.message);
      return;
    }
    await refetch();
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    if (result && result.error) {
      //TODO: handle error in UI

      console.error('Sign up error:', result.error.message);
      return;
    }
    await refetch();
  };

  const signOut = async () => {
    await authSignOut();
    await refetch();
    if (router.canGoBack()) {
      router.replace('/login');
    }
  };

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
