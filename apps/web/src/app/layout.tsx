import type { Metadata } from 'next';
import { Manrope, Urbanist } from 'next/font/google';

import { AuthProvider } from '@/components/auth/auth-provider';

import './globals.css';

// Fonte para titulos e elementos de destaque visual.
const heading = Urbanist({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700']
});

// Fonte principal para texto corrido do sistema.
const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600']
});

// Metadados base do app (titulo e descricao para browser/SEO).
export const metadata: Metadata = {
  title: 'Nex Rural',
  description: 'Plataforma operacional Nex Rural conectada ao backend Spring Boot'
};

/**
 * Layout raiz do Next App Router.
 * Envolve todas as rotas com estilos globais e contexto de autenticacao.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${heading.variable} ${body.variable} bg-background text-foreground antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
