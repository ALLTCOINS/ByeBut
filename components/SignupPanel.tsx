'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import supabase from '@/lib/supabase/client';

const ALIEN_PREFIXES = ['Centinela', 'Reptiliano', 'Gris', 'Cazador', 'Viajero', 'Comandante', 'Híbrido', 'Cerebro', 'Explorador', 'Guardián', 'Nómada'];
const ALIEN_SUFFIXES = ['Estelar', 'Astral', 'del Cosmos', 'del Vacío', 'Nebular', 'Galáctico', 'Alfa', 'Quantum', 'Mutante', 'Soberano', 'Solar'];
const AVATAR_IDS = ['alien_sentinel', 'alien_reptilian', 'alien_grey', 'alien_void', 'alien_brain'];

function generateRandomName() {
  const prefix = ALIEN_PREFIXES[Math.floor(Math.random() * ALIEN_PREFIXES.length)];
  const suffix = ALIEN_SUFFIXES[Math.floor(Math.random() * ALIEN_SUFFIXES.length)];
  const number = Math.floor(100 + Math.random() * 900);
  return `${prefix} ${suffix} ${number}`;
}

function generateAvatar() {
  return AVATAR_IDS[Math.floor(Math.random() * AVATAR_IDS.length)];
}

export default function SignupPanel({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [fullName, setFullName] = useState('Familia ByeBut');
  const [defaultAvatar, setDefaultAvatar] = useState('alien_sentinel');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const avatarHint = useMemo(() => AVATAR_IDS.find((id) => id === defaultAvatar) ?? 'alien_sentinel', [defaultAvatar]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsHydrated(true);
      setFullName(generateRandomName());
      setDefaultAvatar(generateAvatar());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleRandomizeName = () => {
    setFullName(generateRandomName());
    setDefaultAvatar(generateAvatar());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const redirectUrl = `${window.location.origin}/api/auth/callback?next=/dashboard`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          avatar_url: defaultAvatar,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setSuccessMsg('Registro listo. Revisá tu correo para confirmar la cuenta y seguir al dashboard.');
      setLoading(false);
      return;
    }

    router.refresh();
    router.push('/dashboard');
  };

  return (
    <section className={`${compact ? 'glass-panel rounded-[2rem] p-6 sm:p-8' : 'glass-panel rounded-[2.2rem] p-7 sm:p-9'} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.12),transparent_28%),radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.08),transparent_26%)]" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Registro inteligente</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Abrí tu cuenta en ByeBut</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            {isHydrated ? avatarHint : 'Avatar soberano'}
          </div>
        </div>

        {errorMsg && (
          <p className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <div className="mb-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="font-semibold">Verificación requerida</p>
            <p className="mt-1">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="reg-fullname" className="text-sm font-medium text-slate-300">
                  Nombre completo
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  className="text-xs font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Aleatorio
                </button>
              </div>
              <input
                id="reg-fullname"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Correo electrónico
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="reg-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando cuenta
              </>
            ) : (
              <>
                Empezar gratis
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
