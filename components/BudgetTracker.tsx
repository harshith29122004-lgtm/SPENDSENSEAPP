
import React, { useState } from 'react';

interface BudgetTrackerProps {
  budget: number;
  expense: number;
  onSetBudget: (amount: number) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, expense, onSetBudget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const percentage = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;
  const remaining = budget - expense;

  const getProgressBarColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const handleSave = () => {
    if(newBudget > 0) {
        onSetBudget(newBudget);
    }
    setIsEditing(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600 dark:text-gray-400">Monthly Budget</span>
        {isEditing ? (
            <div className="flex items-center space-x-2">
                <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-24 px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSave} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Save</button>
            </div>
        ) : (
            <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget)}
                </span>
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                    </svg>
                </button>
            </div>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-left">
          <p className="text-gray-500 dark:text-gray-400">Spent</p>
          <p className="font-semibold text-red-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense)}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400">Remaining</p>
          <p className={`font-semibold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
