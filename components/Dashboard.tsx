
import React from 'react';
import { Category } from '../types';
import SummaryCard from './SummaryCard';
import CategoryPieChart from './CategoryPieChart';
import MonthlyBarChart from './MonthlyBarChart';
import BudgetTracker from './BudgetTracker';
import { Budget } from '../types';

interface DashboardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categorySpending: { name: Category; value: number }[];
  monthlyTrends: { name: string; income: number; expense: number }[];
  budget: Budget;
  onSetBudget: (amount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalIncome,
  totalExpense,
  balance,
  categorySpending,
  monthlyTrends,
  budget,
  onSetBudget,
}) => {
  const mostSpentCategory = categorySpending.length > 0
    ? categorySpending.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
    : 'N/A';
    
  return (
    <section className="mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <SummaryCard title="Total Income" amount={totalIncome} color="green" />
        <SummaryCard title="Total Expense" amount={totalExpense} color="red" />
        <SummaryCard title="Balance" amount={balance} color="blue" />
        <SummaryCard title="Top Spending" amount={mostSpentCategory} color="yellow" isCategory />
      </div>

      {/* Budget Tracker and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Budget</h3>
          <BudgetTracker budget={budget.amount} expense={totalExpense} onSetBudget={onSetBudget} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Monthly Trends</h3>
          <MonthlyBarChart data={monthlyTrends} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Spending by Category</h3>
          <CategoryPieChart data={categorySpending} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
