import { clearAuthStorage, setSession, setToken } from '@/lib/storage';
import type { AuthSession, LoginInput, LoginResponse, RegisterInput } from '@/types/auth';
import type { User } from '@/types/user';

import { api } from './api';

/**
 * Contrato flexivel para aceitar diferentes formatos de resposta de auth.
 * Isso evita acoplamento forte com um unico nome de campo do backend.
 */
type LoginApiResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  role?: string;
  roles?: string[] | string;
  authorities?: string[] | string;
  user?: User;
  [key: string]: unknown;
};

// Extrai token principal considerando variacoes comuns de naming.
function extractAccessToken(payload: LoginApiResponse) {
  const token = payload.accessToken ?? payload.access_token ?? payload.token;

  if (!token) {
    throw new Error('Resposta de login sem token de acesso.');
  }

  return token;
}

// Extrai refresh token quando API fornecer renovacao de sessao.
function extractRefreshToken(payload: LoginApiResponse) {
  return payload.refreshToken ?? payload.refresh_token;
}

// Decodifica payload do JWT no client para leitura de claims (roles/scope).
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  const payloadPart = parts.at(1);

  if (!payloadPart) {
    return null;
  }

  try {
    const payload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    if (typeof window === 'undefined') {
      return null;
    }

    const decoded = window.atob(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Normaliza papel para sempre retornar array de strings.
function readRoleValues(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

/**
 * Resolve papeis do usuario.
 * Ordem de prioridade:
 * 1) campos da resposta
 * 2) dados de user dentro da resposta
 * 3) claims do JWT
 */
function extractRoles(payload: LoginApiResponse, accessToken: string) {
  const directRoles = [
    ...readRoleValues(payload.roles),
    ...readRoleValues(payload.role),
    ...readRoleValues(payload.authorities),
    ...readRoleValues(payload.user?.roles),
    ...readRoleValues(payload.user?.role),
    ...readRoleValues(payload.user?.authorities)
  ];

  if (directRoles.length > 0) {
    return Array.from(new Set(directRoles));
  }

  const claims = decodeJwtPayload(accessToken);

  if (!claims) {
    return [];
  }

  return Array.from(
    new Set([
      ...readRoleValues(claims.roles),
      ...readRoleValues(claims.role),
      ...readRoleValues(claims.authorities),
      ...readRoleValues(claims.scope)
    ])
  );
}

// Ajusta campos de usuario para um shape unico no frontend.
function normalizeUser(payload: LoginApiResponse) {
  const user = payload.user;
  if (!user) {
    return undefined;
  }

  return {
    ...user,
    name: user.name ?? (typeof user.nome === 'string' ? user.nome : undefined),
    email: user.email ?? (typeof user.username === 'string' ? user.username : undefined)
  } as User;
}

// Monta sessao final e persiste no storage para continuidade de login.
function buildSession(payload: LoginApiResponse): AuthSession {
  const accessToken = extractAccessToken(payload);
  const refreshToken = extractRefreshToken(payload);
  const user = normalizeUser(payload);
  const roles = extractRoles(payload, accessToken);

  const session: AuthSession = {
    accessToken,
    refreshToken,
    user,
    roles
  };

  setToken(accessToken);
  setSession(session);

  return session;
}

// Funcao base reaproveitada por login/cadastro.
async function authenticate(path: string, body: unknown) {
  const { data } = await api.post<LoginApiResponse>(path, body);
  return buildSession(data);
}

/**
 * API de autenticacao consumida pelo contexto de auth.
 * Mantem o fluxo centralizado e facil de evoluir.
 */
export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const session = await authenticate('/auth/login', input);

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
      raw: session
    };
  },

  async register(input: RegisterInput): Promise<LoginResponse> {
    try {
      const session = await authenticate('/auth/register', input);
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
        raw: session
      };
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 404) {
        throw error;
      }

      const session = await authenticate('/auth/signup', input);
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
        raw: session
      };
    }
  },

  logout() {
    clearAuthStorage();
  }
};
