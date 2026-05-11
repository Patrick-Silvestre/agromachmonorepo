import * as React from 'react';

import { cn } from './cn';

// Variantes visuais padrao para botoes do design system.
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

// Classes base por variante.
const styles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:brightness-105',
  secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
  ghost: 'bg-transparent text-foreground hover:bg-muted/50'
};

/**
 * Botao reutilizavel do monorepo.
 * Evita repeticao de estilo e garante consistencia entre paginas/componentes.
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
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70',
        styles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
});
