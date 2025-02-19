// app\(drawer)\_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import { useAuth } from '~/utils/auth/auth';
import { useUser } from '~/hooks/useUser';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

const DrawerLayout = () => {
  const { data: user, isLoading, isError } = useUser();

  const { signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isError, user, router]);
  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };
  if (isLoading) {
    return <ActivityIndicator />;
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
};

export default DrawerLayout;
