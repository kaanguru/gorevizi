import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { router } from 'expo-router';
import { useAuth } from '~/utils/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60_000, // Prevent over-fetching
    },
  },
});
const DrawerLayout = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Drawer screenOptions={{ headerShown: true }}>
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: 'Due Tasks',
            drawerLabel: 'Due Tasks',
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
            drawerItemPress: () => {
              handleSignOut();
            },
          }}
        />
      </Drawer>
    </QueryClientProvider>
  );
};

export default DrawerLayout;
