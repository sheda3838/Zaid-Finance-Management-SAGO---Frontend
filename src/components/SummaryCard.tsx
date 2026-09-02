import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  isBalance?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon: Icon, iconColorClass, iconBgClass, isBalance }) => {
  const isNegative = isBalance && amount < 0;
  
  // Format as currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold tracking-tight ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
          {isNegative ? '-' : ''}{formattedAmount}
        </h3>
      </div>
    </div>
  );
};

export default SummaryCard;
