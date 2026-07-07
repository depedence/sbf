import { client } from './client';
import type { Account } from './types';

export async function getAccounts(): Promise<Account[]> {
  const { data } = await client.get<Account[]>('/account');
  return data;
}

export async function createAccount(name: string): Promise<Account> {
  // Backend controller signature is `createAccount(@RequestBody String name)` —
  // it expects the raw JSON string body (e.g. "My account"), not { name }.
  const { data } = await client.post<Account>('/account', name, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function deleteAccount(id: number): Promise<void> {
  await client.delete(`/account/${id}`);
}
