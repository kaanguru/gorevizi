// components/TaskListDisplay.tsx
import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import TaskListEmptyComponent from '~/components/TaskListEmptyComponent';
import { Text } from '~/components/ui/text';
import { Tables } from '~/database.types';

interface TaskListDisplayProps {
  isFiltered: boolean;
  reorderedTasks: Tables<'tasks'>[];
  renderTaskItem: ({
    item,
    index,
  }: Readonly<{ item: Tables<'tasks'>; index: number }>) => React.ReactElement;
  keyExtractor: (item: Readonly<Tables<'tasks'>>) => string;
  isRefetching: boolean;
  refetch: () => void;
}

const TaskListHeader = ({ isFiltered }: Readonly<{ isFiltered: boolean }>) => (
  <Text
    size="xs"
    className="m-0  p-0 text-right font-mono text-typography-black dark:text-typography-white">
    {isFiltered ? "Today's" : 'All Tasks'}
  </Text>
);

function TaskListDisplay({
  isFiltered,
  reorderedTasks,
  renderTaskItem,
  keyExtractor,
  isRefetching,
  refetch,
}: Readonly<TaskListDisplayProps>) {
  return (
    <FlatList
      contentContainerStyle={{
        gap: 16,
        margin: 3,
      }}
      data={reorderedTasks}
      renderItem={renderTaskItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<TaskListEmptyComponent />}
      //ListHeaderComponent
      ListHeaderComponent={
        reorderedTasks.length > 0 ? (
          <View className="px-5 py-1">
            <TaskListHeader isFiltered={isFiltered} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={['#000000']}
          progressBackgroundColor="#ffffff"
        />
      }
      initialNumToRender={10}
      maxToRenderPerBatch={3}
      windowSize={6}
      removeClippedSubviews={true}
      getItemLayout={(data, index) => ({
        length: 94,
        offset: 110 * index,
        index,
      })}
    />
  );
}

export default TaskListDisplay;
