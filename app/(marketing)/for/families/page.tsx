import { Users, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Clock, Target } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Control soberano',
    description: 'Tus datos se quedan en tu red. Sin telemetría invasiva ni terceros.',
  },
  {
    icon: Users,
    title: 'Perfiles por hijo',
    description: 'Reglas personalizadas según edad y madurez de cada niño.',
  },
  {
    icon: Sparkles,
    title: 'GuardTokens gamificados',
    description: 'Sistema de recompensas que motiva hábitos digitales saludables.',
  },
  {
    icon: Clock,
    title: 'Foco diario',
    description: 'Objetivos de tiempo productivo con métricas claras.',
  },
  {
    icon: Target,
    title: 'Misiones y desafíos',
    description: 'Actividades que fomentan equilibrio entre pantalla y vida real.',
  },
  {
    icon: CheckCircle2,
    title: 'Alertas en tiempo real',
    description: 'Notificaciones cuando se violan reglas o se alcanzan objetivos.',
  },
];

const features = [
  'Control de tiempo de uso por dispositivo',
  'Bloqueo de aplicaciones por categoría',
  'Recomendaciones de contenido por edad',
  'Panel web y móvil unificado',
  'Reportes de actividad semanal',
  'Control remoto desde cualquier lugar',
];

const pricing = [
  {
    name: 'Individual',
    price: '$9.90',
    devices: '1 dispositivo',
    features: ['Control básico', 'Reglas por dispositivo', 'Panel esencial'],
  },
  {
    name: 'Familiar',
    price: '$14.90',
    devices: 'Hasta 5 dispositivos',
    features: ['Perfiles por hijo', 'GuardTokens', 'Alertas y foco', 'Recomendaciones por edad'],
    highlighted: true,
  },
];

export default function ForFamiliesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_40%)]" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Para familias</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Control parental que respeta la privacidad de tu familia.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                ByeBut combina monitoreo local, reglas por edad y gamificación para crear hábitos digitales saludables sin sacrificar soberanía ni intimidad.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-400 to-amber-400 px-7 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(249,115,22,0.28)]"
                >
                  Empezar gratis
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-orange-300/30 hover:bg-white/10"
                >
                  Ver demo
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-panel soft-glow relative w-full max-w-[500px] overflow-hidden rounded-[2rem] p-6">
                <div className="absolute inset-0 bg-linear-to-br from-orange-400/10 via-transparent to-amber-400/5" />
                <div className="relative space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Foco diario</span>
                      <span className="text-2xl font-bold text-orange-300">87%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[87%] rounded-full bg-linear-to-r from-orange-400 to-amber-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                      <p className="text-xs text-slate-400">GuardTokens</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-300">+150</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                      <p className="text-xs text-slate-400">Misiones</p>
                      <p className="mt-2 text-2xl font-bold text-cyan-300">12/15</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                    <p className="text-sm font-semibold text-white">Actividad hoy</p>
                    <div className="mt-3 space-y-2">
                      {['Educación: 2h 15m', 'Entretenimiento: 1h 30m', 'Social: 45m'].map((item) => (
                        <div key={item} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{item}</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
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
              Todo lo que necesitás para criar hijos digitales saludables.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <Icon className="h-6 w-6 text-orange-200" />
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
              Herramientas poderosas, simples de usar.
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

      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Precios</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Planes diseñados para familias reales.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`glass-panel relative overflow-hidden rounded-[1.8rem] p-6 transition duration-300 hover:-translate-y-1 ${
                  plan.highlighted ? 'border-orange-400/30' : 'border-white/10'
                }`}
              >
                {plan.highlighted && <div className="absolute inset-0 bg-linear-to-br from-orange-400/10 via-transparent to-amber-400/10" />}
                <div className="relative">
                  {plan.highlighted && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Recomendado
                    </span>
                  )}
                  <div className="mt-5">
                    <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{plan.devices}</p>
                  </div>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-semibold text-white">{plan.price}</span>
                    <span className="pb-1 text-sm text-slate-400">/ mes</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/registro"
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition ${
                      plan.highlighted
                        ? 'bg-linear-to-r from-orange-400 to-amber-400 text-slate-950 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(249,115,22,0.25)]'
                        : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Comenzar
                    <ArrowRight className="h-4.5 w-4.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/precios" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
              Ver todos los planes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">¿Listo para empezar?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Probá ByeBut gratis durante 7 días. Sin tarjeta de crédito, sin compromiso.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-orange-300"
              >
                Crear cuenta gratis
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
