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
import { useState } from 'react';
import { View } from 'react-native';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useResetCompletionHistory } from '~/hooks/useTaskCompletionHistory';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: resetStats, isPending } = useResetCompletionHistory();

  function handleReset() {
    resetStats(undefined, {
      onSuccess: () => setIsDialogOpen(false),
    });
  }

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="mb-5 text-2xl font-bold">Settings</Text>

      <View className="mb-5">
        <Text className="mb-3 text-lg font-semibold">App Settings</Text>

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
          action="positive"
          onPress={() => router.push('/(tasks)/completed-tasks')}>
          <Text>Show Completed Tasks</Text>
        </Button>
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
    </View>
  );
}
