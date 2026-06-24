import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import changelogData from '@/lib/changelog.json';

const changelogEntries = changelogData;

const typeColors: Record<string, string> = {
  feature: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  improvement: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/20',
  release: 'bg-orange-400/10 text-orange-200 border-orange-400/20',
  fix: 'bg-red-400/10 text-red-200 border-red-400/20',
};

const typeLabels: Record<string, string> = {
  feature: 'Novedad',
  improvement: 'Mejora',
  release: 'Lanzamiento',
  fix: 'Corrección',
};

export default function ChangelogPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Changelog</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Historial de actualizaciones
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Seguí el progreso de ByeBut. Cada actualización trae mejoras basadas en feedback real de la comunidad.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {changelogEntries.map((entry) => (
              <article
                key={entry.version}
                className="glass-panel rounded-[1.8rem] border border-white/10 p-8"
              >
                <div className="flex flex-wrap items-center gap-4 sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                      v{entry.version}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${typeColors[entry.type]}`}
                    >
                      {typeLabels[entry.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.date).toLocaleDateString('es-UY', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">{entry.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-400">{entry.description}</p>

                <ul className="mt-6 space-y-2">
                  {entry.changes.map((change) => (
                    <li key={change} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      {change}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
