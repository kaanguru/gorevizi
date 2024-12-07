import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

const DrawerLayout = () => (
  <Drawer>
    <Drawer.Screen
      name="index"
      options={{
        headerTitle: 'TaskList',
        drawerLabel: 'TaskList',
        drawerIcon: ({ size, color }) => <Ionicons name="list-outline" size={size} color={color} />,
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
  </Drawer>
);

export default DrawerLayout;
