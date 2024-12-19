import React from 'react';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ArrowLeftIcon } from '~/components/ui/icon';

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <HStack id="header" space="4xl">
    <Box className="m-4">
      <Button variant="link" onPress={onBack}>
        <ButtonIcon as={ArrowLeftIcon} className="lg m-2 text-typography-900" />
      </Button>
    </Box>
    <Box className="my-auto ms-16">
      <Text bold size="xl">
        Create Task
      </Text>
    </Box>
  </HStack>
);

export default Header;
