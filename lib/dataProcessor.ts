import { Transaction, BudgetItem, Analytics, BudgetComparison } from '@/types';

export const processFinanceData = (transactions: Transaction[], budget: BudgetItem[]): Analytics => {
  const spendingData = transactions.filter(item => 
    item['Transaction Type'] === 'debit' && 
    !item.Category.includes('Credit Card Payment')
  );

  const incomeData = transactions.filter(item => 
    item['Transaction Type'] === 'credit' && 
    item.Category.includes('Income')
  );

  const totalSpending = spendingData.reduce((sum, item) => sum + item.Amount, 0);
  const totalIncome = incomeData.reduce((sum, item) => sum + item.Amount, 0);

  const categorySpending = spendingData.reduce((acc, item) => {
    acc[item.Category] = (acc[item.Category] || 0) + item.Amount;
    return acc;
  }, {} as { [key: string]: number });

  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const monthlySpending = spendingData.reduce((acc, item) => {
    const [month, day, year] = item.Date.split('/');
    const monthKey = `${year}-${month.padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + item.Amount;
    return acc;
  }, {} as { [key: string]: number });

  const monthlyIncome = incomeData.reduce((acc, item) => {
    const [month, day, year] = item.Date.split('/');
    const monthKey = `${year}-${month.padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + item.Amount;
    return acc;
  }, {} as { [key: string]: number });

  const monthlyTrend = Object.keys({...monthlySpending, ...monthlyIncome})
    .map(month => ({
      month,
      spending: monthlySpending[month] || 0,
      income: monthlyIncome[month] || 0
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const budgetComparison: BudgetComparison[] = budget.map(budgetItem => {
    const actualSpending = categorySpending[budgetItem.Category] || 0;
    const difference = actualSpending - budgetItem.Budget;
    const percentage = budgetItem.Budget > 0 ? (actualSpending / budgetItem.Budget) * 100 : 0;
    
    return {
      Category: budgetItem.Category,
      Budget: budgetItem.Budget,
      Actual: actualSpending,
      Difference: difference,
      Percentage: percentage
    };
  });

  return {
    totalSpending,
    totalIncome,
    totalTransactions: spendingData.length + incomeData.length,
    topCategories,
    monthlySpending,
    budgetComparison,
    categorySpending,
    monthlyTrend
  };
};