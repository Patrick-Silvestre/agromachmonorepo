'use client';

import { Card } from '@/components/ui';

import { useAuth } from '@/hooks/useAuth';
import { useCountUp } from '@/hooks/useCountUp';
import { useDashboard } from '@/hooks/useDashboard';
import type { AreaProducao, Aviso, MaquinaStatusResumo, StatusMaquina, TipoAreaProducao, TipoAviso } from '@/types/dashboard';

const STATUS_MAQUINA_LABEL: Record<StatusMaquina, string> = {
  OPERACIONAL: 'Operacional',
  MANUTENCAO: 'Em manutencao',
  QUEBRADA: 'Quebrada'
};

const STATUS_MAQUINA_COLOR: Record<StatusMaquina, string> = {
  OPERACIONAL: 'bg-primary',
  MANUTENCAO: 'bg-accent',
  QUEBRADA: 'bg-danger'
};

const TIPO_AREA_LABEL: Record<TipoAreaProducao, string> = {
  PASTO: 'Pasto',
  TALHAO: 'Talhao',
  CONFINAMENTO: 'Confinamento'
};

const TIPO_AVISO_LABEL: Record<TipoAviso, string> = {
  FERTILIZACAO: 'Fertilizacao',
  PREPARO_SOLO: 'Preparo de solo',
  VACINACAO: 'Vacinacao',
  OUTRO: 'Outro'
};

// Datas vem em ISO simples (yyyy-MM-dd ou com hora). Evita depender de lib externa so para isso.
function parseLocalDate(value: string) {
  return new Date(value.length === 10 ? `${value}T00:00:00` : value);
}

function formatRelative(value: string) {
  const date = parseLocalDate(value);
  const diffMs = date.getTime() - new Date().setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'amanha';
  if (diffDays === -1) return 'ontem';
  if (diffDays > 1) return `em ${diffDays} dias`;
  return `atrasado ha ${Math.abs(diffDays)} dias`;
}

function formatUpdatedAt(value: string | null) {
  if (!value) return 'sem atualizacao';
  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.round(diffMs / 3_600_000);

  if (diffHours < 1) return 'atualizado agora';
  if (diffHours < 24) return `atualizado ha ${diffHours}h`;
  return `atualizado ha ${Math.round(diffHours / 24)}d`;
}

function KpiCard({ label, value, index, suffix }: { label: string; value: number; index: number; suffix?: string }) {
  const animated = useCountUp(value);

  return (
    <Card className="metric-card reveal space-y-1 p-5 pl-6" style={{ animationDelay: `${index * 70}ms` }}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold tabular-nums text-foreground">
        {animated}
        {suffix ?? ''}
      </p>
    </Card>
  );
}

