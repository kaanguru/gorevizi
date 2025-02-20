import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/utils/auth/auth';
import { router } from 'expo-router';

export default function DrawerMenuAndScreens() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

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
