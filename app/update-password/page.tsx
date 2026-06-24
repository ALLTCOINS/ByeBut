'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Lock, AlertCircle } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (from the reset link)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setErrorMsg('El enlace de recuperación es inválido o expiró. Solicitá uno nuevo.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setSuccessMsg('Contraseña actualizada exitosamente. Redirigiendo al dashboard...');
    setLoading(false);

    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
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
            
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-cyan-200">Actualización segura</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Definí tu nueva contraseña.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Elegí una contraseña segura que recuerdes. La actualización es inmediata y se aplica a todos tus dispositivos.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Mínimo 6 caracteres.',
                'Almacenamiento encriptado.',
                'Sincronización instantánea.',
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
              <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Nueva contraseña</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Ingresá tu nueva clave</h2>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Confirmar contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                  placeholder="••••••••"
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
                    Actualizando
                  </>
                ) : (
                  <>
                    Actualizar contraseña
                    <Lock className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
