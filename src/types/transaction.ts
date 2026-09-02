export type TransactionType = 'income' | 'expense';

export const IncomeCategories = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other',
] as const;

export const ExpenseCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Rent',
  'Entertainment',
  'Health',
  'Education',
  'Other',
] as const;

export type IncomeCategory = typeof IncomeCategories[number];
export type ExpenseCategory = typeof ExpenseCategories[number];
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string; // The frontend abstraction maps backend _id to id
  _id?: string; // Optional property to handle raw mongoose documents seamlessly
  title?: string; // Optional for backward compatibility with old data
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}
