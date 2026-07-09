const TOKEN_KEY = 'finly_token';

export const AUTH_INVALIDATED_EVENT = 'finly:auth-invalidated';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};
