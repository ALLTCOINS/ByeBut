import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Clock, RefreshCw, Lock } from 'lucide-react';
import Link from 'next/link';
import PricingCTA from './pricing-cta';

const plans = [
  {
    name: 'Individual',
    slug: 'individual',
    price: '$9.90',
    annualPrice: '$95.04',
    cadence: '/ mes',
    devices: '1 dispositivo',
    description: 'Deja que la adicción controle un solo dispositivo menos.',
    features: ['Recupera 2+ horas diarias de tiempo real', 'Extiende vida útil de batería en 30%', 'Reducción de ansiedad digital', 'Panel esencial sin complicaciones'],
  },
  {
    name: 'Familiar',
    slug: 'familiar',
    price: '$14.90',
    annualPrice: '$143.04',
    cadence: '/ mes',
    devices: 'Hasta 5 dispositivos',
    description: 'Protege a toda la familia del consumo de pantalla sin invadir su privacidad.',
    features: ['Perfiles por hijo con reglas por edad', 'Alertas cuando pierden el foco', 'GuardTokens que motivan el buen uso', 'Soberanía de datos familiar'],
    highlighted: true,
  },
  {
    name: 'Institucional',
    slug: 'institucional',
    price: 'Desde $49',
    annualPrice: 'Desde $470',
    cadence: '/ mes',
    devices: 'Escuelas y empresas',
    description: 'Protege la inversión en dispositivos y recupera productividad perdida.',
    features: ['Extiende vida útil de laptops Ceibal en 40%', 'Ahorra energía y reduce huella de carbono', 'Paneles por rol sin vigilancia masiva', 'Base autohospedable para soberanía total'],
  },
];

const trustSignals = [
  {
    icon: Lock,
    title: '7 días de garantía',
    description: 'Si no estás satisfecho, te devolvemos el dinero sin preguntas.',
  },
  {
    icon: RefreshCw,
    title: 'Cancelá cuando quieras',
    description: 'Sin penalidades ni contratos forzados. Tu libertad primero.',
  },
  {
    icon: Clock,
    title: 'Soporte 24/7',
    description: 'Equipo disponible en Discord y email para ayudarte.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Planes</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Precio simple para una arquitectura seria.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Empezá con familia y escalá a organizaciones sin cambiar la filosofía: datos propios, reglas claras y paneles accionables.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

        <div className="mt-12 grid gap-5 xl:grid-cols-[1.1fr_1.1fr_0.9fr]">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`glass-panel relative overflow-hidden rounded-[1.8rem] p-6 transition duration-300 hover:-translate-y-1 ${
                plan.highlighted ? 'border-cyan-400/30' : 'border-white/10'
              }`}
            >
              {plan.highlighted && <div className="absolute inset-0 bg-linear-to-br from-cyan-400/10 via-transparent to-emerald-400/10" />}
              <div className="relative">
                {plan.highlighted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Más elegido
                  </span>
                )}
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{plan.description}</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-cyan-200" />
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-semibold text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-400">{plan.cadence}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{plan.devices}</p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <PricingCTA plan={plan.slug} highlighted={plan.highlighted} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <ArrowRight className="h-4 w-4 text-cyan-200" />
          <span>Pago seguro con Mercado Pago. Confirmaciones y alertas por correo con Resend.</span>
          <Link href="/demo" className="text-cyan-200 hover:text-cyan-100">
            Ver demo
          </Link>
        </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold text-white">Por qué elegir ByeBut</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.title} className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <Icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{signal.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{signal.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-white">Preguntas frecuentes sobre precios</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: '¿Hay descuento por pago anual?',
                a: 'Sí, los planes anuales tienen un 20% de descuento. Pagás 10 meses y recibís 12.',
              },
              {
                q: '¿Puedo cambiar de plan?',
                a: 'Sí, podés cambiar de plan en cualquier momento desde el panel de cuenta. El cambio se aplica en el próximo ciclo de facturación.',
              },
              {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos todos los métodos de Mercado Pago: tarjetas, dinero en cuenta, y otros métodos locales de LATAM.',
              },
              {
                q: '¿Los datos son realmente soberanos?',
                a: 'Sí, tus datos se almacenan localmente en tu red. Solo compartimos lo que vos decidas explícitamente.',
              },
            ].map((item) => (
              <div key={item.q} className="glass-panel rounded-2xl border border-white/10 p-6">
                <h3 className="text-base font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-white">¿Necesitás una cotización personalizada?</h2>
                <p className="mt-3 text-base leading-7 text-slate-400">
                  Para escuelas, empresas o despliegues institucionales grandes, ofrecemos planes personalizados con soporte dedicado.
                </p>
              </div>
              <div className="flex items-center justify-start lg:justify-end">
                <Link
                  href="/resources/billing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Contactar ventas
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
