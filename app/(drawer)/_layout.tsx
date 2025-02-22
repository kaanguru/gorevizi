// app\(drawer)\_layout.tsx
import DrawerMenuAndScreens from '~/components/DrawerMenuAndScreens';
import { SessionProvider } from '~/context/AuthenticationContext';
const DrawerLayout = () => {
  return (
    <SessionProvider>
      <DrawerMenuAndScreens />
    </SessionProvider>
  );
};

export default DrawerLayout;
