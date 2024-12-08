import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from './supabase';
import { router } from 'expo-router';

/**
 * A hook that provides authentication functionality.
 *
 * @returns An object with the following keys:
 *   - `signIn`: A function that takes an email and password and signs in the user with Supabase.
 *   - `signUp`: A function that takes an email and password and signs up the user with Supabase.
 *   - `signOut`: A function that signs out the user with Supabase.
 *   - `loading`: A boolean indicating whether an authentication request is in progress.
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Signs in the user with Supabase.
   *
   * @param email The user's email address.
   * @param password The user's password.
   */
  const signIn = async (
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
        Alert.alert('Error', error.message);
        return { error: { message: error.message } };
      }
      return null;
    } catch (error) {
      console.error('🚀 ~ signIn ~ error:', error);
      Alert.alert('Sign In Failed', 'Unable to sign in. ');
      return {
        error: { message: error instanceof Error ? error.message : 'Unknown errorin signing in' },
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs up the user with Supabase.
   *
   * @param email The user's email address.
   * @param password The user's password.
   */
  const signUp = async (
    email: string,
    password: string
  ): Promise<{ error: { message: string } } | null> => {
    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return { error: { message: error.message } };
      }
      if (!session) Alert.alert('Success', 'Please check your inbox for email verification!');
      return null;
    } catch (error) {
      console.error('🚀 ~ signUp ~ error:', error);
      Alert.alert('Sign Up Failed', 'Unable to create your account.Try again.');
      return {
        error: { message: error instanceof Error ? error.message : 'Unknown error signing up' },
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the user with Supabase and redirects to the auth screen.
   */
  const signOut = async () => {
    try {
      setLoading(true);

      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      /* 
      // Use requestAnimationFrame to ensure we're not in the middle of a render cycle
      requestAnimationFrame(() => {
        // Reset navigation state and go to login
        router.replace('/(auth)/login');
      }); */
    } catch (error) {
      console.error('🚀 ~ signOut ~ error:', error);
      Alert.alert('Sign Out Failed', 'Unable to sign you out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
  };
};
