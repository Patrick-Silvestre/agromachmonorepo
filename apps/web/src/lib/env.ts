const HTTP_METHOD_PREFIX = /^(?:\/)?(?:GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+/i;

/**
 * Normaliza um path de endpoint para garantir formato seguro.
 * Exemplo: "GET /api/usuarios" vira "/api/usuarios".
 */
function normalizeStatusPath(rawPath: string, variableName: string) {
  const trimmed = rawPath.trim();

  if (!trimmed) {
    throw new Error(`[env] ${variableName} contains an empty path`);
  }

  const withoutMethod = trimmed.replace(HTTP_METHOD_PREFIX, '');
  const normalized = withoutMethod.startsWith('/') ? withoutMethod : `/${withoutMethod}`;

  if (normalized.includes(' ')) {
    throw new Error(`[env] ${variableName} must contain only endpoint paths, for example "/api/usuarios"`);
  }

  return normalized;
}

/**
 * Converte lista de endpoints em string para array unico.
 * Aceita separacao por quebra de linha, virgula ou ponto e virgula.
 */
function parseStatusPaths(value: string, variableName: string) {
  const parsed = value
    .split(/[\n,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => normalizeStatusPath(part, variableName));

  return Array.from(new Set(parsed));
}

/**
 * Le a base URL publica usada pelo Axios no browser.
 * Sem esta variavel a aplicacao nao consegue chamar o backend.
 */
export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (!value || !value.trim()) {
    throw new Error('[env] Missing required variable: NEXT_PUBLIC_API_URL');
  }

  return value;
}

/**
 * Resolve um endpoint de teste principal para a tela backend-check.
 * Mantem compatibilidade com nomes legados durante migracao.
 */
export function getStatusPath(): string {
  const statusPath = process.env.NEXT_PUBLIC_STATUS_PATH;
  const legacyStatusPath = process.env.NEXT_PUBLIC_STATUS_;
  const statusPaths = process.env.NEXT_PUBLIC_STATUS_PATHS;

  if (statusPath && statusPath.trim()) {
    return normalizeStatusPath(statusPath, 'NEXT_PUBLIC_STATUS_PATH');
  }

  if (legacyStatusPath && legacyStatusPath.trim()) {
    return normalizeStatusPath(legacyStatusPath, 'NEXT_PUBLIC_STATUS_');
  }

  if (statusPaths && statusPaths.trim()) {
    const paths = parseStatusPaths(statusPaths, 'NEXT_PUBLIC_STATUS_PATHS');
    const firstPath = paths.at(0);
    if (firstPath) {
      return firstPath;
    }
  }

  throw new Error('[env] Missing required variable: NEXT_PUBLIC_STATUS_PATH (or NEXT_PUBLIC_STATUS_PATHS)');
}

/**
 * Retorna todos os endpoints configurados para diagnostico.
 * Quando a lista nao existe, reaproveita o endpoint unico.
 */
export function getStatusPaths(): string[] {
  const statusPaths = process.env.NEXT_PUBLIC_STATUS_PATHS;

  if (!statusPaths || !statusPaths.trim()) {
    return [getStatusPath()];
  }

  const parsed = parseStatusPaths(statusPaths, 'NEXT_PUBLIC_STATUS_PATHS');

  if (parsed.length === 0) {
    throw new Error('[env] NEXT_PUBLIC_STATUS_PATHS does not contain valid paths');
  }

  return parsed;
}
