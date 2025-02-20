import React from 'react';
import { View, FlatList } from 'react-native';

import { Tables } from '@/database.types';

import Happy from '~/components/lotties/Happy';
import Healthy from '~/components/lotties/Healthy';
import TaskSuccessPercentage from '~/components/TaskSuccessPercentage';
import { Box } from '~/components/ui/box';
import { Card } from '~/components/ui/card';
import { Divider } from '~/components/ui/divider';
import { Heading } from '~/components/ui/heading';
import { HStack } from '~/components/ui/hstack';
import { Spinner } from '~/components/ui/spinner';
import { Text } from '~/components/ui/text';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import useTasksQuery from '~/hooks/useTasksQueries';
import { useUser } from '~/hooks/useUser';
export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery('completed');
  const { data: user } = useUser();
  const {
    data: healthAndHappiness,
    isLoading: isLoadingHealthAndHappiness,
    error: errorHealthAndHappiness,
  } = useHealthAndHappinessQuery(user?.id);
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }
  const renderStatItem = ({ item }: Readonly<{ item: Readonly<Tables<'tasks'>> }>) => (
    <TaskSuccessPercentage key={item.id.toString()} task={item} />
  );

  return (
    <View className="flex-1 justify-evenly bg-background-light dark:bg-background-dark">
      <HStack className="basis-6/6 justify-evenly ">
        <Card className=" m-1 w-2/6  rounded-lg bg-[#1982C4] p-5">
          <Healthy height={120} width={120} />
          <Heading className=" justify-between text-center text-typography-white dark:text-typography-black">
            Health
          </Heading>
          <Divider
            orientation="horizontal"
            className="my-2 flex w-full self-center bg-background-500"
          />

          <Text bold size="5xl" className="p-3 text-center font-mono text-[#FFCA3A] ">
            {healthAndHappiness?.health || 0}
          </Text>
        </Card>
        <Card className=" m-1 w-2/6  rounded-lg bg-[#4F10A8] p-5">
          <Happy height={120} width={120} />
          <Heading className=" justify-between text-center text-typography-white dark:text-typography-black">
            Happiness
          </Heading>
          <Divider
            orientation="horizontal"
            className="my-2 flex w-full self-center bg-background-500"
          />

          <Text bold size="5xl" className="p-3 text-center font-mono text-[#FFCA3A] ">
            {healthAndHappiness?.happiness || 0}
          </Text>
        </Card>
      </HStack>
      <FlatList
        contentContainerStyle={{
          gap: 8,
          padding: 8,
          paddingBottom: 16,
          marginTop: 12,
          justifyContent: 'space-evenly',
        }}
        data={data || []}
        keyExtractor={(task: Readonly<Tables<'tasks'>>) => task.id.toString()}
        renderItem={renderStatItem}
        ListEmptyComponent={<Text>No tasks available</Text>}
      />
    </View>
  );
}
