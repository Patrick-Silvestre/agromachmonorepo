'use client';

import { useCallback, useEffect, useState } from 'react';

import { createApiError } from '@/lib/errors';
import { userService } from '@/services/userService';
import type { ApiError } from '@/types/api';

/**
 * Hook da tela backend-check.
 * Responsavel por:
 * - listar endpoints configurados
 * - controlar endpoint selecionado
 * - consultar backend e expor loading/data/error
 */
export function useBackendStatus() {
  const configuredPaths = userService.getConfiguredStatusPaths();
  const [selectedPath, setSelectedPath] = useState(configuredPaths[0] ?? '');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<ApiError | null>(null);

  // Carrega resposta do endpoint atual (ou endpoint passado manualmente).
  const load = useCallback(async (pathOverride?: string) => {
    const targetPath = pathOverride ?? selectedPath;

    if (!targetPath) {
      setError({ message: 'Nenhum endpoint configurado para teste.' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userService.getStatus(targetPath);
      setData(response);
    } catch (err) {
      setError(createApiError(err));
    } finally {
      setLoading(false);
    }
  }, [selectedPath]);

  useEffect(() => {
    // Dispara consulta inicial assim que o hook monta.
    void load(selectedPath);
  }, [load, selectedPath]);

  return {
    configuredPaths,
    selectedPath,
    setSelectedPath,
    loading,
    data,
    error,
    reload: () => load(selectedPath)
  };
}
