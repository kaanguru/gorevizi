import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from './ui/icon';
// eslint-disable-next-line functional/no-mixed-types
export interface RepeatPeriodSelectorProps {
  repeatPeriod: string;
  setRepeatPeriod: (period: string) => void;
}

export function RepeatPeriodSelector({
  repeatPeriod,
  setRepeatPeriod,
}: Readonly<RepeatPeriodSelectorProps>) {
  return (
    <Select selectedValue={repeatPeriod} onValueChange={setRepeatPeriod} className="h-6">
      <SelectTrigger size="lg">
        <SelectInput size="md" className="py-2 text-base" placeholder="Select repeat period" />
        <SelectIcon as={ChevronDownIcon} />
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
