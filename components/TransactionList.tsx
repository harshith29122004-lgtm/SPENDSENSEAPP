
import React from 'react';
import { Transaction, TransactionType, FilterState, Category } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; }> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const sign = isIncome ? '+' : '-';

  return (
    <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          {isIncome ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
          }
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{transaction.category}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(transaction.date).toLocaleDateString()}
            {transaction.paymentMethod && <span className="italic"> - {transaction.paymentMethod}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-bold ${amountColor}`}>{`${sign}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}`}</p>
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(transaction)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={() => onDelete(transaction.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, filters, setFilters, onEdit, onDelete }) => {
  const allCategories = [...new Set([...CATEGORIES.expense, ...CATEGORIES.income])].sort();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const resetFilters = () => {
    setFilters({ type: 'all', category: 'all', dateFrom: '', dateTo: '' });
  };

  const handleExport = () => {
    const headers = "ID,Date,Type,Category,Amount,Payment Method,Note\n";
    const rows = transactions.map(t => 
        [
            t.id,
            t.date,
            t.type,
            t.category,
            t.amount,
            t.paymentMethod || '',
            `"${t.note?.replace(/"/g, '""') || ''}"`
        ].join(',')
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "spendsense_transactions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Recent Transactions</h2>
      
      <div className="mb-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Type filter */}
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>
          {/* Category filter */}
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Categories</option>
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {/* Date from */}
          <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          {/* Date to */}
          <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button onClick={resetFilters} className="w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">Reset</button>
            <button onClick={handleExport} className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">Export</button>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">No transactions match your filters.</p>
        </div>
      ) : (
        <ul className="space-y-3">
            {transactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
      )}
    </section>
  );
};

export default TransactionList;
