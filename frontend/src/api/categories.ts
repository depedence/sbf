import { api } from './client';
import type { Category, CategoryRequest, MessageResponse } from '../types';

export function getCategories() {
  return api.get<Category[]>('/category').then((r) => r.data);
}

export function createCategory(request: CategoryRequest) {
  return api.post<Category>('/category', request).then((r) => r.data);
}

export function deleteCategory(id: number) {
  return api.delete<MessageResponse>(`/category/${id}`).then((r) => r.data);
}
