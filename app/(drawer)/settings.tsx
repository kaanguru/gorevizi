import { router } from 'expo-router';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from '~/components/ui/alert-dialog';
import { Box } from '~/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '~/components/ui/button';
import { Heading } from '~/components/ui/heading';
import { HStack } from '~/components/ui/hstack';
import { AlertCircleIcon, ArrowLeftIcon, EditIcon, Icon, TrashIcon } from '~/components/ui/icon';
import { Input, InputField } from '~/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '~/components/ui/modal';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { useSoundContext } from '~/context/SoundContext';
import { useResetCompletionHistory } from '~/hooks/useTaskCompletionHistory';
import { useUser } from '~/hooks/useUser';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: resetStats, isPending } = useResetCompletionHistory();
  const { isSoundEnabled, toggleSound } = useSoundContext();

  const { data: user } = useUser();
  const userEmail = user?.email;

  function handleReset() {
    resetStats(undefined, {
      onSuccess: () => setIsDialogOpen(false),
    });
  }
  const handleEmailChange = (text: string) => {
    setNewEmail(text);
  };
  const handleSubmit = () => {
    console.log('New Email:', newEmail);
    setShowModal(false);
    // Here you would typically send the new email to your backend for verification and update
  };
  return (
    <View className="flex-1 bg-background-light  p-5 dark:bg-background-dark">
      <LogoPortrait height={230} width={85} />
      <View className="mb-5 flex-1 flex-col items-center justify-items-start gap-9 p-12 ">
        <Button
          variant="outline"
          size="md"
          action="positive"
          className="mt-5 "
          onPress={() => router.push('/(tasks)/completed-tasks')}>
          <ButtonText className="text-typography-black dark:text-typography-white">
            Show Completed Tasks
          </ButtonText>
        </Button>
        <Button
          variant="outline"
          size="sm"
          action="positive"
          className="mt-1"
          onPress={() => router.push('/(tasks)/tasks-of-yesterday')}>
          <ButtonText className="text-typography-black dark:text-typography-white">
            Show Yesterday's Tasks
          </ButtonText>
        </Button>
        <HStack className="flex-row items-center justify-center gap-2">
          <Text size="md" bold>
            Your e-mail:
          </Text>
          <Text size="md"> {userEmail}</Text>
          <Button
            variant="link"
            size="sm"
            action="positive"
            className="m-2"
            onPress={() => setShowModal(true)}>
            <ButtonIcon as={EditIcon} />
          </Button>
        </HStack>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader className="flex-col items-start gap-0.5">
              <Heading>Need to use a different email address?</Heading>
              <Text size="sm">No worries, we’ll send you reset instructions</Text>
            </ModalHeader>
            <ModalCloseButton onPress={() => setShowModal(false)} />
            <ModalBody className="flex flex-col gap-2">
              {' '}
              <Text size="sm">Set your new mail address</Text>
              <Input>
                <InputField
                  placeholder="New email address"
                  onChangeText={handleEmailChange}
                  value={newEmail}
                  type="text"
                />
              </Input>
            </ModalBody>
            <ModalFooter className="flex-col items-start">
              <Button variant="outline" onPress={handleSubmit}>
                <ButtonText>Submit</ButtonText>
              </Button>
              <Button
                variant="link"
                size="sm"
                onPress={() => {
                  setShowModal(false);
                }}
                className="w-full">
                <ButtonIcon as={ArrowLeftIcon} />
                <ButtonText>Back to settings</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Button
          size="md"
          variant="solid"
          action="negative"
          onPress={() => setIsDialogOpen(true)}
          isDisabled={isPending}>
          <ButtonText className="text-typography-950 dark:text-typography-50">
            Reset Statistics
          </ButtonText>
          <ButtonIcon className="text-white" as={TrashIcon} />
        </Button>

        <Box className=" bg-background-light p-0 dark:bg-background-dark">
          <Button onPress={toggleTheme}>
            <ButtonIcon size="xl" as={theme === 'light' ? Moon : Sun} />
          </Button>
        </Box>
      </View>

      <AlertDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Icon as={AlertCircleIcon} className="mr-2" />
            <Heading className="font-semibold text-typography-950" size="md">
              Are you sure you want to Reset History?
            </Heading>
          </AlertDialogHeader>

          <AlertDialogBody className="mb-4 mt-3">
            <Text>
              This will permanently delete all task completion history and reset statistics. This
              action cannot be undone.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDialogOpen(false)} className="mr-3">
              <Text>Cancel</Text>
            </Button>

            <Button variant="solid" action="negative" onPress={handleReset}>
              <Text>Confirm Reset</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Box className="mt-5 flex-row items-center justify-between rounded-lg bg-background-dark p-4 dark:bg-background-light">
        <View className="flex-row items-center">
          <Icon
            as={isSoundEnabled ? Volume2 : VolumeX}
            size="lg"
            className="me-3 text-typography-500"
          />
          <Text className="text-typography-white dark:text-typography-black">
            {isSoundEnabled ? 'Sound Enabled' : 'Sound Disabled'}
          </Text>
        </View>
        <Switch
          value={isSoundEnabled}
          onValueChange={toggleSound}
          trackColor={{ true: '#4F10A8', false: '#E5E7EB' }}
          thumbColor="#FFCA3A"
        />
      </Box>
    </View>
  );
}
