import React from 'react';
import { Clock, TrendingUp, ChevronDownIcon, Star } from 'lucide-react';
import type { AppSortOption } from '@/api-types';

interface SortOption {
  value: AppSortOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AppSortTabsProps {
  value: AppSortOption;
  onValueChange: (value: AppSortOption) => void;
  availableSorts?: AppSortOption[];
  className?: string;
}

// Define all possible sort options with their display properties
const SORT_CONFIGURATIONS: Record<AppSortOption, SortOption> = {
  recent: {
    value: 'recent',
    label: 'Recent',
    icon: Clock
  },
  popular: {
    value: 'popular',
    label: 'Popular',
    icon: TrendingUp
  },
  trending: {
    value: 'trending',
    label: 'Trending',
    icon: TrendingUp
  },
  starred: {
    value: 'starred',
    label: 'Starred',
    icon: Star
  },
};

export function AppSortTabs({
  value,
  onValueChange,
  availableSorts = ['recent', 'popular', 'trending'],
}: AppSortTabsProps) {
  const sortOptions = availableSorts.map((sortKey) => SORT_CONFIGURATIONS[sortKey]);

  return (<div className="grid grid-cols-1">
        <select
          id="location"
          name="location"
          value={value}
          onChange={(e) => onValueChange(e.target.value as AppSortOption)}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-bg-2 border border-border-primary py-1.5 pl-3 pr-8 text-sm text-text-primary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent *:bg-bg-2 *:text-text-primary dark:*:bg-bg-4"
        >
          {sortOptions.map((e) => (<option key={e.value} value={e.value}>{e.label}</option>))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-text-tertiary sm:size-4"
        />
      </div>);
};