import { Alert } from 'react-native';

import { supabase } from '../supabase';

export default async function passRequest(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'gorevizi-auth://update-password', // Deep link URL
  });
  if (error) {
    console.error('Error sending password reset request:', error);
    Alert.alert('Error', 'Could not send password reset request.'); 
  } else {
    console.log('Password reset email sent successfully');
    Alert.alert('Success', 'Password reset email sent successfully. Please check your inbox.');
  }
}
