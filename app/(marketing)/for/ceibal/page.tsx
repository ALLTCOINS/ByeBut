import { Radar, ShieldCheck, Building2, ArrowRight, CheckCircle2, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Despliegue institucional',
    description: 'Gestión centralizada para múltiples escuelas y miles de dispositivos.',
  },
  {
    icon: Building2,
    title: 'Integración Ceibal',
    description: 'Compatible con infraestructura y procesos de Plan Ceibal.',
  },
  {
    icon: Radar,
    title: 'Lectura de riesgo',
    description: 'Detección temprana de patrones de uso que requieren intervención.',
  },
  {
    icon: BarChart3,
    title: 'Reportes de cumplimiento',
    description: 'Métricas agregadas por institución, departamento y estudiante.',
  },
  {
    icon: Users,
    title: 'Soporte a gran escala',
    description: 'Infraestructura preparada para despliegues masivos.',
  },
  {
    icon: CheckCircle2,
    title: 'Panel administrativo',
    description: 'Vista consolidada para administradores de Plan Ceibal.',
  },
];

const features = [
  'Gestión por institución',
  'Integración con sistemas Ceibal',
  'Reportes agregados y detallados',
  'Alertas de riesgo y anomalías',
  'API para integraciones',
  'Soporte dedicado institucional',
];

const stats = [
  { label: 'Instituciones', value: '500+' },
  { label: 'Dispositivos', value: '50K+' },
  { label: 'Estudiantes', value: '150K+' },
  { label: 'Cumplimiento', value: '98%' },
];

export default function ForCeibalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_40%)]" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Plan Ceibal</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Despliegue masivo con soberanía institucional.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                ByeBut está diseñado para integrarse con Plan Ceibal, permitiendo gestión centralizada de miles de dispositivos con lectura de riesgo, cumplimiento y soporte a gran escala.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-400 to-fuchsia-400 px-7 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(139,92,246,0.28)]"
                >
                  Contactar equipo
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-violet-300/30 hover:bg-white/10"
                >
                  Ver panel Ceibal
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-panel soft-glow relative w-full max-w-[500px] overflow-hidden rounded-[2rem] p-6">
                <div className="absolute inset-0 bg-linear-to-br from-violet-400/10 via-transparent to-fuchsia-400/5" />
                <div className="relative space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                        <p className="text-xs text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold text-violet-300">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Estado general</span>
                      <span className="text-xs font-semibold text-violet-200">Operativo</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Alertas de riesgo</p>
                    <div className="mt-3 space-y-2">
                      {[
                        { school: 'Escuela 42', level: 'Medio', count: 3 },
                        { school: 'Escuela 87', level: 'Bajo', count: 1 },
                        { school: 'Escuela 156', level: 'Alto', count: 5 },
                      ].map((alert) => (
                        <div key={alert.school} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{alert.school}</span>
                          <span className={`text-xs font-semibold ${
                            alert.level === 'Alto' ? 'text-red-300' : 
                            alert.level === 'Medio' ? 'text-orange-300' : 'text-emerald-300'
                          }`}>
                            {alert.level} ({alert.count})
                          </span>
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Beneficios</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Infraestructura preparada para escala masiva.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <Icon className="h-6 w-6 text-violet-200" />
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Funcionalidades</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Todo lo que necesitás para gestionar Plan Ceibal.
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
            <h2 className="text-2xl font-semibold text-white">¿Interesado en ByeBut para Plan Ceibal?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Ofrecemos integración personalizada, soporte dedicado y SLA garantizado para despliegues institucionales.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources/billing"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-violet-300"
              >
                Contactar equipo técnico
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
