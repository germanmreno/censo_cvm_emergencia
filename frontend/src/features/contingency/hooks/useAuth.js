import { useState, useEffect, useCallback } from 'react';
import { api, setAccessToken, setUnauthorizedHandler } from '../../../lib/api';

const STORAGE_KEY = 'cvm-auth';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).user : null;
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAccessToken(parsed.accessToken);
      }
    } catch {
      // ignore
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: u } = data.data;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessToken, refreshToken, user: u }),
    );
    setAccessToken(accessToken);
    setUser(u);
    return u;
  }, []);

  return { user, login, logout };
}
