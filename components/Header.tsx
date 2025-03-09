import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

import { Box } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';

interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => {
  const { theme } = useTheme();
  return (
    <HStack id="header" space="4xl" className=" mt-1 bg-background-light dark:bg-background-dark">
      <Box className="mx-1 mb-3 rounded-full bg-background-dark  dark:bg-background-light">
        <Button size="md" variant="link" onPress={() => router.back()}>
          <FontAwesome6
            name="arrow-left"
            size={20}
            style={{ padding: 8 }}
            color={theme === 'light' ? '#FFFAEB' : '#051824'}
          />
        </Button>
      </Box>
      <Box className="my-auto">
        <Text
          bold
          size="lg"
          className="mb-3 font-heading text-typography-black dark:text-typography-white">
          {headerTitle}
        </Text>
      </Box>
    </HStack>
  );
};

export default Header;
