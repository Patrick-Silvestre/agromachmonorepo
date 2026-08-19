'use client';

import { useMemo, useState } from 'react';

import { Button, Card, Field, Input, Select } from '@/components/ui';

import { useCrudResource } from '@/hooks/useCrudResource';
import { useFazendas } from '@/hooks/useFazendas';
import type { AreaProducao, Aviso, AvisoRequest } from '@/types/operacao';
import type { TipoAviso } from '@/types/dashboard';

const TIPO_LABEL: Record<TipoAviso, string> = {
  FERTILIZACAO: 'Fertilizacao',
  PREPARO_SOLO: 'Preparo de solo',
  VACINACAO: 'Vacinacao',
  OUTRO: 'Outro'
};

const EMPTY_FORM: AvisoRequest = {
  tipo: 'VACINACAO',
  descricao: '',
  dataPrevista: '',
  concluido: false,
  fazendaId: 0,
  areaProducaoId: null
};

export default function AvisosPage() {
  const { items, loading, error, create, update, remove } = useCrudResource<Aviso, AvisoRequest>('/api/avisos');
  const { items: areas } = useCrudResource<AreaProducao, unknown>('/api/areas-producao');
  const { fazendas } = useFazendas();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AvisoRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const areasDaFazenda = useMemo(() => areas.filter((area) => area.fazendaId === form.fazendaId), [areas, form.fazendaId]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, fazendaId: fazendas[0]?.id ?? 0 });
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(aviso: Aviso) {
    setEditingId(aviso.id);
    setForm({
      tipo: aviso.tipo,
      descricao: aviso.descricao,
      dataPrevista: aviso.dataPrevista,
      concluido: aviso.concluido,
      fazendaId: aviso.fazendaId,
      areaProducaoId: aviso.areaProducaoId
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.fazendaId) {
      setFormError('Selecione uma fazenda.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        await update(editingId, form);
      } else {
        await create(form);
      }
      setFormOpen(false);
    } catch {
      setFormError('Nao foi possivel salvar. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="surface reveal flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Manejo</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Avisos</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Fertilizacao, preparo de solo e vacinacao - lembretes por fazenda e area.</p>
        </div>
        <Button onClick={openCreate}>Novo aviso</Button>
      </section>

      {formOpen ? (
        <Card className="reveal space-y-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">{editingId ? 'Editar aviso' : 'Novo aviso'}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Tipo">
              <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.currentTarget.value as TipoAviso })}>
                {Object.entries(TIPO_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Data prevista">
              <Input
                type="date"
                required
                value={form.dataPrevista}
                onChange={(e) => setForm({ ...form, dataPrevista: e.currentTarget.value })}
              />
            </Field>
            <Field label="Fazenda">
              <Select
                required
                value={form.fazendaId || ''}
                onChange={(e) => setForm({ ...form, fazendaId: Number(e.currentTarget.value), areaProducaoId: null })}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {fazendas.map((fazenda) => (
                  <option key={fazenda.id} value={fazenda.id}>
                    {fazenda.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Area (opcional)">
              <Select
                value={form.areaProducaoId ?? ''}
                onChange={(e) => setForm({ ...form, areaProducaoId: e.currentTarget.value ? Number(e.currentTarget.value) : null })}
              >
                <option value="">Nenhuma area especifica</option>
                {areasDaFazenda.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Descricao">
              <Input
                required
                className="sm:col-span-2"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.currentTarget.value })}
                placeholder="Vacinacao febre aftosa - lote Pasto 3"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.concluido}
                onChange={(e) => setForm({ ...form, concluido: e.currentTarget.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Ja concluido
            </label>

            {formError ? <p className="sm:col-span-2 text-sm text-danger">{formError}</p> : null}

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <section className="space-y-2">
        {loading ? <div className="skeleton h-24" /> : null}
        {error ? <p className="text-sm text-danger">Erro ao carregar: {error.message}</p> : null}
        {!loading && items.length === 0 ? <Card className="p-5 text-sm text-muted-foreground">Nenhum aviso cadastrado ainda.</Card> : null}

        {items.map((aviso) => (
          <Card key={aviso.id} className="reveal flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{aviso.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {TIPO_LABEL[aviso.tipo]} · {aviso.dataPrevista}
                {aviso.areaProducaoNome ? ` · ${aviso.areaProducaoNome}` : ''}
                {aviso.concluido ? ' · concluido' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => openEdit(aviso)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => remove(aviso.id)}>
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
