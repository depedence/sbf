export type TransactionType = 'INCOME' | 'EXPENSE';

// Nested user echoed back by the backend on every entity — never render/persist `password`.
export interface LeakedUser {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface Account {
  id: number;
  user: LeakedUser;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Category {
  id: number;
  user: LeakedUser;
  name: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: number;
  user: LeakedUser;
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

export interface TransactionRequest {
  accountId: number;
  categoryId: number;
  amount: number;
  comment: string;
  date: string;
}

export interface CategoryRequest {
  name: string;
  type: TransactionType;
}
