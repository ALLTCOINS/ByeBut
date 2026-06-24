import { BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const docSections = [
  {
    title: 'Guías de inicio',
    description: 'Configuración inicial para cada tipo de usuario',
    articles: [
      { title: 'Inicio rápido para familias', href: '#' },
      { title: 'Configurar el Device Agent', href: '#' },
      { title: 'Crear perfiles para hijos', href: '#' },
      { title: 'Configurar reglas por edad', href: '#' },
    ],
  },
  {
    title: 'Panel familiar',
    description: 'Funcionalidades específicas para control parental',
    articles: [
      { title: 'Misiones y GuardTokens', href: '#' },
      { title: 'Foco diario y tiempo de uso', href: '#' },
      { title: 'Alertas y notificaciones', href: '#' },
      { title: 'Control remoto de dispositivos', href: '#' },
    ],
  },
  {
    title: 'Panel escolar',
    description: 'Gestión para docentes y administradores',
    articles: [
      { title: 'Configurar modo aula', href: '#' },
      { title: 'Gestionar grupos y clases', href: '#' },
      { title: 'Aprobar solicitudes de estudiantes', href: '#' },
      { title: 'Reportes de actividad', href: '#' },
    ],
  },
  {
    title: 'Panel empresarial',
    description: 'Auditoría y control por departamento',
    articles: [
      { title: 'Configurar departamentos', href: '#' },
      { title: 'Políticas por grupo', href: '#' },
      { title: 'Auditoría de uso de aplicaciones', href: '#' },
      { title: 'Reportes de productividad', href: '#' },
    ],
  },
  {
    title: 'Panel Ceibal',
    description: 'Despliegue institucional a gran escala',
    articles: [
      { title: 'Integración con Plan Ceibal', href: '#' },
      { title: 'Gestión por institución', href: '#' },
      { title: 'Reportes de cumplimiento', href: '#' },
      { title: 'Soporte a gran escala', href: '#' },
    ],
  },
  {
    title: 'Configuración técnica',
    description: 'Guías avanzadas para administradores',
    articles: [
      { title: 'Instalación del Device Agent', href: '#' },
      { title: 'Configuración de red local', href: '#' },
      { title: 'Solución de problemas', href: '#' },
      { title: 'API y webhooks', href: '#' },
    ],
  },
];

export default function DocsPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Documentación</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Guías completas
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Documentación detallada para configurar y usar ByeBut en cada contexto.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {docSections.map((section) => (
              <article
                key={section.title}
                className="glass-panel rounded-[1.8rem] border border-white/10 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <BookOpen className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <p className="text-sm text-slate-400">{section.description}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {section.articles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href={article.href}
                        className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-white">¿No encontrás lo que buscás?</h2>
                <p className="mt-3 text-base leading-7 text-slate-400">
                  Nuestra documentación está en constante expansión. Si necesitás una guía específica, sugerila a través de nuestro formulario.
                </p>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <Link
                  href="/resources/suggest-idea"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Sugerir documentación
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
