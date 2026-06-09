import '@/app/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'ByeBut – Control Parental Soberano',
  description: 'Plataforma SaaS de control parental que prioriza la privacidad y la soberanía familiar.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
