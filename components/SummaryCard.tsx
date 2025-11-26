
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number | string;
  color: 'green' | 'red' | 'blue' | 'yellow';
  isCategory?: boolean;
}

const colorClasses = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-500',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-500',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-500',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-500',
  },
};

const Icon: React.FC<{ color: string }> = ({ color }) => {
    const icons = {
        green: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />,
        red: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
        blue: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M5 5l14 14" />,
        yellow: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 9.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    }
    return <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icons[color]}</svg>;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, color, isCategory = false }) => {
  const classes = colorClasses[color];

  const formattedAmount = isCategory || typeof amount !== 'number'
    ? amount
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className={`${classes.bg} p-4 md:p-6 rounded-xl shadow-lg flex items-center space-x-4`}>
      <div className={`p-3 rounded-full ${classes.iconBg}`}>
        <Icon color={color} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-xl md:text-2xl font-bold ${classes.text}`}>{formattedAmount}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
