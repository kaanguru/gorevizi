import React from 'react';
import { DayOfWeek } from '~/types';
import { HStack } from './ui/hstack';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';
import getCurrentDayOfWeek from '~/utils/dates/getCurrentDayOfWeek';

const WeekdaySelector = ({
  selectedDays,
  onDayToggle,
}: Readonly<{
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek, isSelected: boolean) => void;
}>) => {
  React.useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    if (selectedDays.length === 0) {
      onDayToggle(currentDay, true);
    }
  }, []);

  return (
    <HStack space="sm" className="flex-wrap">
      {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as DayOfWeek[]).map((day) => (
        <Checkbox
          key={day}
          value={day}
          isChecked={selectedDays.includes(day)}
          onChange={(isSelected) => onDayToggle(day, isSelected)}>
          <CheckboxIndicator>
            <CheckboxIcon />
          </CheckboxIndicator>
          <CheckboxLabel>{day}</CheckboxLabel>
        </Checkbox>
      ))}
    </HStack>
  );
};

export default WeekdaySelector;
