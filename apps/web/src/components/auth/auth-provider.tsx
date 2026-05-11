'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { canAccessModule, getAllowedModules, type ModuleDefinition, type ModuleKey } from '@/lib/access-control';
import { clearAuthStorage, getSession, setSession } from '@/lib/storage';
import { authService } from '@/services/authService';
import type { AuthSession, LoginInput, RegisterInput } from '@/types/auth';
import type { ApiError } from '@/types/api';

import { createApiError } from '@/lib/errors';

/**
 * Contrato do contexto de autenticacao consumido pelo app inteiro.
 * Reune estado de sessao, erros, login/cadastro/logout e permissoes.
 */
type AuthContextValue = {
  loading: boolean;
  session: AuthSession | null;
  error: ApiError | null;
  allowedModules: ModuleDefinition[];
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => void;
  canAccess: (moduleKey: ModuleKey) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Converte resposta do servico para o formato de sessao usado no contexto.
function toSession(response: { accessToken: string; refreshToken?: string; user?: AuthSession['user']; raw?: unknown }) {
  const roles =
    response.raw && typeof response.raw === 'object' && Array.isArray((response.raw as { roles?: unknown }).roles)
      ? ((response.raw as { roles: string[] }).roles ?? [])
      : [];

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user,
    roles
  } as AuthSession;
}

/**
 * Provider global de autenticacao.
 * Papel no site:
 * - restaurar sessao salva
 * - executar login/cadastro
 * - calcular modulos permitidos por perfil
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    // Ao abrir o app, tenta restaurar sessao anterior do localStorage.
    const stored = getSession();
    setSessionState(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(input);
      const nextSession = toSession(response);
      // Persiste sessao no storage e no estado React.
      setSession(nextSession);
      setSessionState(nextSession);
      return nextSession;
    } catch (err) {
      const normalized = createApiError(err);
      setError(normalized);
      throw normalized;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(input);
      const nextSession = toSession(response);
      setSession(nextSession);
      setSessionState(nextSession);
      return nextSession;
    } catch (err) {
      const normalized = createApiError(err);
      setError(normalized);
      throw normalized;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Limpa backend local + estado de UI.
    authService.logout();
    clearAuthStorage();
    setSessionState(null);
  }, []);

  const roles = useMemo(() => session?.roles ?? [], [session?.roles]);
  const allowedModules = getAllowedModules(roles);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      error,
      allowedModules,
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
      canAccess: (moduleKey: ModuleKey) => canAccessModule(roles, moduleKey)
    }),
    [allowedModules, error, loading, login, logout, register, roles, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook interno de seguranca para garantir uso dentro do provider.
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }

  return context;
}
