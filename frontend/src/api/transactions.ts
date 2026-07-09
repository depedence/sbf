import { api } from './client';
import type { MessageResponse, Transaction, TransactionRequest } from '../types';

export function getTransactions() {
  return api.get<Transaction[]>('/transaction').then((r) => r.data);
}

export function createTransaction(request: TransactionRequest) {
  return api.post<Transaction>('/transaction', request).then((r) => r.data);
}

export function deleteTransaction(id: number) {
  return api.delete<MessageResponse>(`/transaction/${id}`).then((r) => r.data);
}
