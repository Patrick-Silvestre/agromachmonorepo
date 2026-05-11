/**
 * Chaves oficiais dos modulos que podem existir no menu/telas privadas.
 * Cada chave conecta rota, endpoint e permissao de acesso.
 */
export type ModuleKey =
  | 'dashboard'
  | 'backend'
  | 'usuarios'
  | 'fazendas'
  | 'maquinas'
  | 'funcionarios'
  | 'produtos'
  | 'pedidos'
  | 'postagens';

export type ModuleDefinition = {
  key: ModuleKey;
  title: string;
  path: string;
  endpoint: string;
  // Descricao curta exibida em dashboard e cards.
  description: string;
};

// Catalogo central da aplicacao privada.
const ALL_MODULES: ModuleDefinition[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    endpoint: '/api/dashboard',
    description: 'Resumo operacional da plataforma.'
  },
  {
    key: 'backend',
    title: 'Integracao API',
    path: '/backend-check',
    endpoint: '/api/health',
    description: 'Diagnostico de conectividade e resposta da API.'
  },
  {
    key: 'usuarios',
    title: 'Usuarios',
    path: '/usuarios',
    endpoint: '/api/usuarios',
    description: 'Gestao de contas, papeis e acessos.'
  },
  {
    key: 'fazendas',
    title: 'Fazendas',
    path: '/fazendas',
    endpoint: '/api/fazendas',
    description: 'Cadastro e operacao de propriedades.'
  },
  {
    key: 'maquinas',
    title: 'Maquinas',
    path: '/maquinas',
    endpoint: '/api/maquinas',
    description: 'Gestao de maquinario e manutencao.'
  },
  {
    key: 'funcionarios',
    title: 'Funcionarios',
    path: '/funcionarios',
    endpoint: '/api/funcionarios',
    description: 'Equipe, escala e produtividade.'
  },
  {
    key: 'produtos',
    title: 'Produtos',
    path: '/produtos',
    endpoint: '/api/produtos',
    description: 'Catalogo comercial e disponibilidade.'
  },
  {
    key: 'pedidos',
    title: 'Pedidos',
    path: '/pedidos',
    endpoint: '/api/pedidos',
    description: 'Fluxo de pedidos e acompanhamento.'
  },
  {
    key: 'postagens',
    title: 'Postagens',
    path: '/postagens',
    endpoint: '/api/postagens',
    description: 'Conteudo e comunicacao com a rede.'
  }
];

/**
 * Matriz de permissao por papel.
 * Importante: rotas nao permitidas nao devem ser renderizadas no menu.
 */
const ROLE_PERMISSIONS: Record<string, ModuleKey[] | ['*']> = {
  ADMIN: ['*'],
  ROLE_ADMIN: ['*'],
  ADMINISTRADOR: ['*'],
  ROLE_ADMINISTRADOR: ['*'],
  GESTOR: ['*'],
  ROLE_GESTOR: ['*'],
  GERENTE: ['*'],
  ROLE_GERENTE: ['*'],
  PRODUTOR: ['dashboard', 'fazendas', 'maquinas', 'produtos', 'pedidos', 'postagens'],
  ROLE_PRODUTOR: ['dashboard', 'fazendas', 'maquinas', 'produtos', 'pedidos', 'postagens'],
  OPERADOR: ['dashboard', 'maquinas', 'funcionarios', 'pedidos'],
  ROLE_OPERADOR: ['dashboard', 'maquinas', 'funcionarios', 'pedidos'],
  FUNCIONARIO: ['dashboard', 'maquinas', 'funcionarios', 'pedidos'],
  ROLE_FUNCIONARIO: ['dashboard', 'maquinas', 'funcionarios', 'pedidos'],
  COMERCIAL: ['dashboard', 'produtos', 'pedidos', 'postagens'],
  ROLE_COMERCIAL: ['dashboard', 'produtos', 'pedidos', 'postagens'],
  PRESTADOR: ['dashboard', 'maquinas', 'pedidos', 'postagens'],
  ROLE_PRESTADOR: ['dashboard', 'maquinas', 'pedidos', 'postagens'],
  USER: ['dashboard', 'fazendas', 'maquinas', 'produtos', 'pedidos', 'postagens', 'backend'],
  ROLE_USER: ['dashboard', 'fazendas', 'maquinas', 'produtos', 'pedidos', 'postagens', 'backend']
};

const DEFAULT_PERMISSION: ModuleKey[] = ['dashboard'];

// Padrao unico para comparar papeis vindos do backend.
export function normalizeRole(role: string) {
  return role.trim().toUpperCase();
}

/**
 * Calcula todas as chaves de modulo liberadas para um conjunto de papeis.
 * Se nenhum papel conhecido existir, libera apenas dashboard.
 */
export function getAllowedModuleKeys(roles: string[]) {
  const normalizedRoles = roles.map(normalizeRole);
  const granted = new Set<ModuleKey>();

  for (const role of normalizedRoles) {
    const permissions = ROLE_PERMISSIONS[role];

    if (!permissions) {
      continue;
    }

    if (permissions.length === 1 && permissions[0] === '*') {
      return ALL_MODULES.map((module) => module.key);
    }

    for (const permission of permissions) {
      if (permission !== '*') {
        granted.add(permission);
      }
    }
  }

  if (granted.size === 0) {
    for (const permission of DEFAULT_PERMISSION) {
      granted.add(permission);
    }
  }

  return Array.from(granted);
}

// Validador util para pagina/componente proteger acesso.
export function canAccessModule(roles: string[], moduleKey: ModuleKey) {
  return getAllowedModuleKeys(roles).includes(moduleKey);
}

// Filtra o catalogo completo pelos modulos permitidos.
export function getAllowedModules(roles: string[]) {
  const allowedKeys = new Set(getAllowedModuleKeys(roles));
  return ALL_MODULES.filter((module) => allowedKeys.has(module.key));
}

// Busca definicao de modulo por chave.
export function getModuleByKey(moduleKey: ModuleKey) {
  return ALL_MODULES.find((module) => module.key === moduleKey);
}

// Ordem visual da navegacao lateral e barra superior.
export const NAV_MODULE_ORDER: ModuleKey[] = [
  'dashboard',
  'usuarios',
  'fazendas',
  'maquinas',
  'funcionarios',
  'produtos',
  'pedidos',
  'postagens',
  'backend'
];

// Remove prefixo tecnico ROLE_ para exibicao amigavel.
export function formatRoleLabel(role: string) {
  return normalizeRole(role).replace('ROLE_', '');
}
