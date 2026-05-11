/**
 * Contrato padrao de erro retornado para a UI.
 * Use este tipo sempre que um hook/componente precisar exibir falha de API.
 */
export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};
