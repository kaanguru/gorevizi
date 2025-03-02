import { FontAwesome6 } from '@expo/vector-icons';

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from '~/components/ui/select';
import { RepeatPeriod } from '~/types';

export interface RepeatPeriodSelectorProps {
  repeatPeriod: RepeatPeriod | '';
  setRepeatPeriod: (period: RepeatPeriod | '') => void;
}

export default function RepeatPeriodSelector({
  repeatPeriod,
  setRepeatPeriod,
}: Readonly<RepeatPeriodSelectorProps>) {
  return (
    <Select
      selectedValue={repeatPeriod}
      onValueChange={setRepeatPeriod as () => void}
      className="my-4 h-6">
      <SelectTrigger size="lg">
        <SelectInput size="md" className="py-2 text-base" placeholder="Select repeat period" />
        <FontAwesome6 name="circle-chevron-right" size={24} color="black" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectItem label="No Repeat" value="" />
          <SelectItem label="Daily" value="Daily" />
          <SelectItem label="Weekly" value="Weekly" />
          <SelectItem label="Monthly" value="Monthly" />
          <SelectItem label="Yearly" value="Yearly" />
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
