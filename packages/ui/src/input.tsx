import * as React from 'react';

import { cn } from './cn';

// Input reutilizavel para formularios de login/cadastro e filtros.
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Encapsula estilo e acessibilidade padrao de campos de texto.
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
        className
      )}
      {...props}
    />
  );
});
