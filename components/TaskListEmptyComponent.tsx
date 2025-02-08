import React from 'react';
import { Box } from '~/components/ui/box';
import { Text } from '~/components/ui/text';
import BiriBirseyDesin from '~/components/lotties/BiriBirseyDesin';

function TaskListEmptyComponent() {
  return (
    <Box className="flex-1 items-center justify-center">
      <BiriBirseyDesin />
      <Text className="mt-4 text-center">
        No tasks available. Add some tasks from the button below!
      </Text>
    </Box>
  );
}

export default TaskListEmptyComponent;
