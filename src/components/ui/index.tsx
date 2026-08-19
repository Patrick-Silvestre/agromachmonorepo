import * as React from 'react';
import type { HTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Junta classes condicionais e resolve conflitos do Tailwind.
 *
 * Exemplo:
 * cn('px-2', active && 'bg-primary', 'px-4') devolve a classe final sem
 * manter utilitarios conflitantes de padding.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'border border-primary bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:brightness-110',
  secondary: 'border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/40',
  ghost: 'border border-transparent bg-transparent text-foreground hover:bg-muted/50'
};

/**
 * Botao padrao do projeto.
 *
 * - `variant="primary"`: acao principal da tela.
 * - `variant="secondary"`: acao de apoio, como atualizar dados.
 * - `variant="ghost"`: acao discreta em barras e menus.
 * - `fullWidth`: ocupa toda a largura, util em formularios.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', fullWidth = false, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0',
        buttonStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
});

/**
 * Container visual para cards reais: formulario, metrica, resumo ou modulo.
 * Mantem borda/sombra consistentes para evitar repetir classes em cada tela.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-border/85 bg-card p-6 shadow-soft transition duration-200', className)} {...props} />;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Campo de texto padronizado.
 * Usa `forwardRef` porque formularios e bibliotecas podem precisar focar o input.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
        className
      )}
      {...props}
    />
  );
});

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

/**
 * Label + descricao curta acima de um campo. Reduz repeticao nos formularios.
 */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
