import { SignupForm } from '@/components/auth/signup-form';

// Pagina publica para criacao de conta com escolha de perfil.
export default function RegisterPage() {
  return (
    <main className="space-y-5">
      <section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Cadastro</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Criar conta no webapp nex-rural</h1>
      </section>
      <SignupForm />
    </main>
  );
}
