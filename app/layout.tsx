import '@/app/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://byebut.com'),
  title: {
    default: 'ByeBut',
    template: '%s | ByeBut',
  },
  description: 'Control parental soberano, monitoreo local y paneles por rol para familias, escuelas, empresas y Ceibal.',
  keywords: [
    'control parental',
    'privacidad familiar',
    'soberanía digital',
    'Byebut',
    'Ceibal',
    'escuelas',
    'empresas',
    'Mercado Pago',
  ],
  openGraph: {
    type: 'website',
    title: 'ByeBut | Control soberano con paneles por rol',
    description: 'Gestiona familia, escuela y empresa con una arquitectura local-first y sin telemetría invasiva.',
    url: '/',
    siteName: 'ByeBut',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByeBut | Control soberano con paneles por rol',
    description: 'Arquitectura local-first para familias, escuelas, empresas y Plan Ceibal.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${manrope.variable} ${spaceGrotesk.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
