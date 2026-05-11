/**
 * Representa o usuario autenticado.
 * Campos extras sao aceitos para acompanhar variacoes do backend sem quebrar o frontend.
 */
export type User = {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
  [key: string]: unknown;
};
