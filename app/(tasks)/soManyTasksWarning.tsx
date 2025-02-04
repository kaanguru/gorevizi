import React from 'react';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import Header from '~/components/Header';
import { Button, ButtonText } from '~/components/ui/button';
import { router } from 'expo-router';

const WarningPage = () => {
  return (
    <>
      <Header headerTitle="Over Load Warning" />
      <Card size="lg">
        <Text size="lg">
          You have so much uncompleted tasks. Please go back and finish some tasks before adding
          more.
        </Text>
        <Text size="lg" className="m-5">
          Tasks are daily jobs or activities that will take more than 40 minutes...
        </Text>
        <Button size="lg" onPress={() => router.push('/(tasks)/create-task')}>
          <ButtonText>Any way just add Task</ButtonText>
        </Button>
      </Card>
    </>
  );
};

export default WarningPage;
