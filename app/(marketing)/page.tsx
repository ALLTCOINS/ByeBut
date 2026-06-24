import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  GraduationCap,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Users,
} from 'lucide-react';
import SignupPanel from '@/components/SignupPanel';
import SustainabilityCalculator from '@/components/SustainabilityCalculator';

const audiences = [
  {
    icon: Users,
    title: 'Familias',
    copy: 'Tus hijos no viven en la pantalla. ByeBut devuelve el tiempo perdido, reduce la ansiedad digital y reconecta la familia sin invadir privacidad.',
    accent: 'from-orange-400/20 to-amber-400/10',
    border: 'border-orange-500/20',
  },
  {
    icon: GraduationCap,
    title: 'Escuelas',
    copy: 'Laptops Ceibal que se agotan en dos años. Alumnos distraídos en clase. ByeBut extiende la vida útil de los dispositivos y recupera el foco educativo.',
    accent: 'from-cyan-400/20 to-sky-400/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Building2,
    title: 'Empresas',
    copy: 'Productividad evaporada por notificaciones infinitas. Dispositivos de empresa desgastados. ByeBut recupera horas de trabajo y ahorra energía real.',
    accent: 'from-emerald-400/20 to-teal-400/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Radar,
    title: 'Plan Ceibal',
    copy: 'Miles de laptops públicas agotadas por uso descontrolado. Presupuesto que se va en baterías en lugar de educación. ByeBut protege la inversión nacional.',
    accent: 'from-violet-400/20 to-fuchsia-400/10',
    border: 'border-violet-500/20',
  },
];

const advantages = [
  {
    label: 'Soberanía primero',
    value: 'Local-first + P2P',
    copy: 'Menos dependencia, más control real sobre lo que ocurre en cada red.',
  },
  {
    label: 'Conversión',
    value: 'Funnel corto',
    copy: 'Landing, demo y precios hablan el mismo idioma: resolver rápido y con confianza.',
  },
  {
    label: 'Revenue',
    value: 'Mercado Pago + Resend',
    copy: 'Checkout claro, email transaccional y retención con alertas accionables.',
  },
];

const systemSignals = [
  'Monitoreo local en tiempo real',
  'Paneles por rol con permisos claros',
  'Misiones y GuardTokens integrados',
  'Rutas comerciales listas para escalar',
];

const comparison = [
  {
    name: 'ByeBut',
    best: true,
    bullets: ['Datos soberanos', 'Paneles por rol', 'Misión + GuardTokens', 'Móvil y web unificados', 'Checkout nativo'],
  },
  {
    name: 'Suites genéricas',
    bullets: ['Telemetría centralizada', 'UX genérica', 'Reglas rígidas', 'Poca identidad de marca', 'Onboarding frío'],
  },
  {
    name: 'Herramientas aisladas',
    bullets: ['Mucho plugin', 'Poca coherencia', 'Sin contexto familiar', 'Difícil de auditar', 'Más fricción comercial'],
  },
];

