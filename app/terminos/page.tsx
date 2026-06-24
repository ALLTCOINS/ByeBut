import { ArrowRight, ShieldAlert, Heart, Scale } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    id: 'introduccion',
    title: '1. Introducción',
    content: 'Bienvenido a ByeBut. Al usar nuestra herramienta aceptás estos términos. ByeBut es una herramienta digital diseñada para ayudar a familias e instituciones a promover el uso equilibrado de dispositivos, reducir distracciones y fomentar hábitos saludables.',
  },
  {
    id: 'no-es',
    title: '2. Lo que ByeBut NO es',
    content: null,
    list: [
      'No es un servicio de salud mental ni tratamiento médico.',
      'No reemplaza el acompañamiento familiar ni profesional.',
      'No garantiza resultados específicos en el comportamiento o la adicción a pantallas.',
      'Los resultados dependen de cada caso y del uso combinado con diálogo y supervisión.',
    ],
    icon: ShieldAlert,
  },
  {
    id: 'uso',
    title: '3. Uso de la herramienta',
    content: 'ByeBut te da funciones para configurar reglas, límites y seguimiento. Es tu responsabilidad usarlas de forma razonable y respetando las leyes aplicables en tu país.',
  },
  {
    id: 'salud-mental',
    title: '4. Salud Mental y Uso de Pantallas',
    content: 'Somos conscientes de los desafíos que representan el uso excesivo de dispositivos. ByeBut busca contribuir a una relación más saludable con la tecnología, pero no sustituye consejo médico ni psicológico. Si vos o tus hijos presentan síntomas de adicción o problemas de salud mental, te recomendamos consultar a un profesional calificado.',
    icon: Heart,
  },
  {
    id: 'limitacion',
    title: '5. Limitación de Responsabilidad',
    content: 'ByeBut se ofrece "tal cual". No nos hacemos responsables por:',
    list: [
      'Daños indirectos, pérdida de datos o interrupciones.',
      'Decisiones tomadas basadas en la información de la herramienta.',
      'Problemas causados por mal uso, configuración incorrecta o modificaciones por parte del usuario.',
    ],
    icon: Scale,
  },
  {
    id: 'privacidad',
    title: '6. Privacidad y Datos',
    content: 'Tu privacidad es prioritaria. ByeBut está diseñado para minimizar el envío de datos a terceros y funcionar mayormente de forma local/offline. Ver nuestra Política de Privacidad.',
  },
  {
    id: 'cancelacion',
    title: '7. Cancelación y Reembolsos',
    content: 'Podés cancelar tu suscripción cuando quieras. Aplican las políticas de Mercado Pago.',
  },
  {
    id: 'modificaciones',
    title: '8. Modificaciones',
    content: 'Podemos actualizar estos términos. Te avisaremos de cambios importantes.',
  },
  {
    id: 'ley',
    title: '9. Ley Aplicable',
    content: 'Estos términos se rigen por las leyes de la República Oriental del Uruguay.',
  },
];

export default function TerminosPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Legal</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Términos y Condiciones de Uso
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              ByeBut - Soberanía digital para Latinoamérica
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 p-8 sm:p-12">
            <div className="space-y-12">
              {sections.map((section) => (
                <article key={section.id} className="scroll-mt-24" id={section.id}>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  {section.icon && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                        <section.icon className="h-5 w-5 text-cyan-200" />
                      </div>
                      <span className="text-sm text-slate-400">Sección importante</span>
                    </div>
                  )}
                  {section.content && (
                    <p className="mt-4 text-base leading-7 text-slate-300">{section.content}</p>
                  )}
                  {section.list && (
                    <ul className="mt-4 space-y-3">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-base text-slate-300">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6">
              <h3 className="text-lg font-semibold text-orange-200">Aviso Legal</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Estos términos están redactados con lenguaje accesible pero con cobertura legal razonable. Recomendamos que un abogado los revise antes de publicar para asegurar que cumplan con todas las regulaciones aplicables en tu jurisdicción.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Última actualización: {new Date().toLocaleDateString('es-UY')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-[2rem] border border-white/10 bg-linear-to-r from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">¿Tenés preguntas?</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Si tenés dudas sobre estos términos o el uso de ByeBut, contactanos.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/resources/billing"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Contactar soporte
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <a
                href="https://discord.gg/byebut"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Unirse a Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
