'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AppNavigation } from '@/components/layout/app-navigation';
import { useAuth } from '@/hooks/useAuth';
import { NAV_MODULE_ORDER } from '@/lib/access-control';

/**
 * Layout das rotas privadas.
 * So renderiza o painel quando existe sessao valida.
 */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, allowedModules, session } = useAuth();

  useEffect(() => {
    // Bloqueia acesso direto por URL quando usuario nao esta logado.
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    // Estado de transicao enquanto o contexto restaura sessao do localStorage.
    return (
      <div className="app-shell">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-4">
          <div className="surface px-6 py-5 text-sm text-muted-foreground">Validando sessao...</div>
        </div>
      </div>
    );
  }

  const moduleMap = new Map(allowedModules.map((module) => [module.key, module]));
  const topLinks = NAV_MODULE_ORDER.map((moduleKey) => moduleMap.get(moduleKey))
    .filter((module): module is (typeof allowedModules)[number] => Boolean(module))
    .slice(0, 5);
  const userLabel = session?.user?.name ?? session?.user?.email ?? 'Usuario';
  const userInitial = userLabel.slice(0, 1).toUpperCase();

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground">N</span>
              nex-rural
            </Link>

            <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground xl:flex">
              {topLinks.map((module) => (
                <Link key={module.path} href={module.path} className="rounded-md px-2 py-1 transition hover:bg-muted/55 hover:text-foreground">
                  {module.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground md:inline">
              Rota atual: {pathname}
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {userInitial}
            </span>
          </div>
        </div>
      </header>

      <div className="app-container">
        <AppNavigation />
        <section className="min-h-[calc(100vh-110px)]">{children}</section>
      </div>
    </div>
  );
}
