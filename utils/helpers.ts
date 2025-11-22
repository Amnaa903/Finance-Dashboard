export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Mortgage & Rent': '#ef4444',
    'Restaurants': '#f59e0b',
    'Groceries': '#10b981',
    'Shopping': '#8b5cf6',
    'Utilities': '#06b6d4',
    'Gas & Fuel': '#f97316',
    'Entertainment': '#ec4899',
    'Home Improvement': '#14b8a6',
    'Mobile Phone': '#3b82f6',
    'Fast Food': '#84cc16',
    'default': '#6b7280'
  };
  return colors[category] || colors.default;
};