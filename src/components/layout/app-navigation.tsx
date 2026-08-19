'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button, cn } from '@/components/ui';

import { formatRoleLabel, NAV_MODULE_ORDER, getModuleByKey, type ModuleKey } from '@/lib/access-control';
import { useAuth } from '@/hooks/useAuth';

// Siglas para facilitar identificacao visual de cada modulo no menu.
const moduleGlyph: Partial<Record<ModuleKey, string>> = {
  dashboard: 'D',
  usuarios: 'U',
  fazendas: 'F',
  maquinas: 'M',
  funcionarios: 'E',
  'areas-producao': 'A',
  avisos: 'V',
  profissionais: 'P',
  backend: 'API'
};

// Componente de item de menu com destaque da rota ativa.
function LinkItem({ href, label, active, glyph }: { href: string; label: string; active: boolean; glyph: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
        active ? 'bg-primary/14 text-primary' : 'text-foreground hover:bg-muted/70'
      )}
    >
      <span
        className={cn(
          'inline-flex h-6 min-w-6 items-center justify-center rounded-md border text-[10px] font-bold',
          active ? 'border-primary/35 bg-primary/15 text-primary' : 'border-border bg-card text-muted-foreground'
        )}
      >
        {glyph}
      </span>
      {label}
    </Link>
  );
}

/**
 * Navegacao lateral da area privada.
 * Funcao principal: mostrar somente os modulos permitidos para o perfil logado.
 */
export function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { allowedModules, session, logout } = useAuth();

  const allowedMap = new Map(allowedModules.map((module) => [module.key, module]));
  const modules = NAV_MODULE_ORDER.map((moduleKey) => allowedMap.get(moduleKey) ?? null).filter(
    (module): module is NonNullable<ReturnType<typeof getModuleByKey>> => module !== null
  );

  const primaryRole = session?.roles?.[0] ?? 'USUARIO';

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside className="surface h-fit p-4">
      <div className="space-y-5">
        <div className="space-y-2 rounded-lg border border-border/80 bg-background/55 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sessao ativa</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{session?.user?.name ?? session?.user?.email ?? 'Usuario logado'}</p>
            <span className="status-chip">Perfil: {formatRoleLabel(primaryRole)}</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {modules.map((module) => {
            const active = pathname === module.path;
            return <LinkItem key={module.key} href={module.path} label={module.title} active={active} glyph={moduleGlyph[module.key] ?? '*'} />;
          })}
        </nav>

        <div className="space-y-2 rounded-lg border border-border/70 bg-background/55 px-3 py-3 text-sm text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]">Operacao</p>
          <p>Rotas sem permissao nao sao exibidas para este perfil.</p>
        </div>

        <Button variant="secondary" fullWidth onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </aside>
  );
}
