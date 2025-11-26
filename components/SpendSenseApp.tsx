import React, { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Transaction, TransactionType, Category, Budget, FilterState, User } from '../types';
import Header from './Header';
import Dashboard from './Dashboard';
import TransactionList from './TransactionList';
import AddTransactionModal from './AddTransactionModal';
import GeminiAnalysisModal from './GeminiAnalysisModal';
import ProfilePage from './ProfilePage';

interface SpendSenseAppProps {
    currentUserEmail: string;
    onLogout: () => void;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const SpendSenseApp: React.FC<SpendSenseAppProps> = ({ currentUserEmail, onLogout, users, setUsers }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`transactions_${currentUserEmail}`, []);
  const [budget, setBudget] = useLocalStorage<Budget>(`budget_${currentUserEmail}`, { amount: 1000, period: 'monthly' });
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterState>({ type: 'all', category: 'all', dateFrom: '', dateTo: '' });

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const { totalIncome, totalExpense, balance, categorySpending, monthlyTrends } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const spending: { [key in Category]?: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
      
    const trends: { [key: string]: { income: number, expense: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!trends[month]) {
        trends[month] = { income: 0, expense: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        trends[month].income += t.amount;
      } else {
        trends[month].expense += t.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      categorySpending: Object.entries(spending).map(([name, value]) => ({ name: name as Category, value: value || 0 })),
      monthlyTrends: Object.entries(trends).map(([name, values]) => ({ name, ...values })).reverse(),
    };
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.category !== 'all' && t.category !== filters.category) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters]);
  
  const handleSetBudget = useCallback((amount: number) => {
      setBudget(prev => ({...prev, amount}));
  }, [setBudget]);

  return (
    <>
      <Header 
        onAddTransaction={openAddModal} 
        onShowAnalysis={() => setIsAnalysisModalOpen(true)}
        onLogout={onLogout}
        onNavigateToProfile={() => setCurrentView('profile')}
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'dashboard' ? (
          <>
            <Dashboard
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              categorySpending={categorySpending}
              monthlyTrends={monthlyTrends}
              budget={budget}
              onSetBudget={handleSetBudget}
            />
            <TransactionList 
              transactions={filteredAndSortedTransactions} 
              filters={filters}
              setFilters={setFilters}
              onEdit={openEditModal}
              onDelete={handleDeleteTransaction}
            />
          </>
        ) : (
          <ProfilePage 
            currentUserEmail={currentUserEmail}
            users={users}
            setUsers={setUsers}
            onLogout={onLogout}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>
      
      {isAddModalOpen && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          existingTransaction={editingTransaction}
        />
      )}
      
      {isAnalysisModalOpen && (
        <GeminiAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          transactions={transactions}
        />
      )}
    </>
  );
};

export default SpendSenseApp;