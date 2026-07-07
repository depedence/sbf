import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DecodedToken {
  email: string | null;
  exp: number | null;
}

function decodeToken(token: string): DecodedToken {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(normalized));
    return { email: json.sub ?? null, exp: json.exp ?? null };
  } catch {
    return { email: null, exp: null };
  }
}

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      login: (token: string) => {
        const decoded = decodeToken(token);
        set({ token, email: decoded.email, isAuthenticated: true });
      },
      logout: () => set({ token: null, email: null, isAuthenticated: false }),
    }),
    { name: 'sbf-auth' },
  ),
);
