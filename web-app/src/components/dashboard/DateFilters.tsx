import React from 'react';
import { Card } from '../ui/Card';

interface DateFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function DateFilters({ currentFilter, onFilterChange }: DateFiltersProps) {
  const filters = [
    { id: 'today', label: 'Hoje' },
    { id: 'yesterday', label: 'Ontem' },
    { id: '7days', label: '7 Dias' },
    { id: 'thisMonth', label: 'Este Mês' },
    { id: 'lastMonth', label: 'Mês Passado' },
    { id: 'all', label: 'Tudo' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            currentFilter === filter.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
