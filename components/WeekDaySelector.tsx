import React from 'react';
import { DayOfWeek } from '~/app/(tasks)/types';
import { HStack } from './ui/hstack';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from './ui/checkbox';

const WeekdaySelector = ({
  selectedDays,
  onDayToggle,
}: Readonly<{
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek, isSelected: boolean) => void;
}>) => (
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

export default WeekdaySelector;
