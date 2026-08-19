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

/**
 * Hook generico das telas de modulo.
 *
 * Fluxo didatico:
 * 1. tenta carregar o endpoint REST real;
 * 2. se a API devolver registros, eles substituem totalmente qualquer mock;
 * 3. se a API falhar ou vier vazia, usa mock local apenas para apresentacao;
 * 4. se nao houver API nem mock, devolve erro/estado vazio para a tela.
 */
export function useModuleResource(endpoint: string, moduleKey?: ModuleKey) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [source, setSource] = useState<DataSource>('empty');
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);

  // Fluxo de carga principal do modulo.
  const load = useCallback(async () => {
    const mockRows = getMockRowsForModule(moduleKey);

    setLoading(true);
    setError(null);
    setSourceMessage(null);

    try {
      const { data } = await api.get<unknown>(endpoint);
      const normalizedRows = normalizeRows(data);

      if (normalizedRows.length > 0) {
        // API real tem prioridade total: qualquer mock anterior sai da tela.
        setRows(normalizedRows);
        setSource('api');
        return;
      }

      if (mockRows.length > 0) {
        setRows(mockRows);
        setSource('mock');
        setSourceMessage('API respondeu sem registros. Exibindo dados locais de demonstracao ate o backend enviar dados reais.');
        return;
      }

      setRows([]);
      setSource('empty');
    } catch (err) {
      if (mockRows.length > 0) {
        setRows(mockRows);
        setSource('mock');
        setSourceMessage('Nao foi possivel consultar a API agora. Exibindo dados locais de demonstracao.');
        return;
      }

      setRows([]);
      setSource('empty');
      setError(createApiError(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint, moduleKey]);

  useEffect(() => {
    // Recarrega automaticamente quando endpoint ou modulo mudar.
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
