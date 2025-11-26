
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category, PaymentMethod } from '../types';
import { CATEGORIES } from '../constants';
import Modal from './Modal';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  existingTransaction: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction, onUpdateTransaction, existingTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (existingTransaction) {
      setType(existingTransaction.type);
      setAmount(String(existingTransaction.amount));
      setCategory(existingTransaction.category);
      setDate(existingTransaction.date);
      setPaymentMethod(existingTransaction.paymentMethod || '');
      setNote(existingTransaction.note || '');
    } else {
      // Reset form on open for new transaction
      setType(TransactionType.EXPENSE);
      setAmount('');
      setCategory(Category.FOOD);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('');
      setNote('');
    }
  }, [existingTransaction, isOpen]);
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const transactionData = {
      amount: Number(amount),
      category,
      date,
      type,
      paymentMethod: paymentMethod || undefined,
      note,
    };
    
    if (existingTransaction) {
      onUpdateTransaction({ ...transactionData, id: existingTransaction.id });
    } else {
      onAddTransaction(transactionData);
    }
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleTypeChange(TransactionType.EXPENSE)}
              className={`w-full py-2 rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange(TransactionType.INCOME)}
              className={`w-full py-2 rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Income
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {CATEGORIES[type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
         <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method (Optional)</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as PaymentMethod | '')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">None</option>
            {Object.values(PaymentMethod).map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note (Optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Dinner with friends"
          ></textarea>
        </div>
        <div className="flex justify-end pt-2">
          <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {existingTransaction ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
