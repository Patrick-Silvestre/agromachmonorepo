'use client';

import { useState } from 'react';

import { Button, Card, Field, Input, Select } from '@/components/ui';

import { useCrudResource } from '@/hooks/useCrudResource';
import type { Profissional, ProfissionalRequest, TipoProfissional } from '@/types/operacao';

const TIPO_LABEL: Record<TipoProfissional, string> = {
  VETERINARIO: 'Veterinario',
  AGRONOMO: 'Agronomo',
  FORNECEDOR_INSUMO: 'Fornecedor de insumo/semente',
  FORNECEDOR_GADO: 'Fornecedor de gado',
  TRABALHADOR_CAMPO: 'Trabalhador de campo',
  OUTRO: 'Outro'
};

const EMPTY_FORM: ProfissionalRequest = {
  nome: '',
  tipo: 'VETERINARIO',
  telefone: '',
  descricao: '',
  rastreabilidade: false,
  cidadeRegiao: ''
};

function whatsappLink(telefone: string) {
  const digits = telefone.replace(/\D/g, '');
  return digits ? `https://wa.me/55${digits}` : undefined;
}

export default function ProfissionaisPage() {
  const { items, loading, error, create, update, remove } = useCrudResource<Profissional, ProfissionalRequest>('/api/profissionais');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProfissionalRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(profissional: Profissional) {
    setEditingId(profissional.id);
    setForm({
      nome: profissional.nome,
      tipo: profissional.tipo,
      telefone: profissional.telefone,
      descricao: profissional.descricao,
      rastreabilidade: profissional.rastreabilidade,
      cidadeRegiao: profissional.cidadeRegiao
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Rede de contatos</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profissionais e fornecedores</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Veterinarios, agronomos, fornecedores de insumo/semente e de gado, trabalhadores de campo. Diretorio de contato - sem pedido ou checkout.
          </p>
        </div>
        <Button onClick={openCreate}>Adicionar contato</Button>
      </section>

      {formOpen ? (
        <Card className="reveal space-y-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">{editingId ? 'Editar contato' : 'Novo contato'}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Nome">
              <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.currentTarget.value })} placeholder="Dr. Carlos Souza" />
            </Field>
            <Field label="Tipo">
              <Select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.currentTarget.value as TipoProfissional })}>
                {Object.entries(TIPO_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Telefone / WhatsApp">
              <Input
                required
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.currentTarget.value })}
                placeholder="17999999999"
              />
            </Field>
            <Field label="Cidade / regiao">
              <Input
                value={form.cidadeRegiao ?? ''}
                onChange={(e) => setForm({ ...form, cidadeRegiao: e.currentTarget.value })}
                placeholder="Estrela d'Oeste - SP"
              />
            </Field>
            <Field label="Descricao">
              <Input
                className="sm:col-span-2"
                value={form.descricao ?? ''}
                onChange={(e) => setForm({ ...form, descricao: e.currentTarget.value })}
                placeholder="Especialista em bovinos de corte"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.rastreabilidade}
                onChange={(e) => setForm({ ...form, rastreabilidade: e.currentTarget.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Oferece rastreabilidade (relevante para fornecedor de gado)
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <div className="skeleton h-32 xl:col-span-3" /> : null}
        {error ? <p className="text-sm text-danger">Erro ao carregar: {error.message}</p> : null}
        {!loading && items.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground xl:col-span-3">Nenhum profissional cadastrado ainda.</Card>
        ) : null}

        {items.map((profissional) => (
          <Card key={profissional.id} className="reveal space-y-2 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{profissional.nome}</h3>
              <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {TIPO_LABEL[profissional.tipo]}
              </span>
            </div>
            {profissional.descricao ? <p className="text-sm text-foreground/90">{profissional.descricao}</p> : null}
            <p className="text-xs text-muted-foreground">
              {profissional.cidadeRegiao ?? 'Regiao nao informada'}
              {profissional.rastreabilidade ? ' · com rastreabilidade' : ''}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a href={whatsappLink(profissional.telefone)} target="_blank" rel="noreferrer">
                <Button variant="secondary">Chamar no WhatsApp</Button>
              </a>
              <Button variant="ghost" onClick={() => openEdit(profissional)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => remove(profissional.id)}>
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
