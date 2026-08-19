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
  | 'areas-producao'
  | 'avisos'
  | 'profissionais';

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
    description: 'Cockpit operacional da fazenda.'
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
    key: 'areas-producao',
    title: 'Pasto e talhao',
    path: '/areas-producao',
    endpoint: '/api/areas-producao',
    description: 'Ocupacao de pasto, talhao e confinamento.'
  },
  {
    key: 'avisos',
    title: 'Avisos',
    path: '/avisos',
    endpoint: '/api/avisos',
    description: 'Fertilizacao, preparo de solo e vacinacao.'
  },
  {
    key: 'profissionais',
    title: 'Profissionais',
    path: '/profissionais',
    endpoint: '/api/profissionais',
    description: 'Veterinarios, agronomos e fornecedores.'
  }
];

/**
 * Matriz de permissao por papel.
 * O backend so emite CLIENTE, PRESTADOR ou ADMIN (ver com.agromach.entity.Role) - mantemos so essas chaves,
 * com o prefixo ROLE_ que o Spring Security usa em algumas respostas/claims.
 */
const ROLE_PERMISSIONS: Record<string, ModuleKey[] | ['*']> = {
  ADMIN: ['*'],
  ROLE_ADMIN: ['*'],
  CLIENTE: ['dashboard', 'fazendas', 'maquinas', 'funcionarios', 'areas-producao', 'avisos', 'profissionais', 'backend'],
  ROLE_CLIENTE: ['dashboard', 'fazendas', 'maquinas', 'funcionarios', 'areas-producao', 'avisos', 'profissionais', 'backend'],
  PRESTADOR: ['dashboard', 'areas-producao', 'avisos', 'profissionais'],
  ROLE_PRESTADOR: ['dashboard', 'areas-producao', 'avisos', 'profissionais']
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
  'areas-producao',
  'avisos',
  'profissionais',
  'fazendas',
  'maquinas',
  'funcionarios',
  'usuarios',
  'backend'
];

// Remove prefixo tecnico ROLE_ para exibicao amigavel.
export function formatRoleLabel(role: string) {
  return normalizeRole(role).replace('ROLE_', '');
}
