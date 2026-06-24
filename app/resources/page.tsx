import { BookOpen, MessageSquare, Bug, Lightbulb, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const resourceSections = [
  {
    icon: BookOpen,
    title: 'Documentación',
    description: 'Guías completas para configurar y usar ByeBut en cada contexto.',
    href: '/resources/docs',
    accent: 'from-cyan-400/20 to-sky-400/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Changelog',
    description: 'Historial de actualizaciones y nuevas funcionalidades.',
    href: '/resources/changelog',
    accent: 'from-emerald-400/20 to-teal-400/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: MessageSquare,
    title: 'FAQs',
    description: 'Preguntas frecuentes y respuestas rápidas.',
    href: '/resources/faq',
    accent: 'from-orange-400/20 to-amber-400/10',
    border: 'border-orange-500/20',
  },
  {
    icon: Bug,
    title: 'Reportar un problema',
    description: 'Informar bugs o errores técnicos.',
    href: '/resources/report-bug',
    accent: 'from-red-400/20 to-rose-400/10',
    border: 'border-red-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Sugerir una idea',
    description: 'Proponer nuevas funcionalidades o mejoras.',
    href: '/resources/suggest-idea',
    accent: 'from-violet-400/20 to-fuchsia-400/10',
    border: 'border-violet-500/20',
  },
  {
    icon: CreditCard,
    title: 'Soporte de facturación',
    description: 'Ayuda con pagos, facturas y Mercado Pago.',
    href: '/resources/billing',
    accent: 'from-pink-400/20 to-rose-400/10',
    border: 'border-pink-500/20',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Recursos</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Todo lo que necesitás para usar ByeBut al máximo.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Documentación, guías, soporte y comunidad. Encontrá respuestas rápidas o conectate con nuestro equipo.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resourceSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`group glass-panel relative overflow-hidden rounded-[1.8rem] border ${section.border} p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${section.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{section.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{section.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-200">
                      <span>Explorar</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-white">¿No encontrás lo que buscás?</h2>
                <p className="mt-3 text-base leading-7 text-slate-400">
                  Nuestra comunidad de Discord está activa y lista para ayudar. Unite a otros usuarios, compartí experiencias y obtené respuestas en tiempo real.
                </p>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <a
                  href="https://discord.gg/byebut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-indigo-400"
                >
                  Unirse a Discord
                  <ChevronRight className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
