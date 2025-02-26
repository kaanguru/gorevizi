// TaskListDisplay.tsx
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';

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

function TaskListDisplay({
  isFiltered,
  reorderedTasks,
  renderTaskItem,
  keyExtractor,
  isRefetching,
  refetch,
}: Readonly<TaskListDisplayProps>) {
  return (
    <>
      <Text
        size="xs"
        className="absolute right-5 top-1 text-center font-mono text-typography-black dark:text-typography-white">
        {isFiltered ? "Today's" : 'All Tasks'}
      </Text>
      <FlatList
        contentContainerStyle={{
          gap: 16,
          margin: 3,
        }}
        data={reorderedTasks}
        renderItem={renderTaskItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<TaskListEmptyComponent />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            progressViewOffset={100}
            colors={['#000000']}
            progressBackgroundColor="#ffffff"
          />
        }
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
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
    </>
  );
}

export default TaskListDisplay;
