import type { User } from './user';

/**
 * Tipos centrais do fluxo de autenticacao.
 * Estes contratos sao usados pelo formulario, contexto de auth e servico HTTP.
 */
export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: User;
  raw?: unknown;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  user?: User;
  // Lista de papeis autorizados recebidos do backend/JWT.
  roles: string[];
};
