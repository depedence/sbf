import { create } from 'zustand';
import * as authApi from '../api/auth';
import { getErrorMessage } from '../api/client';
import { AUTH_INVALIDATED_EVENT, tokenStorage } from '../lib/tokenStorage';
import { emailFromToken, isTokenExpired } from '../lib/jwt';
import { toast } from './toastStore';

interface AuthState {
  token: string | null;
  email: string | null;
  authBusy: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: (silent?: boolean) => void;
}

function validInitialToken(): string | null {
  const token = tokenStorage.get();
  if (!token || isTokenExpired(token)) return null;
  return token;
}

export const useAuthStore = create<AuthState>((set) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_INVALIDATED_EVENT, () => {
      set({ token: null, email: null });
      toast.warning('Сессия истекла — войдите снова');
    });
  }

  const initialToken = validInitialToken();

  return {
    token: initialToken,
    email: initialToken ? emailFromToken(initialToken) : null,
    authBusy: false,

    login: async (email, password) => {
      set({ authBusy: true });
      try {
        const { token } = await authApi.login(email, password);
        tokenStorage.set(token);
        const decodedEmail = emailFromToken(token) ?? email;
        set({ token, email: decodedEmail });
        toast.success(`С возвращением, ${decodedEmail}!`);
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не удалось войти'));
        return false;
      } finally {
        set({ authBusy: false });
      }
    },

    register: async (name, email, password) => {
      set({ authBusy: true });
      try {
        const { token } = await authApi.register(name, email, password);
        tokenStorage.set(token);
        const decodedEmail = emailFromToken(token) ?? email;
        set({ token, email: decodedEmail });
        toast.success(`Аккаунт создан — добро пожаловать, ${name}!`);
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не удалось зарегистрироваться'));
        return false;
      } finally {
        set({ authBusy: false });
      }
    },

    logout: (silent) => {
      tokenStorage.clear();
      set({ token: null, email: null });
      if (!silent) toast.info('Вы вышли из аккаунта');
    },
  };
});

export const selectIsAuthenticated = (state: AuthState) => !!state.token;
