import React from 'react';
import { Button, ButtonIcon } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import { ArrowLeftIcon } from '~/components/ui/icon';
import { router } from 'expo-router';

interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => (
  <HStack id="header" space="4xl" className=" bg-background-light dark:bg-background-dark">
    <Box className="m-4 rounded-full bg-background-dark dark:bg-background-light">
      <Button variant="link" onPress={() => router.back()}>
        <ButtonIcon
          as={ArrowLeftIcon}
          className="lg m-2 text-typography-white dark:text-typography-black"
        />
      </Button>
    </Box>
    <Box className="my-auto">
      <Text
        bold
        size="xl"
        className="font-heading text-typography-black dark:text-typography-white">
        {headerTitle}
      </Text>
    </Box>
  </HStack>
);

export default Header;
