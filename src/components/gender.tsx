import { Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/libs/utils';
import * as React from 'react';

const genders = [
  {
    value: 'unknown',
    label: "Won't tell",
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
];

interface GenderDropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  onGenderChanged?: (value: string) => void;
}

export function genderValueToNumber(value?: string) {
  if (value === 'male') {
    return 1;
  }
  if (value === 'female') {
    return 0;
  }
  return -1;
}

export function genderValueFromNumber(value?: number) {
  if (value === 1) {
    return 'male';
  }
  if (value === 0) {
    return 'female';
  }
  return 'unknown';
}

export function genderLabelFromValue(value: string) {
  return genders.find((gender) => gender.value === value)?.label;
}

export function GenderDropDown({ children, defaultValue, onGenderChanged }: GenderDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? '');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search gender..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {genders.map((gender) => (
                <CommandItem
                  key={gender.value}
                  value={gender.value}
                  onSelect={(newValue) => {
                    setValue(newValue);
                    setOpen(false);

                    if (onGenderChanged) {
                      onGenderChanged(newValue);
                    }
                  }}>
                  <Check className={cn('mr-2 h-4 w-4', value === gender.value ? 'opacity-100' : 'opacity-0')} />
                  {gender.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
