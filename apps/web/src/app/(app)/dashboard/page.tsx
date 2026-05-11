'use client';

import Link from 'next/link';

import { Button, Card } from '@nex-rural/ui';

import { formatRoleLabel, getModuleByKey } from '@/lib/access-control';
import { useAuth } from '@/hooks/useAuth';
import { useModuleResource } from '@/hooks/useModuleResource';

// Rotas de atalhos exibidas no topo do dashboard.
const pedidosModule = getModuleByKey('pedidos');
const postagensModule = getModuleByKey('postagens');

// Helper para ler a primeira chave valida disponivel no objeto retornado da API.
function readText(row: Record<string, unknown>, candidates: string[], fallback: string) {
  for (const candidate of candidates) {
    const value = row[candidate];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return fallback;
}

/**
 * Dashboard principal da area autenticada.
 * Funcao no site:
 * - resumir saude operacional
 * - mostrar dados recentes de pedidos e postagens
 * - expor quais modulos estao liberados pelo perfil atual
 */
export default function DashboardPage() {
  const { session, allowedModules } = useAuth();
  const pedidosData = useModuleResource('/api/pedidos', 'pedidos');
  const postagensData = useModuleResource('/api/postagens', 'postagens');

  const role = session?.roles?.[0] ?? 'USUARIO';
  const modules = allowedModules.filter((module) => module.key !== 'dashboard');

  const latestPedidos = pedidosData.rows.slice(0, 3);
  const latestPostagens = postagensData.rows.slice(0, 3);
  const ordersCount = pedidosData.rows.length;
  const contentCount = postagensData.rows.length;

  return (
    <main className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="surface p-5 sm:p-7">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Ola, {session?.user?.name ?? 'usuario'}!</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Painel operacional do webapp nex-rural. Apenas modulos permitidos para seu perfil sao exibidos no menu e nesta pagina.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="status-chip">Perfil ativo: {formatRoleLabel(role)}</span>
            <span className="status-chip">Modulos liberados: {modules.length}</span>
            <span className="status-chip">Origem pedidos: {pedidosData.source === 'mock' ? 'mock' : 'backend'}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={pedidosModule?.path ?? '/pedidos'}>
              <Button>Abrir pedidos</Button>
            </Link>
            <Link href={postagensModule?.path ?? '/postagens'}>
              <Button variant="secondary">Abrir postagens</Button>
            </Link>
          </div>
        </div>

        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-foreground">Resumo rapido</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              Usuario: <span className="font-semibold text-foreground">{session?.user?.email ?? 'sem e-mail'}</span>
            </p>
            <p className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              Total de pedidos carregados: <span className="font-semibold text-foreground">{ordersCount}</span>
            </p>
            <p className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              Total de postagens carregadas: <span className="font-semibold text-foreground">{contentCount}</span>
            </p>
            <p className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
              Origem dos dados:{' '}
              <span className="font-semibold text-foreground">{pedidosData.source === 'mock' || postagensData.source === 'mock' ? 'parcial mock' : 'backend real'}</span>
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-1 p-5">
          <p className="text-sm text-muted-foreground">Pedidos ativos</p>
          <p className="text-3xl font-bold text-foreground">{ordersCount}</p>
        </Card>
        <Card className="space-y-1 p-5">
          <p className="text-sm text-muted-foreground">Postagens ativas</p>
          <p className="text-3xl font-bold text-foreground">{contentCount}</p>
        </Card>
        <Card className="space-y-1 p-5">
          <p className="text-sm text-muted-foreground">Modulos liberados</p>
          <p className="text-3xl font-bold text-foreground">{modules.length}</p>
        </Card>
        <Card className="space-y-1 p-5">
          <p className="text-sm text-muted-foreground">Status backend</p>
          <p className="text-3xl font-bold text-foreground">{pedidosData.error || postagensData.error ? 'Falha' : 'OK'}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-4 p-5">
          <h2 className="text-xl font-semibold text-foreground">Pedidos recentes</h2>
          {pedidosData.loading ? <p className="text-sm text-muted-foreground">Carregando pedidos...</p> : null}
          {!pedidosData.loading && latestPedidos.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum pedido no momento.</p> : null}
          <div className="space-y-2">
            {latestPedidos.map((pedido, index) => {
              const row = pedido as Record<string, unknown>;
              return (
                <div key={`dashboard-pedido-${index}`} className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm">
                  <p className="font-medium text-foreground">{readText(row, ['cliente', 'nome', 'id'], 'Pedido')}</p>
                  <p className="text-xs text-muted-foreground">
                    {readText(row, ['status'], 'Sem status')} - {readText(row, ['total', 'valor'], '--')}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-xl font-semibold text-foreground">Postagens recentes</h2>
          {postagensData.loading ? <p className="text-sm text-muted-foreground">Carregando postagens...</p> : null}
          {!postagensData.loading && latestPostagens.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma postagem no momento.</p> : null}
          <div className="space-y-2">
            {latestPostagens.map((postagem, index) => {
              const row = postagem as Record<string, unknown>;
              return (
                <div key={`dashboard-postagem-${index}`} className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm">
                  <p className="font-medium text-foreground">{readText(row, ['titulo', 'nome', 'id'], 'Postagem')}</p>
                  <p className="text-xs text-muted-foreground">
                    {readText(row, ['autor'], 'Autor nao informado')} - {readText(row, ['publicadoEm', 'data'], '--')}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-xl font-semibold text-foreground">Acesso por perfil</h2>
          <p className="text-sm text-muted-foreground">
            Estes modulos estao disponiveis para seu usuario. Rotas sem permissao nao aparecem no menu lateral.
          </p>
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => (
              <span key={`chip-${module.key}`} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                {module.title}
              </span>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.slice(0, 6).map((module) => (
          <Card key={module.key} className="space-y-3 p-5">
            <h2 className="text-lg font-semibold text-foreground">{module.title}</h2>
            <p className="text-sm text-muted-foreground">{module.description}</p>
            <div className="pt-1">
              <Link href={module.path}>
                <Button variant="secondary">Abrir modulo</Button>
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
