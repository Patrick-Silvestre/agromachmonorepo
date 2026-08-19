'use client';

import { useCallback, useEffect, useState } from 'react';

import { createApiError } from '@/lib/errors';
import { api } from '@/services/api';
import type { ApiError } from '@/types/api';

/**
 * Hook generico de CRUD contra um endpoint REST (list/create/update/remove).
 * Usado pelas telas de Areas de Producao, Avisos e Profissionais - mesmo formato de API nas tres.
 */
export function useCrudResource<TResponse extends { id: number }, TRequest>(endpoint: string) {
  const [items, setItems] = useState<TResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get<TResponse[]>(endpoint);
      setItems(data);
    } catch (err) {
      setError(createApiError(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: TRequest) {
    const { data } = await api.post<TResponse>(endpoint, payload);
    setItems((prev) => [...prev, data]);
    return data;
  }

  async function update(id: number, payload: TRequest) {
    const { data } = await api.put<TResponse>(`${endpoint}/${id}`, payload);
    setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
    return data;
  }

  async function remove(id: number) {
    await api.delete(`${endpoint}/${id}`);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return { items, loading, error, reload: load, create, update, remove };
}
