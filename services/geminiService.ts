import { Transaction } from "../types";

export const analyzeExpensesWithGemini = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "There are no transactions to analyze. Please add some expenses and try again.";
  }

  try {
    const response = await fetch('/api/analyze-expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
      signal: AbortSignal.timeout(30_000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return typeof result.error === 'string'
        ? result.error
        : 'Expense analysis is temporarily unavailable. Please try again later.';
    }

    return typeof result.analysis === 'string'
      ? result.analysis
      : 'The analysis service returned an unexpected response.';
  } catch {
    return 'Unable to reach the analysis service. Make sure the API server is running and try again.';
  }
};