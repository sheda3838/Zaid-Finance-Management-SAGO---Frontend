import React from 'react';
import type { DashboardPeriod } from '../types';

interface PeriodFilterProps {
  selectedPeriod: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  disabled?: boolean;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ selectedPeriod, onPeriodChange, disabled }) => {
  const periods: { value: DashboardPeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '7d', label: 'Last 7 Days' },
  ];

  return (
    <div className={`inline-flex bg-gray-100/80 p-1 rounded-xl shadow-inner border border-gray-200/50 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {periods.map((period) => {
        const isSelected = selectedPeriod === period.value;
        return (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              isSelected 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
};

export default PeriodFilter;
