import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp * 1000 <= Date.now();
}

export function emailFromToken(token: string): string | null {
  return decodeToken(token)?.sub ?? null;
}
