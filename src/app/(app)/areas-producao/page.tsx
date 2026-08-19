'use client';

import { useState } from 'react';

import { Button, Card, Field, Input, Select } from '@/components/ui';

import { useCrudResource } from '@/hooks/useCrudResource';
import { useFazendas } from '@/hooks/useFazendas';
import type { AreaProducao, AreaProducaoRequest } from '@/types/operacao';
import type { TipoAreaProducao } from '@/types/dashboard';

const TIPO_LABEL: Record<TipoAreaProducao, string> = {
  PASTO: 'Pasto',
  TALHAO: 'Talhao',
  CONFINAMENTO: 'Confinamento'
};

const EMPTY_FORM: AreaProducaoRequest = {
  nome: '',
  tipo: 'PASTO',
  tamanhoHectares: null,
  ocupacaoDescricao: '',
  quantidadeAnimais: null,
  culturaAtual: '',
  fazendaId: 0
};

export default function AreasProducaoPage() {
  const { items, loading, error, create, update, remove } = useCrudResource<AreaProducao, AreaProducaoRequest>('/api/areas-producao');
  const { fazendas } = useFazendas();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AreaProducaoRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, fazendaId: fazendas[0]?.id ?? 0 });
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(area: AreaProducao) {
    setEditingId(area.id);
    setForm({
      nome: area.nome,
      tipo: area.tipo,
      tamanhoHectares: area.tamanhoHectares,
      ocupacaoDescricao: area.ocupacaoDescricao,
      quantidadeAnimais: area.quantidadeAnimais,
      culturaAtual: area.culturaAtual,
      fazendaId: area.fazendaId
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

  async function handleDelete(id: number) {
    try {
      await remove(id);
    } catch {
      setFormError('Nao foi possivel remover este registro.');
    }
  }

  return (
    <main className="space-y-6">
      <section className="surface reveal flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Manejo</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pasto, talhao e confinamento</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Cadastre e mantenha atualizada a ocupacao de cada area da fazenda.</p>
        </div>
        <Button onClick={openCreate}>Nova area</Button>
      </section>

      {formOpen ? (
        <Card className="reveal space-y-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">{editingId ? 'Editar area' : 'Nova area de producao'}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Nome">
              <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.currentTarget.value })} placeholder="Pasto 3" />
            </Field>
            <Field label="Tipo">
              <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.currentTarget.value as TipoAreaProducao })}>
                {Object.entries(TIPO_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fazenda">
              <Select
                required
                value={form.fazendaId || ''}
                onChange={(e) => setForm({ ...form, fazendaId: Number(e.currentTarget.value) })}
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
            <Field label="Tamanho (hectares)">
              <Input
                type="number"
                step="0.1"
                value={form.tamanhoHectares ?? ''}
                onChange={(e) => setForm({ ...form, tamanhoHectares: e.currentTarget.value ? Number(e.currentTarget.value) : null })}
              />
            </Field>
            <Field label="Ocupacao atual">
              <Input
                value={form.ocupacaoDescricao ?? ''}
                onChange={(e) => setForm({ ...form, ocupacaoDescricao: e.currentTarget.value })}
                placeholder="180 novilhos - raca mista"
              />
            </Field>
            <Field label="Quantidade de animais">
              <Input
                type="number"
                value={form.quantidadeAnimais ?? ''}
                onChange={(e) => setForm({ ...form, quantidadeAnimais: e.currentTarget.value ? Number(e.currentTarget.value) : null })}
              />
            </Field>
            <Field label="Cultura atual (se talhao)">
              <Input value={form.culturaAtual ?? ''} onChange={(e) => setForm({ ...form, culturaAtual: e.currentTarget.value })} placeholder="Milho" />
            </Field>

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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <div className="skeleton h-32 xl:col-span-3" /> : null}
        {error ? <p className="text-sm text-danger">Erro ao carregar: {error.message}</p> : null}
        {!loading && items.length === 0 ? <Card className="p-5 text-sm text-muted-foreground xl:col-span-3">Nenhuma area cadastrada ainda.</Card> : null}

        {items.map((area) => (
          <Card key={area.id} className="reveal space-y-2 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{area.nome}</h3>
              <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {TIPO_LABEL[area.tipo]}
              </span>
            </div>
            <p className="text-sm text-foreground/90">{area.ocupacaoDescricao ?? 'Sem ocupacao registrada'}</p>
            <p className="text-xs text-muted-foreground">{area.tamanhoHectares ? `${area.tamanhoHectares} ha` : '—'} · {area.fazendaNome}</p>
            <div className="flex gap-2 pt-1">
              <Button variant="secondary" onClick={() => openEdit(area)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(area.id)}>
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
