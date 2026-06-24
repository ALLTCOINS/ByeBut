import { GraduationCap, ShieldCheck, Users, ArrowRight, CheckCircle2, Clock, Lock } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Modo aula integrado',
    description: 'Bloqueo temporal de aplicaciones no educativas durante clases y exámenes.',
  },
  {
    icon: Users,
    title: 'Gestión por grupos',
    description: 'Organizá estudiantes por clase, grado o grupo de estudio.',
  },
  {
    icon: Lock,
    title: 'Soberanía institucional',
    description: 'Datos bajo control de la escuela. Sin terceros ni telemetría externa.',
  },
  {
    icon: Clock,
    title: 'Reportes de actividad',
    description: 'Visibilidad sobre uso de dispositivos y cumplimiento de políticas.',
  },
  {
    icon: Users,
    title: 'Solicitudes de estudiantes',
    description: 'Sistema para que alumnos pidan permisos especiales durante clase.',
  },
  {
    icon: CheckCircle2,
    title: 'Panel por rol',
    description: 'Vistas específicas para docentes, administradores y directivos.',
  },
];

const features = [
  'Modo aula con bloqueo selectivo',
  'Gestión de grupos y clases',
  'Aprobación de solicitudes en tiempo real',
  'Reportes de uso por estudiante',
  'Políticas por grado o materia',
  'Integración con sistemas existentes',
];

const useCases = [
  {
    title: 'Durante clases',
    description: 'Bloqueá redes sociales y juegos mientras el docente explica.',
  },
  {
    title: 'En exámenes',
    description: 'Activá modo examen con restricciones máximas de acceso.',
  },
  {
    title: 'Breaks controlados',
    description: 'Permití acceso recreativo solo en horarios definidos.',
  },
];

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Para escuelas</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Control digital diseñado para el aula.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                ByeBut permite a docentes y administradores gestionar dispositivos durante clases y exámenes, con soberanía institucional y sin fricción para el aprendizaje.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-sky-400 px-7 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(6,182,212,0.28)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/10"
                >
                  Ver panel escolar
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-panel soft-glow relative w-full max-w-[500px] overflow-hidden rounded-[2rem] p-6">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-400/10 via-transparent to-sky-400/5" />
                <div className="relative space-y-4">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Modo aula activo</span>
                      <span className="text-xs font-semibold text-cyan-200">5° A - Matemática</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Estudiantes conectados</p>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        { label: 'En clase', value: '24', color: 'text-emerald-300' },
                        { label: 'Solicitudes', value: '3', color: 'text-orange-300' },
                        { label: 'Bloqueados', value: '0', color: 'text-red-300' },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Solicitudes pendientes</p>
                    <div className="mt-3 space-y-2">
                      {[
                        { name: 'María G.', reason: 'Buscar definición' },
                        { name: 'Juan P.', reason: 'Calculadora' },
                        { name: 'Sofía R.', reason: 'Diccionario' },
                      ].map((req) => (
                        <div key={req.name} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{req.name}</span>
                          <span className="text-xs text-slate-400">{req.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Beneficios</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Herramientas pensadas para docentes y administradores.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <Icon className="h-6 w-6 text-cyan-200" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Casos de uso</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              ByeBut en el día a día escolar.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                <GraduationCap className="h-8 w-8 text-cyan-200" />
                <h3 className="mt-4 text-lg font-semibold text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Funcionalidades</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Todo lo que necesitás para gestionar tu institución.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                <span className="text-base text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">¿Interesado en ByeBut para tu escuela?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Ofrecemos demos personalizadas y planes institucionales con soporte dedicado.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources/billing"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Solicitar cotización
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
