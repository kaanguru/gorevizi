import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

import Header from '~/components/Header';
import TiredOfWorking from '~/components/lotties/TiredOfWorking';
import { Button, ButtonIcon, ButtonText } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

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
          <FontAwesome6 name="face-smile-wink" size={24} color="black" />{' '}
        </Button>
      </Card>
    </>
  );
};

export default WarningPage;
