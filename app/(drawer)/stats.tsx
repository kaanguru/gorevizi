import React, { useMemo } from 'react';
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
import { Progress, ProgressFilledTrack } from '~/components/ui/progress';
import { Spinner } from '~/components/ui/spinner';
import { Text } from '~/components/ui/text';
import useHealthAndHappinessQuery from '~/hooks/useHealthAndHappinessQueries';
import useTasksQuery from '~/hooks/useTasksQueries';
import useUser from '~/hooks/useUser';
import calculateLevel, { percentageUntilNextLevel } from '~/utils/calculateLevel';

export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery('completed');
  const { data: user } = useUser();
  const {
    data: healthAndHappiness,
    isLoading: isLoadingHealthAndHappiness,
    error: errorHealthAndHappiness,
  } = useHealthAndHappinessQuery(user?.id);

  const level = useMemo(() => {
    if (!healthAndHappiness) return 0;

    const health = healthAndHappiness.health ?? 0;
    const happiness = healthAndHappiness.happiness ?? 0;

    return calculateLevel(health, happiness);
  }, [healthAndHappiness]);

  const untilNext = useMemo(() => {
    if (!healthAndHappiness) return 0;

    const health = healthAndHappiness.health ?? 0;
    const happiness = healthAndHappiness.happiness ?? 0;

    return percentageUntilNextLevel(health, happiness);
  }, [healthAndHappiness]);

  if (isLoading || isLoadingHealthAndHappiness) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error || errorHealthAndHappiness) {
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
      <Text
        size="3xl"
        className="text-center font-delaGothicOne text-typography-black dark:text-typography-white">
        Level {level}
      </Text>
      <Box className="m-2 flex-1 items-center justify-center pb-3">
        <Progress value={Number(untilNext.toFixed(2))} size="md" orientation="horizontal">
          <ProgressFilledTrack />
        </Progress>
      </Box>
      <HStack className="basis-6/6 justify-evenly">
        <Card className="m-1 w-2/6 rounded-lg bg-[#1982C4] p-2">
          <Healthy height={100} width={120} />
          <Heading size='md' className="justify-between text-center text-typography-white dark:text-typography-black">
            Health
          </Heading>
          <Divider
            orientation="horizontal"
            className="my-2 flex w-full self-center bg-background-500"
          />
          <Text bold size="4xl" className="p-3 text-center font-mono text-[#FFCA3A]">
            {healthAndHappiness?.health || 0}
          </Text>
        </Card>
        <Card className="m-1 w-2/6 rounded-lg bg-[#4F10A8] p-2">
          <Happy height={100} width={120} />
          <Heading size='md' className="justify-between text-center text-typography-white dark:text-typography-black">
            Happiness
          </Heading>
          <Divider
            orientation="horizontal"
            className="my-2 flex w-full self-center bg-background-500"
          />
          <Text bold size="4xl" className="p-3 text-center font-mono text-[#FFCA3A]">
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
