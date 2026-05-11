import type { HTMLAttributes } from 'react';

import { cn } from './cn';

// Container visual padrao para secoes, formularios e cards de dashboard.
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-border bg-card p-6 shadow-soft', className)} {...props} />;
}
