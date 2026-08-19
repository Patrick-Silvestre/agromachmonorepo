import type { ModuleKey } from './access-control';

type MockRow = Record<string, string | number | boolean | null>;

/**
 * Dados locais usados como "modo demonstracao".
 *
 * Por que existe:
 * - o frontend continua apresentavel mesmo quando a API REST ainda nao esta pronta;
 * - as telas privadas mostram colunas reais de negocio, em vez de ficarem vazias;
 * - quando a API responder com dados, estes mocks deixam de ser usados automaticamente.
 */
const moduleMocks: Partial<Record<ModuleKey, MockRow[]>> = {
  usuarios: [
    {
      id: 1,
      nome: 'Ana Ribeiro',
      email: 'ana@nexrural.com',
      role: 'ADMIN',
      status: 'Ativo'
    },
    {
      id: 2,
      nome: 'Carlos Mendes',
      email: 'carlos@fazendaverde.com',
      role: 'PRODUTOR',
      status: 'Ativo'
    }
  ],
  fazendas: [
    {
      id: 12,
      nome: 'Fazenda Santa Luzia',
      cidade: 'Ribeirao Preto',
      hectares: 480,
      status: 'Operando'
    },
    {
      id: 18,
      nome: 'Sitio Bela Vista',
      cidade: 'Franca',
      hectares: 96,
      status: 'Em cadastro'
    }
  ],
  maquinas: [
    {
      id: 301,
      modelo: 'Trator 4x4 120cv',
      disponibilidade: 'Disponivel',
      diaria: 'R$ 780,00',
      localizacao: 'SP'
    },
    {
      id: 302,
      modelo: 'Colheitadeira axial',
      disponibilidade: 'Reservada',
      diaria: 'R$ 2.450,00',
      localizacao: 'MG'
    }
  ],
  funcionarios: [
    {
      id: 41,
      nome: 'Marina Alves',
      cargo: 'Operadora de maquinas',
      turno: 'Manha',
      status: 'Ativa'
    },
    {
      id: 42,
      nome: 'Joao Pereira',
      cargo: 'Tecnico de manutencao',
      turno: 'Integral',
      status: 'Em campo'
    }
  ]
};

/**
 * Retorna exemplos do modulo solicitado.
 * A copia com spread impede que uma tabela altere o objeto original por acidente.
 */
export function getMockRowsForModule(moduleKey?: ModuleKey) {
  if (!moduleKey) {
    return [];
  }

  return (moduleMocks[moduleKey] ?? []).map((row) => ({ ...row }));
}
