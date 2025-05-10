import { FC } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortIconProps {
  field: string;
}

export const SortIcon: FC<SortIconProps> = ({ field }) => {
  return (
    <ArrowUpDown className="h-4 w-4 inline-block ml-1" aria-label={`Sort by ${field}`} />
  );
};