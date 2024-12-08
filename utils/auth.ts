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
/**
 * Hook to handle user authentication.
 *
 * @returns An object containing the functions to sign in, sign up, sign out, and a boolean indicating whether the authentication is in progress.
 *
 * The `signInWithEmailAndPassword` function signs in the user with the email and password provided.
 * The `signUpWithEmailAndPassword` function signs up the user with the email and password provided.
 * The `signOut` function signs out the user.
 * The `loading` property is a boolean indicating whether the authentication is in progress.
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const signInWithEmailAndPassword = async (
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

  const signUpWithEmailAndPassword = async (
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
    /**
     * Signs in a user with the provided email and password.
     *
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns An object containing the error message if an error occurs, otherwise null.
     */
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    loading,
  };
};
