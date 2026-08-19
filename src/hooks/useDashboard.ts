'use client';

import { useCallback, useEffect, useState } from 'react';

import { createApiError } from '@/lib/errors';
import { MOCK_DASHBOARD } from '@/lib/mock-dashboard';
import { api } from '@/services/api';
import type { ApiError } from '@/types/api';
import type { DashboardResponse } from '@/types/dashboard';

type DataSource = 'api' | 'mock';

/**
 * Carrega o dashboard operacional (GET /api/dashboard).
 * Se a API ainda nao responder (backend fora do ar, sem fazenda cadastrada, etc.),
 * cai para o mock local so para a tela continuar apresentavel - mesma logica do useModuleResource.
 */
export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [source, setSource] = useState<DataSource>('api');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: response } = await api.get<DashboardResponse>('/api/dashboard');
      setData(response);
      setSource('api');
    } catch (err) {
      setData(MOCK_DASHBOARD);
      setSource('mock');
      setError(createApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, source, reload: load };
}
