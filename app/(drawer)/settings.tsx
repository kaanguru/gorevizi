import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { useResetCompletionHistory } from '~/hooks/useTaskCompletionHistory';
import { useSoundSettings } from '~/hooks/useSoundSettings';
import { useUser } from '~/hooks/useUser';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { AlertCircleIcon, Icon, TrashIcon } from '@/components/ui/icon';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Pressable } from '~/components/ui/pressable';
import { Switch } from '~/components/ui/switch';
import { Volume2, VolumeX } from 'lucide-react-native';
import { HStack } from '~/components/ui/hstack';
import { Box } from '~/components/ui/box';

export default function SettingsScreen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: resetStats, isPending } = useResetCompletionHistory();
  const { isSoundEnabled, toggleSound } = useSoundSettings();
  const { data: user } = useUser();
  const userEmail = user?.email;

  function handleReset() {
    resetStats(undefined, {
      onSuccess: () => setIsDialogOpen(false),
    });
  }

  return (
    <View className="flex-1 bg-background-50 p-5">
      <View className="mb-5 flex-1 flex-col items-center justify-evenly p-12 ">
        <Button
          size="md"
          variant="solid"
          action="negative"
          onPress={() => setIsDialogOpen(true)}
          isDisabled={isPending}>
          <ButtonText className="text-white">Reset Statistics</ButtonText>
          <ButtonIcon className="text-white" as={TrashIcon} />
        </Button>
        <Button
          variant="solid"
          size="md"
          action="positive"
          className="mt-5 "
          onPress={() => router.push('/(tasks)/completed-tasks')}>
          <ButtonText className="text-white">Show Completed Tasks</ButtonText>
        </Button>
        <HStack>
          <Text size="md" bold>
            Your e-mail:
          </Text>
          <Text size="md"> {userEmail}</Text>
        </HStack>
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
      <Box className="mt-5 flex-row items-center justify-between rounded-lg bg-primary-0 p-4">
        <View className="flex-row items-center">
          <Icon
            as={isSoundEnabled ? Volume2 : VolumeX}
            size="lg"
            className="me-3 text-typography-500"
          />
          <Text>{isSoundEnabled ? 'Sound Enabled' : 'Sound Disabled'}</Text>
        </View>
        <Switch
          value={isSoundEnabled}
          onValueChange={toggleSound}
          trackColor={{ true: '#4F46E5', false: '#E5E7EB' }}
          thumbColor="#FFFFFF"
        />
      </Box>
    </View>
  );
}
