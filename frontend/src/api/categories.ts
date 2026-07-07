import { client } from './client';
import type { Category, TransactionType } from './types';

export interface CategoryPayload {
  name: string;
  type: TransactionType;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>('/category');
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await client.post<Category>('/category', payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await client.delete(`/category/${id}`);
}
