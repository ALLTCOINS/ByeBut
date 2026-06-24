import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const faqCategories = [
  {
    title: 'General',
    questions: [
      {
        q: '¿Qué es ByeBut?',
        a: 'ByeBut es un sistema de control parental soberano que combina monitoreo local, gestión por rol y una arquitectura local-first. A diferencia de otras soluciones, tus datos nunca salen de tu red sin tu consentimiento explícito.',
      },
      {
        q: '¿En qué plataformas funciona?',
        a: 'ByeBut funciona en Windows, macOS y Linux a través del Device Agent. El panel web es accesible desde cualquier navegador moderno en dispositivos móviles y de escritorio.',
      },
      {
        q: '¿Es seguro usar ByeBut?',
        a: 'Sí, ByeBut está diseñado con seguridad y privacidad como prioridades. Usamos encriptación de extremo a extremo, autenticación segura con Supabase, y nunca compartimos tus datos con terceros sin tu consentimiento.',
      },
    ],
  },
  {
    title: 'Familias',
    questions: [
      {
        q: '¿Cómo configuro reglas por edad?',
        a: 'Desde el panel familiar, podés crear perfiles para cada hijo y asignar presetas de edad que ajustan automáticamente las reglas de contenido y tiempo de uso.',
      },
      {
        q: '¿Qué son los GuardTokens?',
        a: 'Los GuardTokens son una recompensa gamificada que tus hijos pueden ganar cumpliendo misiones y manteniendo hábitos saludables. Canjealos por tiempo extra de pantalla u otros privilegios.',
      },
      {
        q: '¿Puedo monitorear en tiempo real?',
        a: 'Sí, el panel familiar muestra actividad en tiempo real, incluyendo aplicaciones activas, tiempo de uso y alertas de reglas violadas.',
      },
    ],
  },
  {
    title: 'Escuelas y Empresas',
    questions: [
      {
        q: '¿Cómo funciona el modo aula?',
        a: 'El modo aula permite a los docentes bloquear temporalmente aplicaciones no educativas durante clases. Los estudiantes pueden solicitar permisos especiales que el docente aprueba o rechaza.',
      },
      {
        q: '¿Puedo auditar el uso en mi empresa?',
        a: 'Sí, el panel empresarial proporciona auditoría local por departamento, con reportes de uso de aplicaciones, tiempo productivo y alertas de políticas violadas.',
      },
      {
        q: '¿Ofrecen descuentos institucionales?',
        a: 'Sí, ofrecemos planes especiales para escuelas y empresas. Contactanos a través de /resources/billing para obtener una cotización personalizada.',
      },
    ],
  },
  {
    title: 'Pagos y Facturación',
    questions: [
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos pagos a través de Mercado Pago, incluyendo tarjetas de crédito, débito, dinero en cuenta y otros métodos locales de LATAM.',
      },
      {
        q: '¿Puedo cancelar mi suscripción?',
        a: 'Sí, podés cancelar tu suscripción en cualquier momento desde el panel de cuenta. Continuarás teniendo acceso hasta el final del período de facturación.',
      },
      {
        q: '¿Ofrecen factura?',
        a: 'Sí, generamos facturas automáticas para todos los pagos a través de Mercado Pago. Las reciben en tu correo electrónico registrado.',
      },
    ],
  },
  {
    title: 'Soporte Técnico',
    questions: [
      {
        q: '¿Cómo reporto un bug?',
        a: 'Usá el formulario en /resources/report-bug para reportar problemas técnicos. Incluí tantos detalles como posible para ayudarnos a reproducir y solucionar el issue.',
      },
      {
        q: '¿Dónde puedo obtener ayuda?',
        a: 'Además de estas FAQs, podés unirte a nuestra comunidad de Discord, consultar la documentación en /resources/docs, o contactarnos directamente a través del formulario de soporte.',
      },
      {
        q: '¿Cómo sugiero una nueva funcionalidad?',
        a: 'Usá el formulario en /resources/suggest-idea para proponer mejoras. Revisamos todas las sugerencias y muchas de ellas se convierten en features reales.',
      },
    ],
  },
];

export default function FAQPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">FAQs</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Preguntas frecuentes
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Respuestas rápidas a las preguntas más comunes sobre ByeBut.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold text-white">{category.title}</h2>
              <div className="space-y-4">
                {category.questions.map((item, idx) => (
                  <FAQItem key={idx} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <HelpCircle className="h-6 w-6 text-cyan-200" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">¿No encontrás tu respuesta?</h3>
                <p className="mt-2 text-base leading-7 text-slate-400">
                  Nuestra comunidad de Discord está activa y lista para ayudar. También podés contactarnos directamente.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href="https://discord.gg/byebut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
                  >
                    Unirse a Discord
                  </a>
                  <Link
                    href="/resources/report-bug"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Reportar problema
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-panel overflow-hidden rounded-2xl border border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/5"
      >
        <span className="text-base font-semibold text-white">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-white/10 px-6 py-5">
          <p className="text-base leading-7 text-slate-300">{answer}</p>
        </div>
      )}
    </div>
  );
}
