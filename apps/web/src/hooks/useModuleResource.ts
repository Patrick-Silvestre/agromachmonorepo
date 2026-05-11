'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { createApiError } from '@/lib/errors';
import { getMockRowsForModule } from '@/lib/mock-content';
import { api } from '@/services/api';
import type { ModuleKey } from '@/lib/access-control';
import type { ApiError } from '@/types/api';

type Row = Record<string, unknown>;
type DataSource = 'api' | 'mock' | 'empty';

/**
 * Converte diferentes formatos de payload para uma estrutura tabular unica.
 * Suporta array direto ou objeto com chaves comuns de paginacao/resultado.
 */
function normalizeRows(payload: unknown): Row[] {
  if (Array.isArray(payload)) {
    return payload.map((item) => (typeof item === 'object' && item !== null ? (item as Row) : { value: item }));
  }

  if (payload && typeof payload === 'object') {
    const objectPayload = payload as Record<string, unknown>;
    const candidates = [objectPayload.content, objectPayload.items, objectPayload.data, objectPayload.results];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.map((item) => (typeof item === 'object' && item !== null ? (item as Row) : { value: item }));
      }
    }

    return [objectPayload];
  }

  return [];
}

// Busca fallback local de acordo com modulo atual.
function resolveMockRows(moduleKey?: ModuleKey) {
  if (!moduleKey) {
    return [];
  }

  return getMockRowsForModule(moduleKey);
}

/**
 * Hook generico das telas de modulo.
 * Responsavel por consultar endpoint, detectar fallback e preparar colunas da tabela.
 */
export function useModuleResource(endpoint: string, moduleKey?: ModuleKey) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [source, setSource] = useState<DataSource>('empty');
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);

  // Fluxo de carga principal do modulo.
  const load = useCallback(async () => {
    const mockRows = resolveMockRows(moduleKey);

    setLoading(true);
    setError(null);
    setSourceMessage(null);

    try {
      const { data } = await api.get<unknown>(endpoint);
      const normalizedRows = normalizeRows(data);

      if (normalizedRows.length > 0) {
        // Backend respondeu com dados reais.
        setRows(normalizedRows);
        setSource('api');
        return;
      }

      if (mockRows.length > 0) {
        // Backend respondeu vazio, mas o modulo tem fallback didatico.
        setRows(mockRows);
        setSource('mock');
        setSourceMessage('Sem dados retornados no backend. Exibindo exemplo local de apoio.');
        return;
      }

      setRows([]);
      setSource('empty');
    } catch (err) {
      if (mockRows.length > 0) {
        // Backend indisponivel: mantem navegacao com dados locais.
        setRows(mockRows);
        setSource('mock');
        setSourceMessage('Backend indisponivel no momento. Exibindo exemplo local para navegacao.');
      } else {
        // Sem fallback: devolve erro para a UI exibir.
        setRows([]);
        setSource('empty');
        setError(createApiError(err));
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, moduleKey]);

  useEffect(() => {
    // Recarrega automaticamente quando endpoint/modulo mudar.
    void load();
  }, [load]);

  const columns = useMemo(() => {
    const first = rows[0];
    if (!first) {
      return [] as string[];
    }

    return Object.keys(first).slice(0, 6);
  }, [rows]);

  return {
    loading,
    error,
    rows,
    columns,
    source,
    sourceMessage,
    reload: load
  };
}
