import { Transaction, BudgetItem } from '@/types';

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  }).filter(obj => obj[headers[0]]);
};

export const convertToTransactions = (csvData: any[]): Transaction[] => {
  return csvData.map(item => ({
    Date: item.Date,
    Description: item.Description,
    Amount: parseFloat(item.Amount),
    'Transaction Type': item['Transaction Type'] as 'debit' | 'credit',
    Category: item.Category,
    'Account Name': item['Account Name']
  }));
};

export const convertToBudget = (csvData: any[]): BudgetItem[] => {
  return csvData.map(item => ({
    Category: item.Category,
    Budget: parseFloat(item.Budget)
  }));
};