function MaquinasResumo({ resumo, index }: { resumo: MaquinaStatusResumo[]; index: number }) {
  const total = resumo.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <Card className="reveal space-y-4 p-5" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Maquinario</h2>
        <span className="text-xs text-muted-foreground">{total} no total</span>
      </div>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma maquina cadastrada ainda.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            {resumo.map((item) => (
              <div
                key={item.status}
                className={STATUS_MAQUINA_COLOR[item.status]}
                style={{ width: `${(item.quantidade / total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {resumo.map((item) => (
              <span key={item.status} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${STATUS_MAQUINA_COLOR[item.status]}`} />
                {STATUS_MAQUINA_LABEL[item.status]} · <span className="font-semibold text-foreground">{item.quantidade}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function ClimaCard({ clima, index }: { clima: import('@/types/dashboard').Clima; index: number }) {
  return (
    <Card className="reveal space-y-4 p-5" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Clima</h2>
        {clima?.atual ? (
          <span className="status-chip">
            <span className="pulse-dot" />
            ao vivo
          </span>
        ) : null}
      </div>

      {!clima?.atual ? (
        <p className="text-sm text-muted-foreground">
          Sem previsao no momento. Cadastre a latitude/longitude da fazenda para habilitar o clima.
        </p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums text-foreground">{Math.round(clima.atual.temperaturaAtual ?? 0)}°</span>
            <span className="text-sm text-muted-foreground">{clima.atual.condicao}</span>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Vento {Math.round(clima.atual.velocidadeVentoKmh ?? 0)} km/h</span>
            <span>Chuva {clima.atual.precipitacaoMm ?? 0} mm</span>
          </div>

          {clima.previsao.length > 0 ? (
            <div className="flex gap-2 border-t border-border/70 pt-3">
              {clima.previsao.slice(0, 4).map((dia) => (
                <div key={dia.data} className="flex-1 rounded-lg border border-border/70 bg-background/50 px-2 py-2 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {parseLocalDate(dia.data).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{Math.round(dia.temperaturaMax ?? 0)}°</p>
                  <p className="text-xs text-muted-foreground">{Math.round(dia.temperaturaMin ?? 0)}°</p>
                  <p className="text-[11px] text-primary">{dia.probabilidadeChuva ?? 0}%</p>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}

function AreaCard({ area, index }: { area: AreaProducao; index: number }) {
  return (
    <Card className="reveal space-y-2 p-5" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{area.nome}</h3>
        <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {TIPO_AREA_LABEL[area.tipo]}
        </span>
      </div>
      <p className="text-sm text-foreground/90">{area.ocupacaoDescricao ?? 'Sem ocupacao registrada'}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{area.tamanhoHectares ? `${area.tamanhoHectares} ha` : '—'}</span>
        <span>{formatUpdatedAt(area.atualizadoEm)}</span>
      </div>
    </Card>
  );
}

function AvisoRow({ aviso }: { aviso: Aviso }) {
  const relative = formatRelative(aviso.dataPrevista);
  const atrasado = relative.startsWith('atrasado');

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/50 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{aviso.descricao}</p>
        <p className="text-xs text-muted-foreground">
          {TIPO_AVISO_LABEL[aviso.tipo]}
          {aviso.areaProducaoNome ? ` · ${aviso.areaProducaoNome}` : ''}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${atrasado ? 'bg-danger/15 text-danger' : 'bg-primary/12 text-primary'}`}>
        {relative}
      </span>
    </div>
  );
}

/**
 * Cockpit operacional da fazenda: equipe, maquinario, areas de producao (pasto/talhao/confinamento),
 * avisos de manejo pendentes e clima. Substitui o dashboard generico anterior.
 */
export default function DashboardPage() {
  const { session } = useAuth();
  const { data, loading, source } = useDashboard();

  const nomeUsuario = session?.user?.name ?? 'produtor';

  return (
    <main className="space-y-6">
      <section className="reveal surface flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cockpit da fazenda</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {data ? data.fazendaNome : `Ola, ${nomeUsuario}`}
          </h1>
          <p className="text-sm text-muted-foreground">Visao geral operacional, atualizada automaticamente.</p>
        </div>
        {source === 'mock' ? <span className="status-chip">dados de demonstracao</span> : null}
      </section>

      {loading && !data ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="skeleton h-24" />
          ))}
        </section>
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Funcionarios" value={data.totalFuncionarios} index={0} />
            <KpiCard label="Areas de producao" value={data.areasProducao.length} index={1} />
            <KpiCard label="Avisos pendentes" value={data.avisosPendentes.length} index={2} />
            <KpiCard
              label="Maquinas operacionais"
              value={data.maquinasPorStatus.find((item) => item.status === 'OPERACIONAL')?.quantidade ?? 0}
              index={3}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <MaquinasResumo resumo={data.maquinasPorStatus} index={4} />
            <ClimaCard clima={data.clima} index={5} />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Pasto, talhao e confinamento</h2>
            {data.areasProducao.length === 0 ? (
              <Card className="p-5 text-sm text-muted-foreground">Nenhuma area de producao cadastrada ainda.</Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.areasProducao.map((area, index) => (
                  <AreaCard key={area.id} area={area} index={index} />
                ))}
              </div>
            )}
          </section>

          <section className="reveal surface space-y-3 p-5" style={{ animationDelay: '80ms' }}>
            <h2 className="text-lg font-semibold text-foreground">Avisos de manejo</h2>
            {data.avisosPendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum aviso pendente. Tudo em dia.</p>
            ) : (
              <div className="space-y-2">
                {data.avisosPendentes.map((aviso) => (
                  <AvisoRow key={aviso.id} aviso={aviso} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
