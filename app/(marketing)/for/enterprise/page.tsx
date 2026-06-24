import { Building2, ShieldCheck, BarChart3, ArrowRight, CheckCircle2, Lock, Users } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Auditoría local',
    description: 'Control completo sobre datos sin depender de servicios cloud externos.',
  },
  {
    icon: Building2,
    title: 'Gestión por departamento',
    description: 'Políticas específicas por equipo, proyecto o área funcional.',
  },
  {
    icon: Lock,
    title: 'Seguridad empresarial',
    description: 'Cumplimiento de políticas de seguridad y prevención de fugas de datos.',
  },
  {
    icon: BarChart3,
    title: 'Reportes de productividad',
    description: 'Métricas claras sobre uso de aplicaciones y tiempo productivo.',
  },
  {
    icon: Users,
    title: 'Panel por rol',
    description: 'Vistas diferenciadas para IT, RRHH y gerencia.',
  },
  {
    icon: CheckCircle2,
    title: 'Base autohospedable',
    description: 'Opción de despliegue on-premise para máxima soberanía.',
  },
];

const features = [
  'Auditoría de uso de aplicaciones',
  'Políticas por departamento',
  'Alertas de violación de seguridad',
  'Reportes de productividad',
  'Integración con Active Directory',
  'API para integraciones personalizadas',
];

const useCases = [
  {
    title: 'Equipos de desarrollo',
    description: 'Monitoreo de herramientas y cumplimiento de políticas de seguridad.',
  },
  {
    title: 'Ventas y campo',
    description: 'Control de dispositivos remotos sin invadir privacidad personal.',
  },
  {
    title: 'RRHH y administración',
    description: 'Visibilidad de uso sin vigilancia invasiva de contenido.',
  },
];

export default function ForEnterprisePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_40%)]" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Para empresas</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Auditoría operativa sin vigilancia masiva.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                ByeBut permite a empresas auditar uso de dispositivos y aplicar políticas por departamento, con soberanía técnica y sin convertir la red en un sistema de vigilancia invasiva.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-400 to-teal-400 px-7 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(16,185,129,0.28)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-emerald-300/30 hover:bg-white/10"
                >
                  Ver panel empresarial
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-panel soft-glow relative w-full max-w-[500px] overflow-hidden rounded-[2rem] p-6">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-400/10 via-transparent to-teal-400/5" />
                <div className="relative space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Productividad hoy</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-3xl font-bold text-emerald-300">78%</span>
                      <span className="pb-1 text-sm text-slate-400">tiempo productivo</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Departamentos', value: '8', color: 'text-cyan-300' },
                      { label: 'Dispositivos', value: '142', color: 'text-emerald-300' },
                      { label: 'Alertas', value: '3', color: 'text-orange-300' },
                      { label: 'Cumplimiento', value: '94%', color: 'text-emerald-300' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                        <p className="text-xs text-slate-400">{stat.label}</p>
                        <p className={`mt-2 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Top departamentos</p>
                    <div className="mt-3 space-y-2">
                      {[
                        { name: 'Desarrollo', score: '92%' },
                        { name: 'Ventas', score: '85%' },
                        { name: 'Marketing', score: '78%' },
                      ].map((dept) => (
                        <div key={dept.name} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{dept.name}</span>
                          <span className="font-semibold text-emerald-300">{dept.score}</span>
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Beneficios</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Control operativo con respeto a la privacidad.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <Icon className="h-6 w-6 text-emerald-200" />
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
              ByeBut adaptado a cada área de tu empresa.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                <Building2 className="h-8 w-8 text-emerald-200" />
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
              Herramientas empresariales listas para escalar.
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
            <h2 className="text-2xl font-semibold text-white">¿Listo para auditar con soberanía?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Ofrecemos demos personalizadas y planes empresariales con soporte dedicado y SLA garantizado.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources/billing"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
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
