import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Drawer from 'expo-router/drawer';
import React, { useState, useEffect } from 'react'; // Import useEffect
import { View, Text } from 'react-native';

import { useAuth } from '~/utils/auth/auth';

export default function DrawerMenuAndScreens() {
  const { signOut } = useAuth();
  const [error, setError] = useState<Error | null>(null); // State for error handling

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (err: any) {
      console.error('Error during sign out:', err); // Log the error
      setError(err); // Set the error state
    }
  };

  useEffect(() => {
    // This is for debugging purposes. It allows you to examine what is happening.
    console.log('DrawerMenuAndScreens mounted');

    // Example of how to check for potential issues, adjust as needed:
    if (!signOut) {
      console.warn('signOut function is not available');
    }
  }, [signOut]);

  if (error) {
    // Display an error message to the user
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">An error occurred: {error.message}</Text>
      </View>
    );
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#051824',
        },
        headerTintColor: '#FFEFC2',
        drawerStyle: {
          backgroundColor: '#FFEFC2',
          opacity: 0.9,
          width: 240,
        },
        drawerActiveTintColor: '#76AB21',
        drawerInactiveTintColor: '#2F450D',
        drawerLabelStyle: {
          fontFamily: 'DelaGothicOne_400Regular',
          fontSize: 16,
          fontWeight: '400',
          marginBottom: 10,
          marginTop: 10,
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Due Tasks',
          headerTitleStyle: {
            color: '#FFEFC2',
            fontFamily: 'DelaGothicOne_400Regular',
            fontSize: 14,
            fontWeight: '400',
          },
          drawerLabel: 'Due Tasks',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="stats"
        options={{
          headerTitle: 'Stats',
          headerTitleStyle: {
            color: '#FFEFC2',
            fontFamily: 'DelaGothicOne_400Regular',
            fontSize: 14,
            fontWeight: '400',
          },
          drawerLabel: 'Stats',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerTitle: 'Settings',
          drawerLabel: 'Settings',
          headerTitleStyle: {
            color: '#FFEFC2',
            fontFamily: 'DelaGothicOne_400Regular',
            fontSize: 14,
            fontWeight: '400',
          },
          drawerIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="signout"
        options={{
          headerTitle: 'Sign Out',
          drawerLabel: 'Sign Out',

          drawerIcon: ({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: () => {
            handleSignOut();
          },
        }}
      />
    </Drawer>
  );
}
