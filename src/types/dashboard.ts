export type StatusMaquina = 'OPERACIONAL' | 'MANUTENCAO' | 'QUEBRADA';
export type TipoAreaProducao = 'PASTO' | 'TALHAO' | 'CONFINAMENTO';
export type TipoAviso = 'FERTILIZACAO' | 'PREPARO_SOLO' | 'VACINACAO' | 'OUTRO';

export type MaquinaStatusResumo = {
  status: StatusMaquina;
  quantidade: number;
};

export type AreaProducao = {
  id: number;
  nome: string;
  tipo: TipoAreaProducao;
  tamanhoHectares: number | null;
  ocupacaoDescricao: string | null;
  quantidadeAnimais: number | null;
  culturaAtual: string | null;
  atualizadoEm: string | null;
  fazendaId: number;
  fazendaNome: string;
};

export type Aviso = {
  id: number;
  tipo: TipoAviso;
  descricao: string;
  dataPrevista: string;
  concluido: boolean;
  fazendaId: number;
  areaProducaoId: number | null;
  areaProducaoNome: string | null;
};

export type ClimaAtual = {
  temperaturaAtual: number | null;
  precipitacaoMm: number | null;
  velocidadeVentoKmh: number | null;
  condicao: string;
};

export type PrevisaoDia = {
  data: string;
  temperaturaMax: number | null;
  temperaturaMin: number | null;
  probabilidadeChuva: number | null;
};

export type Clima = {
  atual: ClimaAtual | null;
  previsao: PrevisaoDia[];
} | null;

export type DashboardResponse = {
  fazendaId: number;
  fazendaNome: string;
  totalFuncionarios: number;
  maquinasPorStatus: MaquinaStatusResumo[];
  areasProducao: AreaProducao[];
  avisosPendentes: Aviso[];
  clima: Clima;
};
