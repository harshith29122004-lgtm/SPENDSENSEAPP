
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { analyzeExpensesWithGemini } from '../services/geminiService';
import Modal from './Modal';

interface GeminiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const GeminiAnalysisModal: React.FC<GeminiAnalysisModalProps> = ({ isOpen, onClose, transactions }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError('');
        try {
          const result = await analyzeExpensesWithGemini(transactions);
          setAnalysis(result);
        } catch (err: any) {
          setError('Failed to get analysis. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [isOpen, transactions]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Your smart analysis is being generated...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    return (
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans text-base leading-relaxed">
            {analysis}
        </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Financial Insights">
      {renderContent()}
    </Modal>
  );
};

export default GeminiAnalysisModal;
