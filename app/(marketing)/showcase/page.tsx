import { Star, Quote, ArrowRight, Users, GraduationCap, Building2, Radar } from 'lucide-react';
import Link from 'next/link';

const testimonials = [
  {
    name: 'María Fernández',
    role: 'Madre de 3 niños',
    segment: 'families',
    content: 'ByeBut cambió la dinámica digital en casa. Los GuardTokens motivan a mis hijos a equilibrar pantalla y estudio, y yo tengo tranquilidad sabiendo que sus datos están seguros.',
    rating: 5,
  },
  {
    name: 'Prof. Carlos Rodríguez',
    role: 'Director, Escuela Técnica #15',
    segment: 'schools',
    content: 'El modo aula es un game changer. Durante exámenes, activamos el bloqueo y los estudiantes se concentran. El sistema de solicitudes permite flexibilidad cuando realmente la necesitan.',
    rating: 5,
  },
  {
    name: 'Ing. Ana Martínez',
    role: 'CTO, TechCorp Uruguay',
    segment: 'enterprise',
    content: 'Necesitábamos auditoría sin vigilancia invasiva. ByeBut nos da visibilidad de productividad por departamento sin invadir la privacidad de contenido. El balance perfecto.',
    rating: 5,
  },
  {
    name: 'Lic. Gustavo Silva',
    role: 'Coordinador, Plan Ceibal',
    segment: 'ceibal',
    content: 'La integración con nuestra infraestructura fue fluida. La lectura de riesgo nos permite intervenir temprano en casos que requieren atención. Una herramienta pensada para escala.',
    rating: 5,
  },
];

const useCases = [
  {
    icon: Users,
    title: 'Familias',
    description: 'Control parental con gamificación y respeto a la privacidad.',
    cases: [
      'Reducción del 40% en tiempo de pantalla no productivo',
      'Mejora en hábitos de estudio gracias a GuardTokens',
      'Padres con visibilidad sin invadir intimidad de contenido',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Escuelas',
    description: 'Gestión de dispositivos durante clases y exámenes.',
    cases: [
      '87% de cumplimiento en modo aula',
      'Reducción de distracciones en exámenes',
      'Docentes con control sin fricción pedagógica',
    ],
  },
  {
    icon: Building2,
    title: 'Empresas',
    description: 'Auditoría operativa con soberanía de datos.',
    cases: [
      '78% de productividad promedio en equipos remotos',
      'Cumplimiento de políticas de seguridad',
      'Visibilidad por departamento sin vigilancia masiva',
    ],
  },
  {
    icon: Radar,
    title: 'Plan Ceibal',
    description: 'Despliegue masivo con lectura de riesgo.',
    cases: [
      '500+ instituciones gestionadas',
      '98% de cumplimiento de políticas',
      'Detección temprana de casos de riesgo',
    ],
  },
];

const stats = [
  { label: 'Familias activas', value: '5K+' },
  { label: 'Escuelas', value: '120+' },
  { label: 'Empresas', value: '45+' },
  { label: 'Dispositivos', value: '50K+' },
];

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Showcase</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Casos reales, resultados medibles.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Descubrí cómo familias, escuelas, empresas y Plan Ceibal usan ByeBut para lograr sus objetivos de control digital con soberanía.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-2xl border border-white/10 p-6 text-center">
                <p className="text-3xl font-bold text-cyan-200">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Testimonios</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Lo que dicen nuestros usuarios.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="glass-panel rounded-2xl border border-white/10 p-8"
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-slate-300">{testimonial.content}</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/60">
                    <Quote className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Casos de uso</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              ByeBut en acción por segmento.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <article
                  key={useCase.title}
                  className="glass-panel rounded-2xl border border-white/10 p-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <Icon className="h-6 w-6 text-cyan-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{useCase.title}</h3>
                      <p className="text-sm text-slate-400">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {useCase.cases.map((caseItem) => (
                      <li key={caseItem} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        {caseItem}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/for/${useCase.title.toLowerCase()}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                  >
                    Ver landing de {useCase.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">¿Querés ser el próximo caso de éxito?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Unite a las familias, escuelas y empresas que ya confían en ByeBut para su control digital soberano.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Empezar ahora
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
