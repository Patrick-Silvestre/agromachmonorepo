'use client';

import { useEffect, useState } from 'react';

import { api } from '@/services/api';
import type { Fazenda } from '@/types/operacao';

/**
 * Lista as fazendas visiveis para o usuario logado - usado nos seletores dos
 * formularios de Area de Producao e Aviso (cada registro pertence a uma fazenda).
 */
export function useFazendas() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get<Fazenda[]>('/api/fazendas')
      .then(({ data }) => {
        if (active) setFazendas(data);
      })
      .catch(() => {
        if (active) setFazendas([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { fazendas, loading };
}
