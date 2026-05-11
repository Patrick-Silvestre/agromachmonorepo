'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Card } from '@nex-rural/ui';

import { BackendStatusCard } from '@/components/backend/backend-status-card';
import { useAuth } from '@/hooks/useAuth';

/**
 * Tela privada de diagnostico.
 * Serve para validar conectividade da aplicacao com endpoints reais do backend.
 */
export default function BackendCheckPage() {
  const router = useRouter();
  const { canAccess } = useAuth();
  const allowed = canAccess('backend');

  useEffect(() => {
    // Se perfil nao possui modulo "backend", volta para dashboard.
    if (!allowed) {
      router.replace('/dashboard');
    }
  }, [allowed, router]);

  if (!allowed) {
    return null;
  }

  return (
    <main className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Diagnostico de integracao</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Valide os endpoints reais configurados no ambiente atual e confira status HTTP, payload e resposta de autenticacao.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1.1fr]">
        <BackendStatusCard />

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-foreground">Boas praticas</h2>
          <p className="text-sm text-muted-foreground">Use esta tela para validar conectividade sem depender de logs externos.</p>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">Confirme base URL e paths no arquivo .env.local.</li>
            <li className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">Se houver 401/403, valide token e permissoes de backend.</li>
            <li className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">Use recarregar apos qualquer ajuste de credencial.</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
