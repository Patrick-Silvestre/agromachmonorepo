import type { AuthSession } from '@/types/auth';

// Chaves persistidas no localStorage para sessao e token JWT.
const TOKEN_STORAGE_KEY = 'nex-rural.jwt';
const SESSION_STORAGE_KEY = 'nex-rural.session';

// Le token atual para anexar no header Authorization.
export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Persiste token apos login/cadastro.
export function setToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Remove token em logout ou expiracao da sessao.
export function clearToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Le sessao completa do usuario autenticado.
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

// Salva sessao para restaurar estado apos recarregar a pagina.
export function setSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

// Limpa apenas os dados estruturados da sessao.
export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Limpeza total de autenticacao.
export function clearAuthStorage() {
  clearToken();
  clearSession();
}

export { SESSION_STORAGE_KEY, TOKEN_STORAGE_KEY };
