'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Debés confirmar tu correo electrónico antes de iniciar sesión.');
      } else if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Correo o contraseña incorrectos. Verificá tus datos e intentá de nuevo.');
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
      return;
    }

    router.refresh();
    const next = searchParams.get('next') || '/dashboard';
    router.push(next);
    setLoading(false);
  };

  return (
    <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-panel soft-glow rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Acceso seguro</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
          Volvé al panel con el mismo estándar soberano.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
          Iniciá sesión para retomar control, revisar misiones, activar reglas y seguir con el estado real de tu red.
        </p>

        <div className="mt-8 space-y-3">
          {[
            'Sesión conectada con Supabase SSR.',
            'Dashboard familiar, escolar y corporativo unificados.',
            'Alertas y pagos sincronizados con tu cuenta.',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-7 sm:p-9">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Bienvenido de vuelta</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Iniciar sesión</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            Control soberano
          </div>
        </div>

        {errorMsg && (
          <p className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-300">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end">
            <Link href="/reset-password" className="text-sm text-cyan-200 hover:text-cyan-100">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-semibold text-cyan-200 hover:text-cyan-100">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center">
        <Suspense fallback={<div className="text-slate-400">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
