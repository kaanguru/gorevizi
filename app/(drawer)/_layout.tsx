import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import { useAuth } from '~/utils/auth/auth';
const DrawerLayout = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#FFEFC2',
          opacity: 0.9,
          width: 240,
        },
        headerStyle: {
          backgroundColor: '#8AC926',
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Due Tasks',
          headerTitleStyle: {
            color: '#FFEFC2',
            fontFamily: 'DelaGothicOne_400Regular',
            fontSize: 16,
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
