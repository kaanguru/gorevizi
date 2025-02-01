import React from 'react';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ArrowLeftIcon } from '~/components/ui/icon';
import { router } from 'expo-router';

interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => (
  <HStack id="header" space="4xl">
    <Box className="m-4">
      <Button variant="link" onPress={() => router.back()}>
        <ButtonIcon as={ArrowLeftIcon} className="lg m-2 text-typography-900" />
      </Button>
    </Box>
    <Box className="my-auto ms-16">
      <Text bold size="xl">
        {headerTitle}
      </Text>
    </Box>
  </HStack>
);

export default Header;
