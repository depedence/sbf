import { api } from './client';
import type { Account, MessageResponse } from '../types';

export function getAccounts() {
  return api.get<Account[]>('/account').then((r) => r.data);
}

// Backend expects the raw name as a JSON string body (e.g. `"Cash"`), not { name }.
// Axios's default transformRequest JSON.stringifies the payload once it sees an
// application/json content type, which turns this plain string into that literal.
export function createAccount(name: string) {
  return api
    .post<Account>('/account', name, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((r) => r.data);
}

export function deleteAccount(id: number) {
  return api.delete<MessageResponse>(`/account/${id}`).then((r) => r.data);
}
