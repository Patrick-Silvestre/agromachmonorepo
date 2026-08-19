import { getStatusPath, getStatusPaths } from '@/lib/env';

import { api } from './api';

/**
 * Servico simples para endpoints ligados ao usuario e diagnostico da API.
 * Hoje ele abastece a tela backend-check.
 */
export const userService = {
  // Lista completa de endpoints GET configurados no ambiente.
  getConfiguredStatusPaths() {
    return getStatusPaths();
  },

  // Executa chamada GET no endpoint selecionado para validacao de conectividade.
  async getStatus(path?: string) {
    const statusPath = path ?? getStatusPath();
    const { data } = await api.get<unknown>(statusPath);
    return data;
  }
};
