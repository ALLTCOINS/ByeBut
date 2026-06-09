/* app/(marketing)/layout.tsx */
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 text-gray-100 font-sans antialiased flex flex-col min-h-screen">
      {/* ---------- Navbar ---------- */}
      <header className="border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">ByeBut</h1>
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/precios" className="text-gray-300 hover:text-primary transition-colors">
            Precios
          </Link>
          <Link href="/demo" className="text-gray-300 hover:text-primary transition-colors">
            Demo
          </Link>
          <Link
            href="/registro"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Registrarse
          </Link>
        </nav>
      </header>

      {/* ---------- Main content ---------- */}
      <main className="flex-1 pt-8 pb-12 px-6">{children}</main>

      {/* ---------- Footer ---------- */}
      <footer className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ByeBut – Soberanía digital para Latinoamérica.
      </footer>
    </div>
  );
}
