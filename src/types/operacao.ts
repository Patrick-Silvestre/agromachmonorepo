import type { AreaProducao, Aviso, TipoAreaProducao, TipoAviso } from './dashboard';

export type AreaProducaoRequest = {
  nome: string;
  tipo: TipoAreaProducao;
  tamanhoHectares: number | null;
  ocupacaoDescricao: string | null;
  quantidadeAnimais: number | null;
  culturaAtual: string | null;
  fazendaId: number;
};

export type AvisoRequest = {
  tipo: TipoAviso;
  descricao: string;
  dataPrevista: string;
  concluido: boolean;
  fazendaId: number;
  areaProducaoId: number | null;
};

export type TipoProfissional = 'VETERINARIO' | 'AGRONOMO' | 'FORNECEDOR_INSUMO' | 'FORNECEDOR_GADO' | 'TRABALHADOR_CAMPO' | 'OUTRO';

export type Profissional = {
  id: number;
  nome: string;
  tipo: TipoProfissional;
  telefone: string;
  descricao: string | null;
  rastreabilidade: boolean;
  cidadeRegiao: string | null;
  cadastradoPorId: number;
  cadastradoPorNome: string;
};

export type ProfissionalRequest = {
  nome: string;
  tipo: TipoProfissional;
  telefone: string;
  descricao: string | null;
  rastreabilidade: boolean;
  cidadeRegiao: string | null;
};

export type Fazenda = {
  id: number;
  nome: string;
  localizacao: string;
  tamanhoHectares: number;
  tipoProducao: string;
  latitude: number | null;
  longitude: number | null;
  proprietarioId: number;
  proprietarioNome: string;
};

export type { AreaProducao, Aviso };
