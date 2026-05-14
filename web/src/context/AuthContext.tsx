import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchJson, getApiEnvelopeData, isFetchJsonFailure } from '../lib/api';
import type { AuthUser } from '../types';

const TOKEN_KEY = 'iti_careers_token';

export type AuthActionFail = { ok: false; status: number; data: unknown };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | AuthActionFail>;
  register: (payload: RegisterPayload) => Promise<{ ok: true } | AuthActionFail>;
  logout: () => Promise<void>;
  setSession: (token: string, user: AuthUser) => void;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'candidate' | 'employer' | 'admin';
};

type AuthCredentialsPayload = {
  user?: AuthUser;
  token?: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const setSession = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const t = localStorage.getItem(TOKEN_KEY);
      if (!t) {
        if (!cancelled) setInitializing(false);
        return;
      }
      const res = await fetchJson<unknown>('/v1/user/me', { method: 'GET', token: t });
      if (cancelled) return;
      const me = res.ok ? getApiEnvelopeData<AuthUser>(res.data) : undefined;
      if (me && typeof me === 'object' && 'id' in me && 'email' in me) {
        setUser(me);
        setToken(t);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
      setInitializing(false);
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: true } | AuthActionFail> => {
    const res = await fetchJson<unknown>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (isFetchJsonFailure(res)) {
      return { ok: false as const, status: res.status, data: res.data };
    }
    const creds = getApiEnvelopeData<AuthCredentialsPayload>(res.data) ?? (res.data as AuthCredentialsPayload);
    const u = creds?.user;
    const t = creds?.token;
    if (u && t) {
      setSession(t, u);
      return { ok: true as const };
    }
    return {
      ok: false as const,
      status: 502,
      data: { message: 'Unexpected response from the sign-in service.' },
    };
  }, [setSession]);

  const register = useCallback(async (payload: RegisterPayload): Promise<{ ok: true } | AuthActionFail> => {
    const res = await fetchJson<unknown>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (isFetchJsonFailure(res)) {
      return { ok: false as const, status: res.status, data: res.data };
    }
    return { ok: true as const };
  }, []);

  const logout = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      await fetchJson('/v1/auth/logout', { method: 'POST', token: t }).catch(() => {});
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      initializing,
      login,
      register,
      logout,
      setSession,
    }),
    [token, user, initializing, login, register, logout, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
