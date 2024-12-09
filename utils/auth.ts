import { useState } from 'react';
import { AppState } from 'react-native';
import { supabase } from './supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: { message: string } } | null> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: error?.message ?? 'Unknown error when signing in' } };
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return { error: { message: error.message } };
      }
      return { error: { message: 'Unknown error when signing in with email and password' } };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: { message: string } } | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        return { error: { message: error?.message ?? 'Unknown error when signing up' } };
      }

      return null;
    } catch (error) {
      console.error('Error when signing up:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error when signing up',
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error when signing out:', error);
      }
    } catch (error) {
      console.error('Error when signing out:', error);
    } finally {
      setLoading(false);
      return null;
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signOut,
    loading,
  };
};
