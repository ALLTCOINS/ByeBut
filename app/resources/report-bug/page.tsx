'use client';

import { useState } from 'react';
import { Bug, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ReportBugPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setError('');
    const title = formData.get('title');
    const description = formData.get('description');
    const email = formData.get('email');
    const severity = formData.get('severity');

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
          type: 'bug',
          title,
          description,
          email,
          severity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al enviar el reporte. Intentá nuevamente.');
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
            <h1 className="text-3xl font-semibold text-white">Reporte enviado</h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Gracias por reportar este problema. Nuestro equipo lo revisará y te contactaremos si necesitamos más información.
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-200">Soporte</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Reportar un problema
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Encontraste un bug? Reportalo para que podamos solucionarlo lo antes posible.
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
                  Título del problema *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Ej: El panel no carga en Safari"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-semibold text-white">
                  Severidad
                </label>
                <select
                  id="severity"
                  name="severity"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="low">Baja - No afecta el uso principal</option>
                  <option value="medium">Media - Afecta algunas funcionalidades</option>
                  <option value="high">Alta - Bloquea el uso del producto</option>
                  <option value="critical">Crítica - Problema de seguridad o datos</option>
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
                  placeholder="Describí qué estabas haciendo cuando ocurrió el problema, qué esperabas que sucediera y qué pasó en realidad..."
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(6,182,212,0.25)]"
              >
                <Bug className="h-4.5 w-4.5" />
                Enviar reporte
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Consejos para un buen reporte</h3>
            <ul className="mt-4 space-y-3">
              {[
                'Sé específico sobre qué no funciona',
                'Incluí pasos para reproducir el problema',
                'Mencioná tu navegador y sistema operativo',
                'Adjuntá capturas de pantalla si es posible',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