const mediaCards = [
  {
    title: 'Panel familiar',
    subtitle: 'Balance, misiones y decisiones rápidas',
    src: '/hero-landing.svg',
  },
  {
    title: 'Operación en tiempo real',
    subtitle: 'Acción local y respuesta inmediata',
    src: '/hero-landing.svg',
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-slate-950 text-white selection:bg-cyan-500/30">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 tech-grid opacity-[0.22]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(6,182,212,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_50%_92%,rgba(249,115,22,0.10),transparent_26%)]" />

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <CircleDot className="h-3.5 w-3.5" />
              Soberanía digital para familias, escuelas y empresas
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Tus hijos no nacieron para{' '}
              <span className="bg-linear-to-r from-orange-300 via-red-300 to-rose-300 bg-clip-text text-transparent">
                vivir en la pantalla
              </span>
              <br />
              pero ahí están atrapados.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              ByeBut recupera el tiempo perdido, extiende la vida útil de dispositivos y reduce la ansiedad digital. Sin vigilancia masiva, con soberanía real.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/registro"
                className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-emerald-400 px-7 py-4 text-sm font-bold text-slate-950 shadow-[0_18px_60px_rgba(6,182,212,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(16,185,129,0.30)] hover-lift gradient-shimmer"
              >
                Empezar ahora
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10 hover-lift"
              >
                Ver demostración
                <ChevronRight className="h-4.5 w-4.5" />
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {systemSignals.map((signal) => (
                <div key={signal} className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
                    <span>{signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="glass-panel soft-glow relative w-full max-w-[640px] overflow-hidden rounded-[2rem] p-4">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-cyan-400/5" />
              <div className="relative grid gap-4">
                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/70">
                    <Image
                      src={mediaCards[0].src}
                      alt={mediaCards[0].title}
                      width={1200}
                      height={900}
                      priority
                      loading="eager"
                      className="h-full w-full object-cover opacity-92"
                    />
                    <div className="border-t border-white/10 p-4">
                      <p className="text-sm font-semibold text-white">{mediaCards[0].title}</p>
                      <p className="mt-1 text-xs text-slate-400">{mediaCards[0].subtitle}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.18em] text-cyan-200">Acción local</span>
                        <Lock className="h-4 w-4 text-cyan-300" />
                      </div>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                          <span className="text-sm text-slate-300">Foco diario</span>
                          <span className="text-sm font-semibold text-emerald-300">87%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                          <span className="text-sm text-slate-300">GuardTokens</span>
                          <span className="text-sm font-semibold text-orange-300">+150</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                          <span className="text-sm text-slate-300">Estado</span>
                          <span className="text-sm font-semibold text-cyan-300">Sincronizado</span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/70">
                      <Image
                        src={mediaCards[1].src}
                        alt={mediaCards[1].title}
                        width={1200}
                        height={900}
                        className="h-full w-full object-cover opacity-85"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {advantages.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                      <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Registro integrado</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              El onboarding vive aquí, donde ya entendiste el valor.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              No te mandamos a una página vacía para registrarte. La decisión ocurre en contexto: ves el producto, comparás, entendés el problema y recién ahí dejás tus datos.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Menos fricción, más conversión.',
                'Registro coherente con la estética de la marca.',
                'Identidad y avatar desde el primer paso.',
                'Ruta de pago y seguimiento listas.',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <SignupPanel compact />
        </div>
      </section>

      <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/95 to-[#07111f]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Diseñado por segmento</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
              Un sistema, cuatro experiencias con el mismo estándar visual.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`group glass-panel relative overflow-hidden rounded-[1.8rem] border ${item.border} p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="glass-panel rounded-[2rem] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Por qué ByeBut</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Mejor que una plataforma genérica porque no obliga a elegir entre control y privacidad.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-400">
              El valor no está en sumar funciones sueltas. Está en que cada panel hable el idioma del contexto:
              familia, escuela, empresa o Ceibal.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Conversa con la familia, no con métricas vacías.',
                'Convierte con una interfaz seria y clara.',
                'Mantiene soberanía técnica y narrativa de marca.',
              ].map((line) => (
                <div key={line} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
                  <span className="text-sm text-slate-200">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {comparison.map((item) => (
              <article
                key={item.name}
                className={`glass-panel rounded-[1.8rem] p-6 ${item.best ? 'border-cyan-400/30' : ''}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    {item.best && (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">Nuestra propuesta</p>
                    )}
                  </div>
                  {item.best ? (
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      Mejor ajuste
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                      Genérica
                    </span>
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <CheckCircle2 className={`h-4 w-4 ${item.best ? 'text-emerald-300' : 'text-slate-500'}`} />
                      {bullet}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Sostenibilidad</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Menos pantalla, más vida útil para tus dispositivos y para el planeta.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Cada hora que optimizás reduce el desgaste de baterías de litio, baja el consumo energético y disminuye tu huella de carbono.
            </p>
          </div>

          <div className="mt-10">
            <SustainabilityCalculator />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Conversión</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Un flujo claro, sin carnaval visual ni ruido comercial.
              </h2>
            </div>
            <Link
              href="/precios"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-300/30 hover:bg-white/10"
            >
              Ver precios
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: '1. Entendé el valor',
                text: 'Landing con propuesta clara y diferenciada, no una lista de features vacía.',
              },
              {
                title: '2. Probalo rápido',
                text: 'Demo y paneles por rol para reducir fricción y aumentar confianza.',
              },
              {
                title: '3. Convertí con seguridad',
                text: 'Checkout con Mercado Pago y correo transaccional con Resend.',
              },
            ].map((step) => (
              <div key={step.title} className="glass-panel rounded-[1.8rem] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  {step.title}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-[2rem] border border-slate-800 bg-linear-to-r from-slate-900 to-slate-950 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_0%_100%,rgba(6,182,212,0.10),transparent_30%)]" />
          <div className="relative z-10 text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-white">Innovación con identidad propia.</h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              ByeBut no quiere parecer otra suite SaaS. Quiere sentirse como infraestructura confiable, elegante y lista para producir.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
            >
              Crear cuenta
              <Smartphone className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explorar demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
