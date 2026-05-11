import type { ModuleKey } from './access-control';

// Estrutura usada para preencher tabela em modulos sem resposta de backend.
type MockRow = Record<string, string | number | boolean | null>;

/**
 * Conteudo de apoio para navegacao.
 * Regra do projeto: esses dados devem desaparecer quando API real responder.
 */
const moduleMocks: Partial<Record<ModuleKey, MockRow[]>> = {
  pedidos: [
    {
      id: 1023,
      cliente: 'Fazenda Santa Luzia',
      status: 'Em separacao',
      total: 'R$ 12.480,00',
      dataCriacao: '2026-02-21'
    },
    {
      id: 1024,
      cliente: 'Cooperativa Vale Verde',
      status: 'Faturado',
      total: 'R$ 8.990,00',
      dataCriacao: '2026-02-22'
    },
    {
      id: 1025,
      cliente: 'Sitio Bela Vista',
      status: 'Aguardando pagamento',
      total: 'R$ 2.140,00',
      dataCriacao: '2026-02-23'
    }
  ],
  postagens: [
    {
      id: 701,
      titulo: 'Checklist de pre-safra',
      autor: 'Equipe Tecnica',
      categoria: 'Operacao',
      publicadoEm: '2026-02-20'
    },
    {
      id: 702,
      titulo: 'Boletim semanal de manutencao',
      autor: 'Gestao de Campo',
      categoria: 'Maquinario',
      publicadoEm: '2026-02-21'
    },
    {
      id: 703,
      titulo: 'Planejamento de irrigacao',
      autor: 'Agronomia',
      categoria: 'Producao',
      publicadoEm: '2026-02-22'
    }
  ]
};

// Retorna linhas mock somente para modulos que tem fallback definido.
export function getMockRowsForModule(moduleKey: ModuleKey) {
  return moduleMocks[moduleKey] ?? [];
}
