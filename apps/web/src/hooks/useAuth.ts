'use client';

import { useAuthContext } from '@/components/auth/auth-provider';

// Atalho oficial para consumir o contexto de autenticacao em qualquer componente client.
export function useAuth() {
  return useAuthContext();
}
