import axios, { type AxiosError } from 'axios';
import { AUTH_INVALIDATED_EVENT, tokenStorage } from '../lib/tokenStorage';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function hasMessage(data: unknown): data is { message: string } {
  return typeof data === 'object' && data !== null && typeof (data as Record<string, unknown>).message === 'string';
}

function hasError(data: unknown): data is { error: string } {
  return typeof data === 'object' && data !== null && typeof (data as Record<string, unknown>).error === 'string';
}

// Augment errors with a `friendlyMessage` the UI can show directly in a toast,
// reconciling the backend's several inconsistent error body shapes (see memory:
// project-backend-api-quirks) into one string.
declare module 'axios' {
  interface AxiosError {
    friendlyMessage?: string;
    isAuthFailure?: boolean;
  }
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      // Bare 403 with no JSON body = Spring Security's default entry point rejecting
      // a missing/invalid JWT — NOT the app's own AccessDeniedException (which has a body).
      if (status === 403 && !hasMessage(data)) {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT));
        error.isAuthFailure = true;
        error.friendlyMessage = 'Сессия истекла — войдите снова';
      } else if (hasMessage(data)) {
        error.friendlyMessage = data.message;
      } else if (hasError(data)) {
        error.friendlyMessage = data.error;
      } else {
        error.friendlyMessage = 'Что-то пошло не так. Попробуйте ещё раз.';
      }
    } else {
      error.friendlyMessage = 'Нет соединения с сервером';
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = 'Что-то пошло не так'): string {
  if (error && typeof error === 'object' && 'friendlyMessage' in error) {
    const msg = (error as AxiosError).friendlyMessage;
    if (msg) return msg;
  }
  return fallback;
}
