'use client';

import { useMemo, useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { AGE_PRESETS } from '@/lib/age-presets';

export default function RulesManagement() {
  const presets = useMemo(() => Object.values(AGE_PRESETS), []);
  const [activePreset, setActivePreset] = useState(presets[0]?.ageRange ?? '4-7');

  const preset = presets.find((item) => item.ageRange === activePreset) ?? presets[0];

  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-white">Plantillas de reglas</h3>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {presets.map((item) => (
          <button
            key={item.ageRange}
            onClick={() => setActivePreset(item.ageRange)}
            className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
              activePreset === item.ageRange
                ? 'border-cyan-400/40 bg-cyan-400/10 text-white'
                : 'border-white/8 bg-white/5 text-white/70'
            }`}
          >
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-white/55">{item.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-white/8 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">{preset?.label}</p>
        <ul className="mt-2 space-y-2 text-xs text-white/65">
          {preset?.rules.map((rule) => (
            <li key={rule.label} className="flex items-start gap-2">
              <Plus className="mt-0.5 h-3.5 w-3.5 text-cyan-300" />
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
