export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Account {
  id: number;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: number;
  account: Account;
  category: Category;
  type: TransactionType;
  amount: number;
  comment: string | null;
  date: string;
  createdAt: string;
}

export interface StatisticResponse {
  totalIncome: number;
  totalExpense: number;
  byCategory: Record<string, number>;
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}
