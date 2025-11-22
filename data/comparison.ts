import { ComparisonData } from '@/types';

export const previousPeriodData: ComparisonData = {
  totalSpending: 1950.25,
  topCategories: [
    ['Mortgage & Rent', 1247.44],
    ['Dining', 280.45],
    ['Groceries', 120.30],
    ['Shopping', 95.67],
    ['Utilities', 85.20],
    ['Transportation', 45.89],
    ['Entertainment', 35.90],
    ['Other', 39.40]
  ],
  monthlySpending: {
    '2018-01': 1793.03,
    '2018-02': 1650.45,
    '2018-03': 1720.89
  }
};

export const averageData: ComparisonData = {
  totalSpending: 1850.00,
  topCategories: [
    ['Mortgage & Rent', 1200.00],
    ['Dining', 200.00],
    ['Groceries', 150.00],
    ['Shopping', 100.00],
    ['Utilities', 100.00],
    ['Transportation', 50.00],
    ['Entertainment', 50.00]
  ],
  monthlySpending: {
    '2018-01': 1800.00,
    '2018-02': 1750.00,
    '2018-03': 1850.00
  }
};
