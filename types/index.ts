export interface Transaction {
  Date: string;
  Description: string;
  Amount: number;
  'Transaction Type': 'debit' | 'credit';
  Category: string;
  'Account Name': string;
}

export interface BudgetItem {
  Category: string;
  Budget: number;
}

export interface Analytics {
  totalSpending: number;
  totalIncome: number;
  totalTransactions: number;
  topCategories: [string, number][];
  monthlySpending: { [key: string]: number };
  budgetComparison: BudgetComparison[];
  categorySpending: { [key: string]: number };
  monthlyTrend: { month: string; spending: number; income: number }[];
}

export interface BudgetComparison {
  Category: string;
  Budget: number;
  Actual: number;
  Difference: number;
  Percentage: number;
}
export interface ComparisonData {
  totalSpending: number;
  topCategories: [string, number][];
  monthlySpending: {
    [key: string]: number;
  };
}