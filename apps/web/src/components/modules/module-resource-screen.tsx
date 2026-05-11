'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@nex-rural/ui';

import type { ModuleDefinition } from '@/lib/access-control';
import { useAuth } from '@/hooks/useAuth';
import { useModuleResource } from '@/hooks/useModuleResource';

// Formata qualquer valor para renderizacao segura na tabela.
function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

/**
 * Tela generica de modulo.
 * O que faz:
 * - valida permissao do usuario
 * - consulta endpoint do modulo
 * - renderiza busca e tabela de registros
 */
export function ModuleResourceScreen({ module }: { module: ModuleDefinition }) {
  const router = useRouter();
  const { canAccess } = useAuth();
  const allowed = canAccess(module.key);
  const { loading, error, rows, columns, source, sourceMessage, reload } = useModuleResource(module.endpoint, module.key);
  const [query, setQuery] = useState('');

  // Filtro simples de busca textual em todas as colunas.
  const filteredRows = useMemo(() => {
    if (!query.trim()) {
      return rows;
    }

    const search = query.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search));
  }, [query, rows]);

  useEffect(() => {
    // Se usuario nao pode acessar esse modulo, redireciona para dashboard.
    if (!allowed) {
      router.replace('/dashboard');
    }
  }, [allowed, router]);

  if (!allowed) {
    return null;
  }

  return (
    <main className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Modulo</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{module.title}</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">{module.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/80 px-4 py-3 text-xs font-semibold text-foreground">
            Endpoint: GET {module.endpoint}
          </div>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Pesquisar nos registros retornados"
            className="sm:max-w-sm"
          />

          <Button variant="secondary" onClick={() => void reload()} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar dados'}
          </Button>
        </div>

        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            Erro ao carregar dados: {error.message}
          </div>
        ) : null}

        {source === 'mock' ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {sourceMessage ?? 'Exibindo dados de exemplo local ate o backend retornar registros.'}
          </div>
        ) : null}

        {loading ? <p className="text-sm text-muted-foreground">Carregando dados reais...</p> : null}

        {!loading && !error && columns.length === 0 ? (
          <div className="rounded-xl border border-border bg-background/70 px-4 py-6 text-sm text-muted-foreground">
            O endpoint respondeu sem registros exibiveis no momento.
          </div>
        ) : null}

        {!loading && !error && columns.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {columns.map((column) => (
                    <th key={column} className="border-b border-border px-3 py-2 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={`${module.key}-row-${index}`} className="border-b border-border/70 bg-white">
                    {columns.map((column) => (
                      <td key={`${module.key}-col-${column}-${index}`} className="px-3 py-2 text-foreground">
                        {formatValue(row[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
