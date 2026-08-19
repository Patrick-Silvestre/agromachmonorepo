'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Card, Input, Select } from '@/components/ui';

import { useAuth } from '@/hooks/useAuth';

// Perfis que o cadastro publico realmente pode criar (ver com.agromach.entity.Role no backend -
// qualquer outro valor enviado e ignorado e vira CLIENTE la).
const roleOptions = [
  { value: 'CLIENTE', label: 'Produtor / Cliente' },
  { value: 'PRESTADOR', label: 'Prestador de servico' }
];

const defaultRole = roleOptions.at(0)?.value ?? 'CLIENTE';

/**
 * Formulario de cadastro real.
 * Cria conta no backend e inicia sessao automaticamente.
 */
export function SignupForm() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);

  // Envia dados para endpoint de registro e redireciona para dashboard.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await register({ name, email, password, role });
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Criar conta</h2>
          <p className="text-sm text-muted-foreground">Defina seus dados e perfil de acesso para abrir o ambiente correto desde o primeiro login.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">
            Nome
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-sm font-semibold text-foreground">
            E-mail
          </label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="seu-email@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-sm font-semibold text-foreground">
            Senha
          </label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-role" className="text-sm font-semibold text-foreground">
            Perfil de acesso
          </label>
          <Select id="signup-role" value={role} onChange={(event) => setRole(event.currentTarget.value)}>
            {roleOptions.map((roleOption) => (
              <option key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </option>
            ))}
          </Select>
        </div>

        {error ? <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error.message}</p> : null}

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ja tem conta?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
