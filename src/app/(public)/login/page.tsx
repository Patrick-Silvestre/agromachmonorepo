import { LoginForm } from '@/components/auth/login-form';

// Pagina publica de autenticacao (entrada do usuario no sistema).
export default function LoginPage() {
  return (
    <main className="space-y-5">
      <section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Acesso</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Entrar no webapp nex-rural</h1>
      </section>
      <LoginForm />
    </main>
  );
}
