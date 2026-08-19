import type { DashboardResponse } from '@/types/dashboard';

/**
 * Dashboard de demonstracao usado quando a API real ainda nao responde.
 * Mesma logica de "modo demonstracao" ja usada nas telas de modulo (ver mock-content.ts).
 */
export const MOCK_DASHBOARD: DashboardResponse = {
  fazendaId: 12,
  fazendaNome: 'Fazenda Santa Luzia',
  totalFuncionarios: 8,
  maquinasPorStatus: [
    { status: 'OPERACIONAL', quantidade: 5 },
    { status: 'MANUTENCAO', quantidade: 2 },
    { status: 'QUEBRADA', quantidade: 1 }
  ],
  areasProducao: [
    {
      id: 1,
      nome: 'Pasto 3',
      tipo: 'PASTO',
      tamanhoHectares: 42,
      ocupacaoDescricao: '180 novilhos - raca mista',
      quantidadeAnimais: 180,
      culturaAtual: null,
      atualizadoEm: '2026-07-20T08:00:00',
      fazendaId: 12,
      fazendaNome: 'Fazenda Santa Luzia'
    },
    {
      id: 2,
      nome: 'Talhao Norte',
      tipo: 'TALHAO',
      tamanhoHectares: 65,
      ocupacaoDescricao: 'Milho - fase vegetativa',
      quantidadeAnimais: null,
      culturaAtual: 'Milho',
      atualizadoEm: '2026-07-19T17:30:00',
      fazendaId: 12,
      fazendaNome: 'Fazenda Santa Luzia'
    },
    {
      id: 3,
      nome: 'Confinamento 1',
      tipo: 'CONFINAMENTO',
      tamanhoHectares: 3,
      ocupacaoDescricao: '60 bois em terminacao',
      quantidadeAnimais: 60,
      culturaAtual: null,
      atualizadoEm: '2026-07-21T06:15:00',
      fazendaId: 12,
      fazendaNome: 'Fazenda Santa Luzia'
    }
  ],
  avisosPendentes: [
    {
      id: 1,
      tipo: 'VACINACAO',
      descricao: 'Vacinacao febre aftosa - lote Pasto 3',
      dataPrevista: '2026-07-28',
      concluido: false,
      fazendaId: 12,
      areaProducaoId: 1,
      areaProducaoNome: 'Pasto 3'
    },
    {
      id: 2,
      tipo: 'FERTILIZACAO',
      descricao: 'Adubacao de cobertura',
      dataPrevista: '2026-08-02',
      concluido: false,
      fazendaId: 12,
      areaProducaoId: 2,
      areaProducaoNome: 'Talhao Norte'
    },
    {
      id: 3,
      tipo: 'PREPARO_SOLO',
      descricao: 'Preparo de solo para plantio de soja',
      dataPrevista: '2026-07-22',
      concluido: false,
      fazendaId: 12,
      areaProducaoId: null,
      areaProducaoNome: null
    }
  ],
  clima: {
    atual: {
      temperaturaAtual: 27.4,
      precipitacaoMm: 0,
      velocidadeVentoKmh: 11.2,
      condicao: 'Parcialmente nublado'
    },
    previsao: [
      { data: '2026-07-25', temperaturaMax: 29, temperaturaMin: 17, probabilidadeChuva: 10 },
      { data: '2026-07-26', temperaturaMax: 28, temperaturaMin: 16, probabilidadeChuva: 20 },
      { data: '2026-07-27', temperaturaMax: 26, temperaturaMin: 15, probabilidadeChuva: 55 }
    ]
  }
};
