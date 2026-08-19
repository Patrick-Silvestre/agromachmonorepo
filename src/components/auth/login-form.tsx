'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Card, Input } from '@/components/ui';

import { useAuth } from '@/hooks/useAuth';

/**
 * Formulario de login real.
 * Usa o contexto de auth para autenticar e redirecionar para dashboard.
 */
export function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Envia credenciais para backend e abre area privada em caso de sucesso.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch {
      // Error is already handled in context.
    }
  }

  return (
    <Card className="mx-auto w-full max-w-[560px] space-y-6 p-7 sm:p-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-2xl text-primary">N</span>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h2>
          <p className="text-sm text-muted-foreground">Entre com sua conta nex-rural para acessar apenas os modulos liberados para seu perfil.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu-email@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-sm font-semibold text-foreground">
              Senha
            </label>
            <span className="text-sm font-medium text-primary">Esqueceu?</span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
          />
        </div>

        {error ? <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error.message}</p> : null}

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Nao tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </Card>
  );
}
