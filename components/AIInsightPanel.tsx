'use client';

import { Brain, Radar, Sparkles, ShieldAlert } from 'lucide-react';

const INSIGHTS = [
  { label: 'Puntaje de riesgo', value: '12%', tone: 'text-emerald-200' },
  { label: 'Predicción de ausencias', value: 'Baja', tone: 'text-cyan-200' },
  { label: 'Anomalías de uso', value: '2', tone: 'text-amber-200' },
];

export default function AIInsightPanel() {
  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-300" />
        <h3 className="text-sm font-semibold text-white">Guard IA</h3>
      </div>

      <p className="mt-3 text-sm text-white/65">
        Resume patrones de comportamiento, detecta desvíos tempranos y sugiere intervención local.
      </p>

      <div className="mt-4 space-y-2">
        {INSIGHTS.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs">
            <span className="text-white/60">{item.label}</span>
            <span className={`font-medium ${item.tone}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-white/5 px-2 py-3 text-white/65">
          <Radar className="mx-auto mb-1 h-4 w-4 text-violet-300" />
          Patrón
        </div>
        <div className="rounded-lg bg-white/5 px-2 py-3 text-white/65">
          <Sparkles className="mx-auto mb-1 h-4 w-4 text-cyan-300" />
          Sugerencia
        </div>
        <div className="rounded-lg bg-white/5 px-2 py-3 text-white/65">
          <ShieldAlert className="mx-auto mb-1 h-4 w-4 text-amber-300" />
          Alerta
        </div>
      </div>
    </section>
  );
}
