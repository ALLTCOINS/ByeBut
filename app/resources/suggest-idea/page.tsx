'use client';

import { useState } from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SuggestIdeaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setError('');
    const title = formData.get('title');
    const description = formData.get('description');
    const email = formData.get('email');
    const category = formData.get('category');

    if (!title || !description || !email) {
      setError('Por favor completá todos los campos requeridos.');
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'suggestion',
          title,
          description,
          email,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al enviar la sugerencia. Intentá nuevamente.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá nuevamente.');
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <section className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-semibold text-white">Sugerencia enviada</h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Gracias por tu idea. Revisamos todas las sugerencias y las mejores se convierten en funcionalidades reales.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Volver a recursos
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver a recursos
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Comunidad</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Sugerir una idea
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Tenés una idea para mejorar ByeBut? Compartila con nosotros. Las mejores sugerencias se convierten en funcionalidades reales.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 p-8">
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-300" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-white">
                  Título de la idea *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Ej: Integración con Google Calendar"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-white">
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="feature">Nueva funcionalidad</option>
                  <option value="improvement">Mejora existente</option>
                  <option value="integration">Integración con otro servicio</option>
                  <option value="ui">Mejora de interfaz</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-white">
                  Descripción detallada *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Describí tu idea en detalle: qué problema resolvería, cómo la imaginarías funcionando, y por qué sería útil..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white">
                  Tu email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-400 to-fuchsia-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]"
              >
                <Lightbulb className="h-4.5 w-4.5" />
                Enviar sugerencia
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Ideas que implementamos recientemente</h3>
            <ul className="mt-4 space-y-3">
              {[
                'Modo aula para escuelas (sugerido por docentes)',
                'GuardTokens y misiones gamificadas (sugerido por familias)',
                'Panel por departamento para empresas (sugerido por equipos IT)',
              ].map((idea) => (
                <li key={idea} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
