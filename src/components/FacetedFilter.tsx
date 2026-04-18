import { Check, ChevronDown, Filter } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type FacetOption = {
  label: string;
  value: string;
};

type FacetedFilterProps = {
  title: string;
  options: FacetOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

export function FacetedFilter({
  title,
  options,
  selectedValues,
  onChange,
}: FacetedFilterProps) {
  const selectedSet = new Set(selectedValues);

  const toggleValue = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selectedValues.filter((v) => v !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
        >
          <Filter className='h-3.5 w-3.5' />
          <span>{title}</span>
          {selectedValues.length > 0 && (
            <span className='rounded bg-cyan-500/20 px-1.5 py-0.5 text-xs text-cyan-300'>
              {selectedValues.length}
            </span>
          )}
          <ChevronDown className='h-3.5 w-3.5 opacity-70' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedSet.has(option.value)}
            onCheckedChange={() => toggleValue(option.value)}
          >
            {selectedSet.has(option.value) && <Check className='mr-1 h-3.5 w-3.5' />}
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        {selectedValues.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onChange([])}>
              Clear {title.toLowerCase()}
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

