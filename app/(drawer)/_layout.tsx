import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';

import { useAuth } from '~/utils/auth';

const DrawerLayout = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'TaskList',
          drawerLabel: 'TaskList',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(settings)/index"
        options={{
          headerTitle: 'Settings',
          drawerLabel: 'Settings',
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
          drawerItemPress: (e) => {
            e.preventDefault();
            handleSignOut();
          },
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
