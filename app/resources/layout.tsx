import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck, MessageSquare } from 'lucide-react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-linear-to-br from-cyan-300 to-emerald-300 text-slate-950 shadow-[0_12px_40px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none text-white">ByeBut</span>
              <span className="text-xs tracking-[0.14em] text-slate-400 uppercase">Soberanía digital</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <Link href="/" className="transition hover:text-white">Inicio</Link>
            <Link href="/precios" className="transition hover:text-white">Precios</Link>
            <Link href="/demo" className="transition hover:text-white">Demo</Link>
            <Link href="/resources" className="transition hover:text-white">Recursos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(16,185,129,0.20)]"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ByeBut. Soberanía digital para Latinoamérica.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/resources" className="transition hover:text-white">
              Recursos
            </Link>
            <Link href="/terminos" className="transition hover:text-white">
              Términos
            </Link>
            <a
              href="https://discord.gg/byebut"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <MessageSquare className="h-4 w-4" />
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
