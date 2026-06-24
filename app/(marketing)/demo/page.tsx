import Link from 'next/link';
import { ArrowRight, Building2, GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react';

const demos = [
  { title: 'Familia', icon: Users, href: '/dashboard?view=resumen', copy: 'Balance diario, foco por hijo y reglas por edad.' },
  { title: 'Escuelas', icon: GraduationCap, href: '/school?view=overview', copy: 'Modo aula, horarios y políticas escolares.' },
  { title: 'Empresa', icon: Building2, href: '/enterprise?view=overview', copy: 'Inventario local, auditoría y respuesta por riesgo.' },
  { title: 'Ceibal', icon: ShieldCheck, href: '/ceibal?view=overview', copy: 'Control masivo, cumplimiento nacional y reportes.' },
];

export default function DemoPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Demo navegable</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Entrá directo al panel que querés probar.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Cada demo comparte el mismo lenguaje visual, pero responde a una necesidad distinta.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <Link
                key={demo.title}
                href={demo.href}
                className="group glass-panel rounded-[1.6rem] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <Icon className="h-7 w-7 text-cyan-200" />
                <h2 className="mt-5 text-xl font-semibold text-white">{demo.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{demo.copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  Abrir demo
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <Sparkles className="mb-3 h-5 w-5 text-emerald-300" />
          La demo mantiene la estética premium de ByeBut: sin bloques rígidos, con jerarquía clara y foco en uso real.
        </div>
      </div>
    </section>
  );
}
