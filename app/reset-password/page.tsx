'use client';

import { useState } from 'react';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setSuccessMsg('Te enviamos un correo con las instrucciones para restablecer tu contraseña.');
    setLoading(false);
  };

  return (
    <section className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel soft-glow rounded-[2rem] p-8 sm:p-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-200 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
            
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-cyan-200">Recuperación segura</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Recuperá tu acceso sin perder soberanía.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Te enviaremos un correo con un enlace seguro para restablecer tu contraseña. El enlace expira en 1 hora.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Enlace seguro con token único.',
                'Expiración automática por seguridad.',
                'Sin compartir datos con terceros.',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-7 sm:p-9">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Restablecer contraseña</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Ingresá tu correo</h2>
            </div>

            {errorMsg && (
              <p className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">{errorMsg}</p>
            )}

            {successMsg && (
              <p className="mb-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMsg}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Correo electrónico
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                  placeholder="tu@correo.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando
                  </>
                ) : (
                  <>
                    Enviar enlace
                    <Mail className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Recordaste tu contraseña?{' '}
              <Link href="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
