import { client } from './client';
import type { Transaction } from './types';

export interface TransactionPayload {
  accountId: number;
  categoryId: number;
  amount: number;
  comment: string;
  date: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data } = await client.get<Transaction[]>('/transaction');
  return data;
}

export async function createTransaction(payload: TransactionPayload): Promise<Transaction> {
  const { data } = await client.post<Transaction>('/transaction', payload);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await client.delete(`/transaction/${id}`);
}
