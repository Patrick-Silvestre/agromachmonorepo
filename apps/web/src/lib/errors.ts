import axios, { type AxiosError } from 'axios';

import type { ApiError } from '@/types/api';

// Extrai uma mensagem legivel de diferentes formatos de payload de erro.
function readMessage(details: unknown): string {
  if (typeof details === 'string' && details.trim()) {
    return details;
  }

  if (details && typeof details === 'object' && 'message' in details) {
    const maybeMessage = (details as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return 'Erro inesperado ao comunicar com o backend.';
}

/**
 * Normaliza qualquer falha (Axios, Error nativo ou desconhecida)
 * para um contrato unico que a interface consegue exibir.
 */
export function createApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const detailsMessage = readMessage(axiosError.response?.data);

    let message = detailsMessage;

    if (status && statusText) {
      message = `${message} (HTTP ${status} ${statusText})`;
    } else if (status) {
      message = `${message} (HTTP ${status})`;
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    return {
      message,
      status,
      details: axiosError.response?.data
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message
    };
  }

  return {
    message: 'Erro desconhecido.'
  };
}
