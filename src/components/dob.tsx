import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { FormControl } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DobDropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChanged?: (value?: Date) => void;
}

export function DobDropDown({ children, onDateChanged }: DobDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Date>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>{children}</FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(newDate) => {
            setValue(newDate);
            setOpen(false);

            if (onDateChanged) {
              onDateChanged(newDate);
            }
          }}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
