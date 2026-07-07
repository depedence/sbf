import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import type { MessageResponse } from './types';

export const client = axios.create({
  baseURL: '/api',
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Spring Security has no custom entry point configured, so an
    // unauthenticated/expired-token request comes back as 403, not 401.
    if (status === 401 || status === 403) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<MessageResponse>;
  return axiosError.response?.data?.message ?? 'Что-то пошло не так. Попробуйте ещё раз.';
}
