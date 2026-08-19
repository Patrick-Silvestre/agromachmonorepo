import axios, { type InternalAxiosRequestConfig } from 'axios';

import { clearAuthStorage, getToken } from '@/lib/storage';
import { getApiBaseUrl } from '@/lib/env';
import { createApiError } from '@/lib/errors';

/**
 * Cliente HTTP unico do frontend.
 * Todas as chamadas da aplicacao passam por esta instancia para compartilhar:
 * - base URL do ambiente
 * - token JWT automatico
 * - normalizacao de erros
 */
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de request: adiciona Authorization quando existir sessao ativa.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de response: trata 401 e converte erro para contrato de UI.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
    }

    return Promise.reject(createApiError(error));
  }
);
