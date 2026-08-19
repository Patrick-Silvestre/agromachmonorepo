'use client';

import { Button, Card, Select } from '@/components/ui';

import { useBackendStatus } from '@/hooks/useBackendStatus';

/**
 * Card de diagnostico da integracao.
 * Exibe configuracao de endpoint, resposta do backend e erros HTTP.
 */
export function BackendStatusCard() {
  const { configuredPaths, selectedPath, setSelectedPath, loading, data, error, reload } = useBackendStatus();

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Conexao com backend</h2>
          <p className="text-xs text-muted-foreground">Endpoints configurados: {configuredPaths.length}</p>
        </div>
        <Button variant="secondary" onClick={() => void reload()} disabled={loading}>
          {loading ? 'Consultando...' : 'Recarregar'}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="status-endpoint">
          Endpoint GET para teste
        </label>
        <Select id="status-endpoint" value={selectedPath} onChange={(event) => setSelectedPath(event.currentTarget.value)} disabled={loading}>
          {configuredPaths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </Select>
      </div>

      {error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          Falha ao consultar o endpoint configurado: {error.message}
          {error.status ? <span className="ml-2 font-semibold">HTTP {error.status}</span> : null}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Resposta recebida do backend:</p>
          <pre className="max-h-[420px] overflow-auto rounded-lg border border-border bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
            {loading && data === null ? 'Carregando...' : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}
