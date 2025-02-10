import { SafeAreaView } from 'react-native';

export const Container = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <SafeAreaView className={styles.container}>{children}</SafeAreaView>;
};

const styles = {
  container: 'flex flex-1 p-6 bg-background-400',
};
