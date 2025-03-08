import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

import { supabase } from '~/utils/supabase';

const UpdatePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully');
      navigation.goBack();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Update Password</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />
    </View>
  );
};

export default UpdatePasswordScreen;
