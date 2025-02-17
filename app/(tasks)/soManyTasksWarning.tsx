import React from 'react';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import Header from '~/components/Header';
import { Button, ButtonIcon, ButtonText } from '~/components/ui/button';
import { router } from 'expo-router';
import { SmilePlus } from 'lucide-react-native';
import TiredOfWorking from '~/components/lotties/TiredOfWorking';

const WarningPage = () => {
  return (
    <>
      <Header headerTitle="Over Load Warning" />
      <TiredOfWorking />
      <Card size="lg">
        <Text size="lg">
          You have so much uncompleted tasks. Please go back and finish some tasks before adding
          more.
        </Text>
        <Text size="lg" className="m-5">
          Tasks are daily jobs or activities that will take more than 40 minutes...
        </Text>
        <Button size="lg" onPress={() => router.push('/(tasks)/create-task')}>
          <ButtonText>I can handle more!</ButtonText>
          <ButtonIcon as={SmilePlus} className="ms-3 text-typography-white"></ButtonIcon>
        </Button>
      </Card>
    </>
  );
};

export default WarningPage;
