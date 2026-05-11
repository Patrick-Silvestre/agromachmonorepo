import Link from 'next/link';

// Itens de navegacao da landing publica.
const navItems = [
  { href: '/#equipamentos', label: 'Equipamentos' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#contato', label: 'Contato' }
];

/**
 * Layout para rotas publicas.
 * Mantem o topo de marca e botoes de acesso sem depender de autenticacao.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-shell">
      <header className="public-topbar">
        <div className="public-container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">N</span>
            nex-rural
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="/login" className="rounded-full px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted/55">
              Entrar
            </Link>
            <Link href="/cadastro" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      <div className="public-container public-main">{children}</div>
    </div>
  );
}
